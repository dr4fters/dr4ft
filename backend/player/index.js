const {EventEmitter} = require("events");
const { uniq } = require("lodash");
const { getSet, getCardByUuid } = require("../data");


/**
 * Abstract class for Human and Bot
 */
class Player extends EventEmitter {
  constructor({id, isBot, isConnected, name, sets}) {
    super();

    if (this.constructor === Player) {
      throw new TypeError("Abstract class \"Player\" cannot be instantiated directly.");
    }

    Object.assign(this, {
      name,
      isBot,
      isConnected,
      id,
      isHost: false,
      time: 0,
      packs: [],
      selected: {
        picks: [],
        burns: []
      },
      pool: [],
      cap: {
        packs: {}
      },
      picks: [],
      draftLog: {
        round : {},
        pack: []
      },
      draftStats: [],
      pickNumber: 0,
      packSize: 15,
      self: 0,
      useTimer: false,
      timeLength: "Slow"
    });

    console.log("Load common bases for", uniq(sets) );

    this.pool = uniq(sets).map(setCode => getSet(setCode)).map(set=> set.Base).flat().map(getCardByUuid).filter(card => card.defaultRarity === 1);
  }

  getPlayerDeck() {
    return {
      seatNumber: self,
      playerName: this.name,
      id: this.id,
      pool: this.pool.map(card => card.name)
    };
  }

  get isActive() {
    // Note that a player can be transmuted into a bot when they are kicked.
    return this.isConnected && !this.isBot;
  }

  err() {
    // Implemented on human
  }

  send() {
    // Implemented on human
  }

  exit() {
    // Implemented on human
  }

  kick() {
    // Implemented on human
  }

  getPack() {
    // Implemented on human
  }
}

module.exports = Player;
