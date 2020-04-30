const {sample, pull} = require("lodash");
const Player = require("./player");
const logger = require("./logger");

module.exports = class extends Player {
  constructor(draftFns = {}) {
    super({
      isBot: true,
      isConnected: true,
      name: "bot",
      id: ""
    });
    this.callbacks = { "defaultPickIndexes": draftFns.defaultPickIndexes };
    if (this.callbacks.defaultPickIndexes === undefined)
      this.callbacks.defaultPickIndexes = () => [ null ];
    this.autopickIndexes = this.callbacks.defaultPickIndexes();
  }

  getPack(pack) {
    const randomPick = sample(pack);
    this.picks.push(randomPick.name);
    pull(pack, randomPick);
    if (this.autopickIndexes.length === 1) {
      this.autopickIndexes = this.callbacks.defaultPickIndexes();
      this.emit("pass", pack);
    } else {
      this.autopickIndexes.splice(0, 1);
      this.getPack(pack);
    }
  }
};
