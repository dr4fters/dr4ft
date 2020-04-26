const {sample, pull, pullAll} = require("lodash");
const Player = require("./player");

module.exports = class extends Player {
  constructor(isDecadent) {
    super({
      isBot: true,
      isConnected: true,
      name: "bot",
      id: "",
      isDecadent: isDecadent
    });
  }

  getPack(pack) {
    const randomPick = sample(pack);
    this.picks.push(randomPick.name);
    
    if (!this.isDecadent) {
      pull(pack, randomPick);
    } else {
      pullAll(pack, pack);
    }
    
    this.emit("pass", pack);
  }
};
