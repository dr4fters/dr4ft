const crypto = require("crypto");
const {shuffle, truncate} = require("lodash");
const uuid = require("uuid");
const jsonfile = require("jsonfile");
const Bot = require("./bot");
const Human = require("./human");
const Pool = require("./pool");
const Room = require("./room");
const Rooms = require("./rooms");
const logger = require("./logger");
const Sock = require("./sock");
const {saveDraftStats, getDataDir} = require("./data");
const path = require("path");

module.exports = class Game extends Room {
  constructor({ hostId, title, seats, type, sets, cube, isPrivate, modernOnly, totalChaos, chaosPacksNumber, picksPerPack }) {
    super({ isPrivate });
    const gameID = uuid.v1();
    Object.assign(this, {
      title, seats, type, isPrivate, modernOnly, totalChaos, cube, chaosPacksNumber, picksPerPack,
      delta: -1,
      hostID: hostId,
      id: gameID,
      players: [],
      round: 0,
      bots: 0,
      sets: sets || [],
      isDecadent: false,
      secret: uuid.v4(),
      logger: logger.child({ id: gameID })
    });
    // Handle packsInfos to show various informations about the game
    switch(type) {
    case "draft":
    case "sealed":
      this.packsInfo = this.sets.join(" / ");
      this.rounds = this.sets.length;
      break;
    case "decadent draft":
      // Sets should all be the same and there can be a large number of them.
      // Compress this info into e.g. "36x IKO" instead of "IKO / IKO / ...".
      this.packsInfo = `${this.sets.length}x ${this.sets[0]}`;
      this.rounds = this.sets.length;
      this.isDecadent = true;
      break;
    case "cube draft":
      this.packsInfo = `${cube.packs} packs with ${cube.cards} cards from a pool of ${cube.list.length} cards`;
      this.rounds = this.cube.packs;
      break;
    case "cube sealed":
      this.packsInfo = `${cube.cubePoolSize} cards per player from a pool of ${cube.list.length} cards`;
      this.rounds = this.cube.packs;
      break;
    case "chaos draft":
    case "chaos sealed": {
      const chaosOptions = [];
      chaosOptions.push(`${this.chaosPacksNumber} Packs`);
      chaosOptions.push(modernOnly ? "Modern sets only" : "Not modern sets only");
      chaosOptions.push(totalChaos ? "Total Chaos" : "Not Total Chaos");
      this.packsInfo = `${chaosOptions.join(", ")}`;
      this.rounds = this.chaosPacksNumber;
      break;
    }
    default:
      this.packsInfo = "";
    }

    if (cube) {
      Object.assign(this, {
        cubePoolSize: cube.cubePoolSize,
        packsNumber: cube.packs,
        playerPackSize: cube.cards
      });
    }

    this.renew();
    Rooms.add(gameID, this);
    this.once("kill", () => Rooms.delete(gameID));
    Game.broadcastGameInfo();
  }

  renew() {
    const NINETY_MINUTES = 1000 * 60 * 90;
    this.expires = Date.now() + NINETY_MINUTES;
  }

  get isActive() {
    return this.players.some(x => x.isActive);
  }

  get didGameStart() {
    return this.round !== 0;
  }

  get isGameFinished() {
    return this.round === -1;
  }

  get isGameInProgress() {
    return this.didGameStart && !this.isGameFinished;
  }

  // The number of total games. This includes ones that have been long since
  // abandoned but not yet garbage-collected by the `renew` mechanism.
  static numGames() {
    return Rooms.getAll().length;
  }

  // The number of games which have a player still in them.
  static numActiveGames() {
    return Rooms.getAll()
      .filter(({isActive}) => isActive)
      .length;
  }

  // The number of players in active games.
  static totalNumPlayers() {
    return Rooms.getAll()
      .filter(({isActive}) => isActive)
      .reduce((count, {players}) => {
        return count + players.filter(x => x.isConnected && !x.isBot).length;
      }, 0);
  }

  static broadcastGameInfo() {
    Sock.broadcast("set", {
      numPlayers: Game.totalNumPlayers(),
      numGames: Game.numGames(),
      numActiveGames: Game.numActiveGames(),
    });
    Game.broadcastRoomInfo();
  }

  static broadcastRoomInfo() {
    Sock.broadcast("set", { roomInfo: Game.getRoomInfo() });
  }

  static getRoomInfo() {
    return Rooms.getAll()
      .filter(({isPrivate, didGameStart, isActive}) => !isPrivate && !didGameStart && isActive)
      .reduce((acc, game) => {
        const usedSeats = game.players.length;
        const totalSeats = game.seats;
        if (usedSeats === totalSeats)
          return acc;

        acc.push({
          id: game.id,
          title: game.title,
          usedSeats,
          totalSeats,
          name: game.name,
          packsInfo: game.packsInfo,
          type: game.type,
          timeCreated: game.timeCreated,
        });
        return acc;
      }, []);
  }

  name(name, sock) {
    super.name(name, sock);
    sock.h.name = sock.name;
    this.meta();
  }

  join(sock) {
    // Reattach sock to player based on his id
    const reattachPlayer = this.players.some((player) => {
      if (player.id === sock.id) {
        this.logger.debug(`${sock.name} re-joined the game`);
        player.err("only one window active");
        player.attach(sock);
        if (!this.didGameStart) {
          this.players.push(player);
        }
        this.greet(player);
        this.meta();
        super.join(sock);
        return true;
      }
    });

    if (reattachPlayer) {
      return;
    }

    if (this.didGameStart) {
      return sock.err("game already started");
    }

    if (this.players.length >= this.seats) {
      return sock.err("game is full");
    }

    super.join(sock);
    this.logger.debug(`${sock.name} joined the game`);

    function regularDraftPickDelegate(index) {
      index.sort(function(a, b){return b-a;});
      let cards=[];
      let pack = this.packs.shift();
      for (var i = 0; i < index.length; i++) {
        cards.push( pack.splice(index[i], 1)[0]);
        logger.info(`GameID: ${this.GameId}, player ${this.name}, picked: ${cards[i].name}`);
        this.draftLog.pack.push( [`--> ${cards[i].name}`].concat(pack.map(x => `    ${x.name}`)) );
        this.pool.push(cards[i]);
        let pickcard = cards[i].name;
        if (cards[i].foil === true)
          pickcard = "*" + pickcard + "*";
        this.picks.push(pickcard);
        this.updateDraftStats(this.draftLog.pack[ this.draftLog.pack.length-index.length ], this.pool);
        this.send("add", cards[i]);
      }

      let [next] = this.packs;
      if (!next)
        this.time = 0;
      else
        this.sendPack(next);
      this.autopickIndex = [];
      this.emit("pass", pack);
    }

    function decadentDraftPickDelegate(index) {
      index.sort(function(a, b){return b-a;});
      let cards=[];

      const pack = this.packs.shift();
      for (var i = 0; i < index.length; i++) {
        cards.push( pack.splice(index[i], 1)[0]);
        this.draftLog.pack.push( [`--> ${cards[i].name}`].concat(pack.map(x => `    ${x.name}`)) );
        this.updateDraftStats(this.draftLog.pack[ this.draftLog.pack.length-1 ], this.pool);

        let pickcard = cards[i].name;
        if (cards[i].foil === true)
          pickcard = "*" + pickcard + "*";

        this.pool.push(cards[i]);
        this.picks.push(pickcard);
        this.send("add", cards[i]);
      }
      let [next] = this.packs;
      if (!next)
        this.time = 0;
      else
        this.sendPack(next);

      // Discard the rest of the cards in the pack
      // after one is chosen.
      pack.length = 0;

      this.autopickIndex = [];
      this.emit("pass", pack);
    }

    const draftPickDelegate = this.isDecadent ? decadentDraftPickDelegate : regularDraftPickDelegate;

    const h = new Human(sock, draftPickDelegate, this.picksPerPack,this.id);
    if (h.id === this.hostID) {
      h.isHost = true;
      sock.once("start", this.start.bind(this));
      sock.removeAllListeners("kick");
      sock.on("kick", this.kick.bind(this));
      sock.removeAllListeners("swap");
      sock.on("swap", this.swap.bind(this));
    }
    h.on("meta", this.meta.bind(this));
    this.players.push(h);
    this.greet(h);
    this.meta();
  }

  swap([i, j]) {
    const l = this.players.length;

    if (j < 0 || j >= l)
      return;

    [this.players[i], this.players[j]] = [this.players[j], this.players[i]];

    this.players.forEach((p, i) => p.send("set", { self: i }));
    this.meta();
  }

  kick(i) {
    const h = this.players[i];
    if (!h || h.isBot)
      return;

    this.logger.debug(`${h.name} is being kicked from the game`);
    if (this.didGameStart)
      h.kick();
    else
      h.exit();

    h.err("you were kicked");
    h.kick();
  }

  greet(h) {
    h.isConnected = true;
    h.send("set", {
      isHost: h.isHost,
      round: this.round,
      self: this.players.indexOf(h),
      sets: this.sets,
      gameId: this.id
    });
    h.send("gameInfos", {
      type: this.type,
      packsInfo: this.packsInfo,
      sets: this.sets,
      picksPerPack: this.picksPerPack
    });

    if (this.isGameFinished) {
      h.send("log", h.draftLog.round);
    }
  }

  exit(sock) {
    super.exit(sock);
    if (this.didGameStart)
      return;

    sock.removeAllListeners("start");
    const index = this.players.indexOf(sock.h);
    this.players.splice(index, 1);

    this.players.forEach((p, i) => p.send("set", { self: i }));
    this.meta();
  }

  meta(state = {}) {
    state.players = this.players.map(p => ({
      hash: p.hash,
      name: p.name,
      time: p.time,
      packs: p.packs.length,
      isBot: p.isBot,
      isConnected: p.isConnected,
    }));
    state.gameSeats = this.seats;
    this.players.forEach((p) => p.send("set", state));
    Game.broadcastGameInfo();
  }

  kill(msg) {
    if (!this.isGameFinished) {
      this.players.forEach(p => p.err(msg));
    }

    Rooms.delete(this.id);
    Game.broadcastGameInfo();
    this.logger.debug("is being shut down");

    this.emit("kill");
  }

  uploadDraftStats() {
    const draftStats = this.cube
      ? { list: this.cube.list }
      : { sets: this.sets };
    draftStats.id = this.id;
    draftStats.draft = {};

    this.players.forEach((p) => {
      if (!p.isBot) {
        draftStats.draft[p.id] = p.draftStats;
      }
    });

    saveDraftStats(this.id, draftStats);
  }

  end() {
    this.logger.debug("game ended");
    this.players.forEach((p) => {
      if (!p.isBot) {
        p.send("log", p.draftLog.round);
      }
    });
    const cubeHash = /cube/.test(this.type)
      ? crypto.createHash("SHA512").update(this.cube.list.join("")).digest("hex")
      : "";

    const draftcap = {
      "gameID": this.id,
      "players": this.players.length - this.bots,
      "type": this.type,
      "sets": this.sets,
      "seats": this.seats,
      "time": Date.now(),
      "cap": this.players.map((player, seat) => ({
        "id": player.id,
        "name": player.name,
        "seat": seat,
        "picks": player.cap.packs,
        "cubeHash": cubeHash
      }))
    };

    const file = path.join(getDataDir(), "cap.json");
    jsonfile.writeFile(file, draftcap, { flag: "a" }, function (err) {
      if (err) logger.error(err);
    });

    this.renew();
    this.round = -1;
    this.meta({ round: -1 });
    if (["cube draft", "draft"].includes(this.type)) {
      this.uploadDraftStats();
    }
  }

  pass(p, pack) {
    if (!pack.length) {
      if (!--this.packCount)
        this.startRound();
      else
        this.meta();
      return;
    }

    const index = this.players.indexOf(p) + this.delta;
    const nextPlayer = this.getNextPlayer(index);
    nextPlayer.getPack(pack);
    if (!nextPlayer.isBot) {
      this.meta();
    }
  }

  startRound() {
    const { players } = this;
    if (this.round !== 0) {
      players.forEach((p) => {
        p.cap.packs[this.round] = p.picks;
        p.picks = [];
        if (!p.isBot) {
          p.draftLog.round[this.round] = p.draftLog.pack;
          p.draftLog.pack = [];
        }
      });
    }

    if (this.round++ === this.rounds) {
      return this.end();
    }

    this.logger.debug("new round started");

    this.packCount = players.length;
    this.delta *= -1;

    players.forEach((p) => {
      if (!p.isBot) {
        p.pickNumber = 0;
        const pack = this.pool.shift();
        p.getPack(pack);
        p.send("set", { packSize: pack.length });
      }
    });

    //let the bots play
    this.meta = () => { };
    let index = players.findIndex(p => !p.isBot);
    let count = players.length;
    while (--count) {
      index -= this.delta;
      const p = this.getNextPlayer(index);
      if (p.isBot)
        p.getPack(this.pool.shift());
    }
    this.meta = Game.prototype.meta;
    this.meta({ round: this.round });
  }

  getStatus() {
    const { players, didGameStart, round } = this;
    return {
      didGameStart: didGameStart,
      currentPack: round,
      players: players.map((player, index) => ({
        playerName: player.name,
        id: player.id,
        seatNumber: index
      }))
    };
  }

  getDecks({ seat, id }) {
    if (typeof seat == "number") {
      const player = this.players[seat];
      return player.getPlayerDeck();
    }

    if (typeof id == "string") {
      const player = this.players.find(p => p.id === id);
      return player.getPlayerDeck();
    }

    return this.players.map((player) => player.getPlayerDeck());
  }


  createPool() {
    switch (this.type) {
    case "cube draft": {
      this.pool = Pool.DraftCube({
        cubeList: this.cube.list,
        playersLength: this.players.length,
        packsNumber: this.cube.packs,
        playerPackSize: this.cube.cards
      });
      break;
    }
    case "cube sealed": {
      this.pool = Pool.SealedCube({
        cubeList: this.cube.list,
        playersLength: this.players.length,
        playerPoolSize: this.cubePoolSize
      });
      break;
    }
    case "draft":
    case "decadent draft": {
      this.pool = Pool.DraftNormal({
        playersLength: this.players.length,
        sets: this.sets
      });
      break;
    }

    case "sealed": {
      this.pool = Pool.SealedNormal({
        playersLength: this.players.length,
        sets: this.sets
      });
      break;
    }
    case "chaos draft": {
      this.pool = Pool.DraftChaos({
        playersLength: this.players.length,
        packsNumber: this.chaosPacksNumber,
        modernOnly: this.modernOnly,
        totalChaos: this.totalChaos
      });
      break;
    }
    case "chaos sealed": {
      this.pool = Pool.SealedChaos({
        playersLength: this.players.length,
        packsNumber: this.chaosPacksNumber,
        modernOnly: this.modernOnly,
        totalChaos: this.totalChaos
      });
      break;
    }
    default: throw new Error(`Type ${this.type} not recognized`);
    }
  }

  handleSealed() {
    this.round = -1;
    this.players.forEach((p) => {
      p.pool = this.pool.shift();
      p.send("pool", p.pool);
      p.send("set", { round: -1 });
    });
  }

  handleDraft() {
    const {players, useTimer, timerLength} = this;

    players.forEach((p, self) => {
      p.useTimer = useTimer;
      p.timerLength = timerLength;
      p.self = self;
      p.on("pass", this.pass.bind(this, p));
      p.send("set", { self });
    });

    this.startRound();
  }

  shouldAddBots() {
    return this.addBots && !this.isDecadent;
  }

  start({ addBots, useTimer, timerLength, shufflePlayers }) {
    try {
      Object.assign(this, { addBots, useTimer, timerLength, shufflePlayers });
      this.renew();

      if (this.shouldAddBots()) {
        while (this.players.length < this.seats) {
          this.players.push(new Bot(this.picksPerPack,this.id));
          this.bots++;
        }
      }

      if (shufflePlayers) {
        this.players = shuffle(this.players);
      }

      this.createPool();

      if (/sealed/.test(this.type)) {
        this.handleSealed();
      } else {
        this.handleDraft();
      }

      this.logger.info(`Game ${this.id} started.\n${this.toString()}`);
      Game.broadcastGameInfo();
    } catch(err) {
      this.logger.error(`Game ${this.id} encountered an error while starting: ${err.stack} GameState: ${this.toString()}`);
      this.players.forEach(player => {
        if (!player.isBot) {
          player.exit();
          player.err("Whoops! An error occurred while starting the game. Please try again later. If the problem persists, you can open an issue on the Github repository: <a href='https://github.com/dr4fters/dr4ft/issues'>https://github.com/dr4fters/dr4ft/issues</a>");
        }
      });
      Rooms.delete(this.id);
      Game.broadcastGameInfo();
      this.emit("kill");
    }
  }

  toString() {
    return `
    Game State
    ----------
    id: ${this.id}
    hostId: ${this.hostID}
    title: ${this.title}
    seats: ${this.seats}
    type: ${this.type}
    sets: ${this.sets}
    isPrivate: ${this.isPrivate}
    picksPerPack: ${this.picksPerPack}
    modernOnly: ${this.modernOnly}
    totalChaos: ${this.totalChaos}
    chaosPacksNumber: ${this.chaosPacksNumber}
    packsInfos: ${this.packsInfo}
    players: ${this.players.length} (${this.players.filter(pl => !pl.isBot).map(pl => pl.name).join(", ")})
    bots: ${this.bots}
    ${this.cube ?
    `cubePoolSize: ${this.cube.cubePoolSize}
    packsNumber: ${this.cube.packs}
    playerPackSize: ${this.cube.cards}
    cube: ${truncate(this.cube.list, 30)}`
    : ""}`;
  }

  getNextPlayer(index) {
    const {length} = this.players;
    return this.players[(index % length + length) % length];
  }
};
