var _ = require("./_");
var {EventEmitter} = require("events");

module.exports = class extends EventEmitter {
  constructor() {
    super();
    Object.assign(this, {
      isBot: true,
      isConnected: true,
      name: "bot",
      packs: [],
      pool: [],
      time: 0,
      cap: {
        packs: {}
      },
      picks: []
    });
  }
  get isActive() {
    return false;
  }
  getPack(pack) {
    var score = 99;
    var index = 0;
    var cardcount = 0;
    var scoredcards = 0;
    pack.forEach((card, i) => {
      if (card.score) {
        if (card.score < score) {
          score = card.score;
          index = i;
        }
        scoredcards = scoredcards + 1;
      }
      cardcount = i;
    });
    //if 50% of cards doesn't have a score, we're going to pick randomly
    if (scoredcards / cardcount < .5) {
      index = _.rand(cardcount);
    }

    var card = pack[index];
    this.picks.push(card.name);
    this.pool.push(card);
    pack.splice(index, 1);
    this.emit("pass", pack);
  }
  send(){}
  err(){}
};
