let {EventEmitter} = require("events");
let {STRINGS} = require("../config.server");

// All sockets currently connected to the server.
let allSocks = [];

function broadcastNumUsers() {
  Sock.broadcast("set", { numUsers: allSocks.length });
}

function message(msg) {
  var [type, data] = JSON.parse(msg);
  this.emit(type, data, this);
}

var mixins = {
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
    var {id="", name=STRINGS.BRANDING.DEFAULT_USERNAME} = ws.request._query;
    this.id = id.slice(0, 25);
    this.name = name.slice(0, 15);
    //var ip = ws.request.connection.remoteAddress
    var ip = ws.request.headers["x-forwarded-for"];
    this.ip = ip;

    for (var key in mixins)
      this[key] = mixins[key].bind(this);

    allSocks.push(this);
    broadcastNumUsers();
    ws.on("message", message.bind(this));
    ws.on("close", this.exit);

    // `this.exit` may be called for other reasons than the socket closing.
    let sock = this;
    ws.on("close", ()=> {
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
    for (var key in mixins)
      h[key] = this[key];
  }
  static broadcast(...args) {
    for (let sock of allSocks)
      sock.send(...args);
  }
}
module.exports = Sock;
