const {sample, pull} = require("lodash");
const Player = require("./player");
const logger = require("./logger");

module.exports = class extends Player {
  constructor(picksPerPack,gameId) {
    super({
      isBot: true,
      isConnected: true,
      name: "bot",
      id: "",
    });
    this.gameId= gameId;
    this.picksPerPack = picksPerPack;
  }

  getPack(pack) {
    let randomPick;
    let min = Math.min(this.picksPerPack,pack.length);
    for (var i = 0; i < min; i++) {
      randomPick = sample(pack);
      logger.info(`GameID: ${this.gameId}, Bot, picked: ${randomPick.name}`);
      this.picks.push(randomPick.name);
      pull(pack, randomPick);
    }
    this.emit("pass", pack);
  }
};
