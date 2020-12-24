const Player = require("./player");
const util = require("./util");
const hash = require("./hash");
const {random, pull} = require("lodash");
const logger = require("./logger");

module.exports = class extends Player {
  constructor(sock, pickDelegate, picksPerPack, gameId) {
    super({
      isBot: false,
      isConnected: true,
      name: sock.name,
      id: sock.id,
    });
    this.GameId = gameId;
    this.picksPerPack = picksPerPack;
    this.pickDelegate = pickDelegate.bind(this);
    this.attach(sock);
    this.autopickIndex = [];
  }

  attach(sock) {
    if (this.sock && this.sock !== sock)
      this.sock.ws.close();

    sock.mixin(this);
    sock.removeAllListeners("autopick");
    sock.on("autopick", this._autopick.bind(this));
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
  _autopick(index) {
    let [pack] = this.packs;
    if (pack && index < pack.length){
      if (this.autopickIndex.length == this.picksPerPack){
        this.autopickIndex.shift();
      }
      this.autopickIndex.push(index);
    }
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
  pick() {
    this.pickDelegate(this.autopickIndex);
  }
  pickOnTimeout() {
    let pack = this.packs.slice(0);
    let newIndex;
    let card;
    let min = Math.min(this.packs[0].length,this.picksPerPack);
    if(this.autopickIndex.length < min){
      for (var i = 0; i < this.autopickIndex.length; i++) {
        card = pack[this.autopickIndex[i]];
        pull(pack, card);
      }
      let difference = min - this.autopickIndex.length;
      for (var a = 0; a < difference; a++) {
        newIndex = random(0,pack.length - 1);
        this.autopickIndex.push(newIndex);
        card = pack[newIndex];
        pull(pack, card);
      }
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
