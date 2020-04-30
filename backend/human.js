const Player = require("./player");
const util = require("./util");
const hash = require("./hash");
const {random} = require("lodash");
const logger = require("./logger");

module.exports = class extends Player {
  constructor(sock, draftFns = {}) {
    super({
      isBot: false,
      isConnected: true,
      name: sock.name,
      id: sock.id
    });
    let callbacks = Object.assign(
      {},
      {
        autopick: this.constructor._autopick,
        pick: this.constructor._pick,
        defaultPickIndexes: () => [ null ],
      },
      draftFns
    );
    this.callbacks = callbacks;
    this.autopickIndexes = callbacks.defaultPickIndexes();
    this.attach(sock);
  }

  attach(sock) {
    if (this.sock && this.sock !== sock)
      this.sock.ws.close();

    sock.mixin(this);
    sock.removeAllListeners("autopick");
    sock.on("autopick", this.callbacks.autopick.bind(this));
    sock.removeAllListeners("pick");
    sock.on("pick", this.callbacks.pick.bind(this));
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
  static _autopick(index) {
    let [pack] = this.packs;
    if (pack && index < pack.length)
      this.autopickIndexes[0] = index;
  }
  static _pick(index) {
    let [pack] = this.packs;
    if (pack && index < pack.length)
      this.constructor.pick.apply(this, [index]);
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
    let picked;
    const notPicked = [];
    for (const card in pack) {
      pack[card].charAt(0) === "-" ?
        picked = pack[card].slice(4) :
        notPicked.push( pack[card].slice(4) );
    }
    let namePool = pool.map(card => card.name);
    this.draftStats.push( { picked, notPicked, pool: namePool } );
  }
  static pick(index) {

    const logPick = (card, pack) => {
      this.draftLog.pack.push(
        [`--> ${card.name}`].concat(
          pack.map(x => `    ${x.name}`)
        )
      );
      this.updateDraftStats(
        this.draftLog.pack[ this.draftLog.pack.length-1 ],
        this.pool
      );
    };

    const pickCardDo = (card) => {
      let foilNameMaybe = card.name;
      if (card.foil === true)
        foilNameMaybe = "*" + foilNameMaybe + "*";
      this.pool.push(card);
      this.picks.push(foilNameMaybe);
      this.send("add", card);
    };

    const pickCard = (index) => {
      const pack = this.packs[0];
      const card = pack.splice(index, 1)[0];
      logPick(card, pack);
      pickCardDo(card);
    };

    const burnCard = (index) => {
      const pack = this.packs[0];
      const card = pack.splice(index, 1)[0];
      logPick(card, pack);
    };

    const keepThePack = () => {
      const pack = this.packs[0];
      if (!pack)
        this.time = 0;
      else
        this.sendPack(pack);
      this.autopickIndexes.splice(0, 1);
      this.emit("keep", pack);
      return Symbol("ok");
    };

    const sendNextPackToFrontendMaybe = () => {
      let [next] = this.packs;
      if (!next)
        this.time = 0;
      else
        this.sendPack(next);
      return Symbol("ok");
    };

    const passThePack = () => {
      const pack = this.packs.shift();
      this.autopickIndexes = this.callbacks.defaultPickIndexes();
      sendNextPackToFrontendMaybe();
      this.emit("pass", pack);
      return Symbol("ok");
    };

    const endRound = passThePack;

    const pickDo = () => {
      const pack = this.packs[0];
      const indexes = this.autopickIndexes;
      const picksTotal = this.callbacks.defaultPickIndexes().length;
      if (indexes.length === picksTotal) {
        pickCard(index);
        if (pack.length === 0)
          return endRound();
        else if (picksTotal === 1)
          return passThePack();
        else
          return keepThePack();
      } else if (indexes.length === 1) {
        burnCard(index);
        return passThePack();
      } else {
        burnCard(index);
        if (pack.length === 0)
          return endRound();
        else
          return keepThePack();
      }
    };

    return pickDo();

  }
  pickOnTimeout() {
    if (this.autopickIndexes[0] === null) {
      this.callbacks.pick.apply(this, [random(this.packs[0].length - 1)]);
    } else {
      this.callbacks.pick.apply(this, [this.autopickIndexes[0]]);
    }
  }
  kick() {
    this.send = () => {};
    while(this.packs.length)
      this.pickOnTimeout();
    this.sendPack = this.pickOnTimeout;
    this.isBot = true;
  }
};
