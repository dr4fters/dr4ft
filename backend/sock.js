const { EventEmitter } = require("events");
const { app: { DEFAULT_USERNAME } } = require("../config");
const { getPlayableSets, getLatestReleasedSet, getBoosterRulesVersion } = require("./data");
const { getVersion } = require("./mtgjson");

// All sockets currently connected to the server.
let allSocks = [];

function broadcastNumUsers() {
  Sock.broadcast("set", {
    numUsers: allSocks.length
  });
}

function message(msg) {
  const [type, data] = JSON.parse(msg);
  this.emit(type, data, this);
}

const mixins = {
  err(msg) {
    this.send("error", msg);
  },
  send(type, data) {
    this.ws.send(JSON.stringify([type, data]));
  },
  exit() {
    this.emit("exit", this);
  }
};

class Sock extends EventEmitter {
  constructor(ws) {
    super();
    this.ws = ws;
    const {id = "", name = DEFAULT_USERNAME} = ws.request._query;
    this.id = id.slice(0, 25);
    this.name = name.slice(0, 15);

    for (let key in mixins)
      this[key] = mixins[key].bind(this);

    this.send("set", {
      availableSets: getPlayableSets(),
      latestSet: getLatestReleasedSet(),
      mtgJsonVersion: getVersion(),
      boosterRulesVersion: getBoosterRulesVersion()
    });
    allSocks.push(this);
    broadcastNumUsers();
    ws.on("message", message.bind(this));
    ws.on("leave", this.exit);
    ws.on("close", this.exit);

    // `this.exit` may be called for other reasons than the socket closing.
    let sock = this;
    ws.on("close", () => {
      let index = allSocks.indexOf(sock);
      if (index !== -1) {
        allSocks.splice(index, 1);
        broadcastNumUsers();
      }
    });
  }
  mixin(h) {
    h.sock = this;
    this.h = h;
    for (const key in mixins) {
      h[key] = this[key];
    }
  }
  static broadcast(...args) {
    allSocks.forEach((sock) => sock.send(...args));
  }
}
module.exports = Sock;
