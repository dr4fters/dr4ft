const Player = require("./player");
const util = require("./util");
const hash = require("./hash");
const {random, pull, find, pullAt, remove, times, sample, chain} = require("lodash");
const logger = require("./logger");

module.exports = class extends Player {
  constructor(sock, picksPerPack, burnsPerPack, gameId) {
    super({
      isBot: false,
      isConnected: true,
      name: sock.name,
      id: sock.id,
    });
    this.GameId = gameId;
    this.picksPerPack = picksPerPack;
    this.burnsPerPack = burnsPerPack;
    this.attach(sock);
    this.autopicks = [];
    this.burnPickCardIds = [];
  }

  attach(sock) {
    if (this.sock && this.sock !== sock)
      this.sock.ws.close();

    sock.mixin(this);
    sock.removeAllListeners("pickState");
    sock.on("pickState", this._pickState.bind(this));
    sock.removeAllListeners("pick");
    sock.on("pick", this._pick.bind(this));
    sock.removeAllListeners("hash");
    sock.on("hash", this._hash.bind(this));
    sock.once("exit", this._farewell.bind(this));

    let [pack] = this.packs;
    if (pack)
      this.send("pack", pack);
    this.send("pool", this.pool);
  }
  err(message) {
    this.send("error", message);
  }
  _hash(deck) {
    if (!util.deck(deck, this.pool)){
      logger.warn(`wrong deck submitted for hashing by ${this.name}`);
      return;
    }
    this.hash = hash(deck);
    this.emit("meta");
  }
  _farewell() {
    this.isConnected = false;
    this.send = () => {};
    this.emit("meta");
  }
  _pickState(state) {
    this.autopicks = state.autopicks;
    this.burnPickCardIds = state.burns;
  }
  _pick() {
    this.pick();
  }
  getPack(pack) {
    if (this.packs.push(pack) === 1)
      this.sendPack(pack);
  }
  sendPack(pack) {
    if (this.useTimer) {
      let timer = [];
      // http://www.wizards.com/contentresources/wizards/wpn/main/documents/magic_the_gathering_tournament_rules_pdf1.pdf pp43
      // official WOTC timings are
      // pick #, time in seconds)
      // (1,40)(2,40)(3,35)(4,30)(5,25)(6,25)(7,20)(8,20)(9,15)(10,10)(11,10)(12,5)(13,5)(14,5)(15,0)
      const MTRTimes = [40, 40, 35, 30, 25, 25, 20, 20, 15, 10, 10, 5, 5, 5, 5];
      // whereas MTGO starts @ 75s and decrements by 5s per pick
      const MTGOTimes = [75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 12, 10];
      // and here's a happy medium
      timer = [55, 51, 47, 43, 38, 34, 30, 26, 22, 18, 14, 13, 11, 9, 7];
      if (this.timerLength === "Fast") {
        timer = MTRTimes;
      }
      if (this.timerLength === "Slow") {
        timer = MTGOTimes;
      }
      if (this.timerLength === "Leisurely") {
        timer = [90,85,80,75,70,65,60,55,50,45,40,35,30,25];
      }
      // if a pack has more than 15 cards in it, add the average decrement on to the first picks
      if (pack.length + this.picks.length > 15) {
        for (let x = 15; x < (pack.length + this.picks.length); x++) {
          timer.splice(0, 0, ((timer[0] + ((timer[0] + timer[timer.length - 1]) / timer.length))) | 0);
        }
      }
      this.time = timer[this.picks.length];
    }
    else {
      this.time = 0;
    }

    this.send("pickNumber", ++this.pickNumber);
    this.send("pack", pack);
  }
  updateDraftStats(pack, pool) {
    this.draftStats.push({
      picked: chain(pack)
        .filter(card => this.autopicks.includes(card.cardId))
        .map(card => card.name)
        .value(),
      notPicked: chain(pack)
        .filter(card => !this.autopicks.includes(card.cardId))
        .map(card => card.name)
        .value(),
      pool: pool.map(card => card.name)
    });
  }
  pick() {
    const pack = this.packs.shift();
    this.autopicks.forEach((cardId) => {
      const card = find(pack, c => c.cardId === cardId);
      if (!card) {
        return;
      }
      pull(pack, card);
      logger.info(`GameID: ${this.GameId}, player ${this.name}, picked: ${card.name}`);
      this.draftLog.pack.push( [`--> ${card.name}`].concat(pack.map(x => `    ${x.name}`)) );
      this.pool.push(card);
      const pickcard = card.foil ? "*" + card.name + "*" : card.name ;
      this.picks.push(pickcard);
      this.send("add", card);
    });

    // Remove burned cards from pack
    remove(pack, (card) => this.burnPickCardIds.includes(card.cardId));
    const cardsToBurn = Math.min(pack.length, this.burnsPerPack) - this.burnPickCardIds.length;
    times(cardsToBurn, () => {
      const card = sample(pack);
      pull(pack, card);
    });

    const [next] = this.packs;
    if (!next)
      this.time = 0;
    else
      this.sendPack(next);

    // reset state
    this.autopicks = [];
    this.burnPickCardIds = [];

    this.updateDraftStats(this.draftLog.pack, this.pool);

    this.emit("pass", pack);
  }
  pickOnTimeout() {
    //TODO: filter instead of removing a copy of a pack
    const pack = this.packs.slice(0);
    const min = Math.min(pack.length, this.picksPerPack);
    if (this.autopicks.length < min) {
      // Remove autopick cards from selection
      pullAt(pack, this.autopicks);

      const remainingCardsToPick = min - this.autopicks.length;
      times(remainingCardsToPick, () => {
        const randomCard = sample(pack);
        this.autopicks.push(randomCard.cardId);
        pull(pack, randomCard);
      });
    }

    this.pick();
  }
  kick() {
    this.send = () => {};
    while(this.packs.length)
      this.pickOnTimeout();
    this.sendPack = this.pickOnTimeout;
    this.isBot = true;
  }
};
