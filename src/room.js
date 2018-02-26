let {EventEmitter} = require("events");

module.exports = class extends EventEmitter {
  constructor({isPrivate}) {
    super();

    this.messages = Array(50);
    this.socks = [];
    this.isPrivate = isPrivate;
    this.timeCreated = new Date;

  }
  join(sock) {
    this.socks.push(sock);
    sock.once("exit", this.exit.bind(this));
    sock.on("say", this.say.bind(this));
    sock.on("name", this.name.bind(this));
    sock.send("chat", this.messages);
  }
  name(name, sock) {
    if (typeof name !== "string")
      return;
    sock.name = name.slice(0, 15);
  }
  exit(sock) {
    sock.removeAllListeners("say");
    var index = this.socks.indexOf(sock);
    this.socks.splice(index, 1);
  }
  say(text, sock) {
    var msg = { text,
      time: Date.now(),
      name: sock.name
    };

    this.messages.shift();
    this.messages.push(msg);
    for (sock of this.socks)
      sock.send("hear", msg);
  }
};
