const {EventEmitter} = require("events");

module.exports = class Room extends EventEmitter {
  constructor({isPrivate}) {
    super();
    this.messages = [];
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
    this.socks = this.socks.filter(s => s !== sock);
  }
  say(text, sock) {
    const msg = {
      text,
      time: Date.now(),
      name: sock.name
    };

    this.messages.push(msg);
    this.socks.forEach((sock) => sock.send("hear", msg));
  }
};
