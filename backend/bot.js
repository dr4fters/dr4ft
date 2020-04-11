const {sample, pull} = require("lodash");
const Player = require("./player");
const analyzePack = require("./analytics");

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
    console.log(analyzePack(pack));

    const randomPick = sample(pack);
    this.picks.push(randomPick.name);
    pull(pack, randomPick);
    this.emit("pass", pack);
  }
};
