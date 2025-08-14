const {pull, find, pullAllWith, remove, times, sample, chain} = require("lodash");

const Player = require("./index");
const util = require("../util");
const hash = require("../hash");
const logger = require("../logger");

module.exports = class Human extends Player {
  constructor(sock, picksPerPack, burnsPerPack, gameId, sets) {
    super({
      isBot: false,
      isConnected: true,
      name: sock.name,
      id: sock.id,
      sets
    });
    this.GameId = gameId;
    this.picksPerPack = picksPerPack;
    this.burnsPerPack = burnsPerPack;
    this.attach(sock);
  }

  attach(sock) {
    if (this.sock && this.sock !== sock)
      this.sock.ws.close();

    sock.mixin(this);
    sock.removeAllListeners("setSelected");
    sock.on("setSelected", this._setSelected.bind(this));
    sock.removeAllListeners("confirmSelection");
    sock.on("confirmSelection", this._confirmSelection.bind(this));
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
  _setSelected({ picks, burns }) {
    this.selected = { picks, burns };
  }
  _confirmSelection() {
    this.confirmSelection();
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
      // if a pack has more than 25 cards in it, add the average decrement on to the first picks
      if (pack.length + this.picks.length > 25) {
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
        .filter(card => this.selected.picks.includes(card.cardId))
        .map(card => card.name)
        .value(),
      notPicked: chain(pack)
        .filter(card => !this.selected.picks.includes(card.cardId))
        .map(card => card.name)
        .value(),
      pool: pool.map(card => card.name)
    });
  }
  confirmSelection() {
    const pack = this.packs.shift();
    this.selected.picks.forEach((cardId) => {
      const card = find(pack, c => c.cardId === cardId);
      if (!card) {
        return;
      }
      pull(pack, card);
      const swuCardId = `${card.defaultExpansionAbbreviation}_${card.defaultCardNumber}`;
      logger.info(`GameID: ${this.GameId}, player ${this.name}, picked: ${card.cardName} ${card.title} (${swuCardId})`);
      this.draftLog.pack.push( [`--> ${card.cardName} ${card.title}(${swuCardId})`].concat(pack.map(x => `    ${x.cardName}(${x.defaultExpansionAbbreviation}_${x.defaultCardNumber})`)) );
      this.pool.push(card);
      this.picks.push(swuCardId);
      this.send("add", card);
    });
    // Remove burned cards from pack
    remove(pack, (card) => this.selected.burns.includes(card.cardId));

    // burn remaining if needed cards
    const remainingToBurn = Math.min(pack.length, this.burnsPerPack - this.selected.burns.length);
    pack.length-=remainingToBurn;

    const [next] = this.packs;
    if (!next)
      this.time = 0;
    else
      this.sendPack(next);

    // reset state
    this.selected = {
      picks: [],
      burns: []
    };

    this.updateDraftStats(this.draftLog.pack, this.pool);

    this.emit("pass", pack);
  }
  handleTimeout() {
    //TODO: filter instead of removing a copy of a pack
    const pack = Array.from(this.packs[0]);

    pullAllWith(pack, this.selected.picks, (card, cardId) => card.cardId === cardId);
    pullAllWith(pack, this.selected.burns, (card, cardId) => card.cardId === cardId);

    // pick cards
    const remainingToPick = Math.min(pack.length, this.picksPerPack - this.selected.picks.length);
    times(remainingToPick, () => {
      const randomCard = sample(pack);
      this.selected.picks.push(randomCard.cardId);
      pull(pack, randomCard);
    });

    this.confirmSelection();
  }
  kick() {
    this.send = () => {};
    while(this.packs.length)
      this.handleTimeout();
    this.sendPack = this.handleTimeout;
    this.isBot = true;
  }
};
