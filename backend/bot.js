const {sample, sampleSize, pull} = require("lodash");
const Player = require("./player");
const logger = require("./logger");

module.exports = class extends Player {
  constructor(picksPerPack, burnsPerPack, gameId) {
    super({
      isBot: true,
      isConnected: true,
      name: "bot",
      id: "",
    });
    this.gameId= gameId;
    this.picksPerPack = picksPerPack;
    this.burnsPerPack = burnsPerPack;
  }

  getPack(pack) {
    let min = Math.min(this.picksPerPack,pack.length);
    for (var i = 0; i < min; i++) {
      const randomPick = sample(pack);
      logger.info(`GameID: ${this.gameId}, Bot, picked: ${randomPick.name}`);
      this.picks.push(randomPick.name);
      pull(pack, randomPick);
    }

    // burn cards
    const cardsToBurn = Math.min(this.burnsPerPack, pack.length);
    for (const i = 0; i < cardsToBurn; i++) {
      const randomPick = sampleSize(pack);
      logger.info(`GameID: ${this.gameId}, Bot, burnt: ${randomPick.name}`);
      pull(pack, randomPick);
    }

    this.emit("pass", pack);
  }
};
