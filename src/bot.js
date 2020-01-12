const {sample, pull} = require("lodash");
const Player = require("./player");

module.exports = class extends Player {
  constructor() {
    super({
      isBot: true,
      isConnected: true,
      name: "bot",
      id: ""
    });
  }

  getPack(pack) {
    let score = 99;
    let index = 0;
    let cardcount = 0;
    let scoredcards = 0;
    pack.forEach((card, i) => {
      if (card.score) {
        if (card.score < score) {
          score = card.score;
          index = i;
        }
        scoredcards += 1;
      }
      cardcount = i;
    });
    //if 50% of cards doesn't have a score, we're going to pick randomly
    if (scoredcards / cardcount < .5) {
      const randomPick = sample(pack);
      this.picks.push(randomPick.name);
      pull(pack, randomPick);
    } else {
      this.picks.push(pack[index].name);
      pack.splice(index, 1);
    }
    this.emit("pass", pack);
  }
};
