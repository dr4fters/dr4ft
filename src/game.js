let _ = require("./_");
let Bot = require("./bot");
let Human = require("./human");
let Pool = require("./pool");
let Room = require("./room");
const Rooms = require("./rooms");
const logger = require("./logger");
const uuid = require("uuid");
let Sock = require("./sock");

let SECOND = 1000;
let MINUTE = 1000 * 60;
let HOUR   = 1000 * 60 * 60;

let games = {};

(function playerTimer() {
  for (var id in games) {
    var game = games[id];
    if (game.round < 1)
      continue;
    for (var p of game.players)
      if (p.time && !--p.time)
        p.pickOnTimeout();
  }
  setTimeout(playerTimer, SECOND);
})();

(function gameTimer() {
  var now = Date.now();
  for (var id in games)
    if (games[id].expires < now)
      games[id].kill("game over");

  setTimeout(gameTimer, MINUTE);
})();

module.exports = class Game extends Room {
  constructor({hostId, title, seats, type, sets, cube, isPrivate, fourPack, modernOnly, totalChaos}) {
    super({isPrivate});
    this.modernOnly = modernOnly;
    this.totalChaos = totalChaos;
    this.bots = 0;

    if (sets) {
      if (fourPack) {
        sets = sets.slice(0,4);
      }
      if (type != "chaos") {
        Object.assign(this, {
          sets,
          packsInfo: sets.join(" / ")
        });
      } else {
        this.packsInfo = "";
      }
    } else {
      let packsInfo = (type === "cube draft") ? cube.packs + "x" + cube.cards : "";
      Object.assign(this, { cube, packsInfo });
    }

    var gameID = _.id();
    const secret = uuid.v4();
    Object.assign(this, { title, seats, type, isPrivate,
      delta: -1,
      hostID: hostId,
      id: gameID,
      players: [],
      round: 0,
      rounds: cube ? cube.packs : 3,
      secret
    });
    this.renew();
    games[gameID] = this;

    Rooms.add(gameID, this);
    this.once("kill", () => Rooms.delete(gameID));
    Game.broadcastGameInfo();
  }

  renew() {
    this.expires = Date.now() + HOUR;
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
    return Object.keys(games).length;
  }

  // The number of games which have a player still in them.
  static numActiveGames() {
    let count = 0;
    for (let id of Object.keys(games)) {
      if (games[id].isActive)
        count++;
    }
    return count;
  }

  // The number of players in active games.
  static totalNumPlayers() {
    let count = 0;
    for (let id of Object.keys(games)) {
      if (games[id].isActive) {
        count += games[id].players.filter(x => x.isConnected && !x.isBot).length;
      }
    }
    return count;
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
    let roomInfo = [];
    for (let id of Object.keys(games)) {
      let game = games[id];
      if (game.isPrivate || game.didGameStart || !game.isActive)
        continue;

      let usedSeats = game.players.length;
      let totalSeats = game.seats;
      if (usedSeats === totalSeats)
        continue;

      roomInfo.push({
        id: game.id,
        title: game.title,
        usedSeats,
        totalSeats,
        name: game.name,
        packsInfo: game.packsInfo,
        type: game.type,
        timeCreated: game.timeCreated,
      });
    }
    Sock.broadcast("set", { roomInfo: roomInfo });
  }

  name(name, sock) {
    super.name(name, sock);
    sock.h.name = sock.name;
    this.meta();
  }

  join(sock) {
    for (var i = 0; i < this.players.length; i++) {
      var p = this.players[i];
      if (p.id === sock.id) {
        p.attach(sock);
        this.greet(p);
        this.meta();
        super.join(sock);
        return;
      }
    }

    if (this.didGameStart)
      return sock.err("game already started");

    super.join(sock);

    var h = new Human(sock);
    if (h.id === this.hostID) {
      h.isHost = true;
      sock.once("start", this.start.bind(this));
      sock.on("kick", this.kick.bind(this));
      sock.on("swap", this.swap.bind(this));
    }
    h.on("meta", this.meta.bind(this));
    this.players.push(h);
    this.greet(h);
    this.meta();
  }

  swap(players) {
    let i = players[0],
      j = players[1],
      l = this.players.length;

    if( j < 0 || j >= l  )
      return;

    [this.players[i], this.players[j]] = [this.players[j], this.players[i]];

    this.players.forEach((p, i) =>
      p.send("set", { self: i }));
    this.meta();
  }

  kick(i) {
    let h = this.players[i];
    if (!h || h.isBot)
      return;

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
      packsInfo: this.packsInfo,
    });
  }

  exit(sock) {
    if (this.didGameStart)
      return;

    sock.removeAllListeners("start");
    var index = this.players.indexOf(sock.h);
    this.players.splice(index, 1);

    this.players.forEach((p, i) =>
      p.send("set", { self: i }));
    this.meta();
  }

  meta(state={}) {
    state.players = this.players.map(p => ({
      hash: p.hash,
      name: p.name,
      time: p.time,
      packs: p.packs.length,
      isBot: p.isBot,
      isConnected: p.isConnected,
      isReadyToStart: p.isReadyToStart,
    }));
    for (var p of this.players)
      p.send("set", state);
    Game.broadcastGameInfo();
  }

  kill(msg) {
    if (!this.isGameFinished)
      this.players.forEach(p => p.err(msg));

    delete games[this.id];
    Game.broadcastGameInfo();

    this.emit("kill");
  }

  end() {
    var humans = 0;
    for (var p of this.players)
      if (!p.isBot) {
        humans++;
        p.send("log", p.draftLog.round);
      }

    var draftcap = {
      "gameID": this.id,
      "players": humans,
      "type": this.type,
      "sets": this.sets,
      "seats": this.seats,
      "time": Date.now(),
      "cap": []
    };
    var seatnumber = 0;
    for (var player of this.players) {
      seatnumber++;
      var playercap = {
        "id": player.id,
        "name": player.name,
        "ip": player.ip,
        "seat": seatnumber,
        "picks": player.cap.packs
      };
      draftcap.cap.push(playercap);
    }
    var jsonfile = require("jsonfile");
    var file = "./data/cap.json";
    jsonfile.writeFile(file, draftcap, {flag: "a"}, function (err) {
      if (err) logger.error(err);});

    this.renew();
    this.round = -1;
    this.meta({ round: -1 });
  }

  pass(p, pack) {
    if (!pack.length) {
      if (!--this.packCount)
        this.startRound();
      else
        this.meta();
      return;
    }

    var index = this.players.indexOf(p) + this.delta;
    var p2 = _.at(this.players, index);
    p2.getPack(pack);
    if (!p2.isBot)
      this.meta();
  }

  startRound() {
    if (this.round != 0) {
      for (let p of this.players) {
        p.cap.packs[this.round] = p.picks;
        p.picks = [];
        if(!p.isBot) {
          p.draftLog.round[this.round] = p.draftLog.pack;
          p.draftLog.pack = [];
        }
      }
    }
    if (this.round++ === this.rounds)
      return this.end();

    var {players} = this;
    this.packCount = players.length;
    this.delta *= -1;

    for (let p of players)
      if (!p.isBot)
        p.getPack(this.pool.pop());

    //let the bots play
    this.meta = ()=>{};
    var index = players.findIndex(p => !p.isBot);
    var count = players.length;
    while (--count) {
      index -= this.delta;
      let p = _.at(players, index);
      if (p.isBot)
        p.getPack(this.pool.pop());
    }
    this.meta = Game.prototype.meta;
    this.meta({ round: this.round });
  }

  hash(h, deck) {
    h.hash = this.hash(deck);
    this.meta();
  }

  getStatus() {
    const {players, didGameStart, round} = this;
    return {
      didGameStart: didGameStart,
      currentPack: round,
      players: players.map((player, index) => (
        {
          playerName: player.name,
          id: player.id,
          isReadyToStart: player.isReadyToStart,
          seatNumber: index
        }
      ))
    };
  }

  getDecks({seat, id}) {
    if(typeof seat == "number") {
      const player = this.players[seat];
      return this._getPlayerDeck(player, seat);
    }

    if(typeof id == "string") {
      const player = this.players.find(p => p.id == id);
      const seat = this.players.findIndex(p => p.id == id);
      return this._getPlayerDeck(player, seat);
    }

    return this.players.map(this._getPlayerDeck);
  }

  _getPlayerDeck(player, seat) {
    return {
      seatNumber: seat,
      playerName: player.name,
      id: player.id,
      pool: player.pool.map(card => card.name),
    };
  }

  start({addBots, useTimer, timerLength, shufflePlayers}) {
    var src = this.cube ? this.cube : this.sets;
    var {players} = this;
    var p;

    if (!players.every(x => x.isReadyToStart))
      return;

    Object.assign(this, {addBots, useTimer, timerLength, shufflePlayers});
    this.renew();

    if (/sealed/.test(this.type)) {
      this.round = -1;
      var pools = Pool(src, players.length, true);
      for (p of players) {
        p.pool = pools.pop();
        p.send("pool", p.pool);
        p.send("set", { round: -1 });
      }
      Game.broadcastGameInfo();
      return;
    }

    for (p of players) {
      p.useTimer = useTimer;
      p.timerLength = timerLength;
    }

    Game.broadcastGameInfo();
    if (addBots)
      while (players.length < this.seats) {
        players.push(new Bot);
        this.bots++;
      }

    if(shufflePlayers)
      _.shuffle(players);

    if (/chaos/.test(this.type)) {
      this.pool = Pool(src, players.length, true, true, this.modernOnly, this.totalChaos);
    }
    else
      this.pool = Pool(src, players.length);

    players.forEach((p, i) => {
      p.on("pass", this.pass.bind(this, p));
      p.send("set", { self: i });
    });
    this.startRound();
    logger.info(`Game ${this.id} started. ${this.players.length} players ${this.bots} bots type ${this.type} infos ${this.packsInfo}`);
  }
};
