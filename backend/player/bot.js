const {sample, pull, times} = require("lodash");

const Player = require("./index");
const logger = require("../logger");

module.exports = class Bot extends Player {
  constructor(picksPerPack, burnsPerPack, gameId, sets) {
    super({
      isBot: true,
      isConnected: true,
      name: "bot",
      id: "",
      sets
    });
    this.gameId= gameId;
    this.picksPerPack = picksPerPack;
    this.burnsPerPack = burnsPerPack;
  }

  getPack(pack) {
    const cardsToPick = Math.min(this.picksPerPack, pack.length);
    times(cardsToPick, () => {
      const randomPick = sample(pack);
      logger.info(`GameID: ${this.gameId}, Bot, picked: ${randomPick.cardName}`);
      this.picks.push(randomPick.cardName);
      pull(pack, randomPick);
    });

    // burn cards
    const cardsToBurn = Math.min(this.burnsPerPack, pack.length);
    times(cardsToBurn, () => {
      const randomPick = sample(pack);
      logger.info(`GameID: ${this.gameId}, Bot, burnt: ${randomPick.cardName}`);
      pull(pack, randomPick);
    });

    this.emit("pass", pack);
  }
};
