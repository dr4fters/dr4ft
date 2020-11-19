const {sample, pull} = require("lodash");
const Player = require("./player");

module.exports = class extends Player {
  constructor(picksPerPack) {
    super({
      isBot: true,
      isConnected: true,
      name: "bot",
      id: "",
    });
    this.picksPerPack = picksPerPack;
  }

  getPack(pack) {
    let randomPick;
    let min = Math.min(this.picksPerPack,pack.length);
    for (var i = 0; i < min; i++) {
      randomPick = sample(pack);
      this.picks.push(randomPick.name);
      pull(pack, randomPick);
    }
    this.emit("pass", pack);
  }
};
