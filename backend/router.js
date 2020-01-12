const {VERSION} = require("../config.server");
const Game = require("./game");
const Rooms = require("./rooms");
const Sock = require("./sock");
const util = require("./util");


function create(opts) {
  try {
    util.game(opts);
  } catch(err) {
    return this.err(err.message);
  }

  opts.hostId = this.id;
  var g = new Game(opts);
  this.send("route", "g/" + g.id);
}

function join(roomID) {
  var room = Rooms.get(roomID);
  if (!room)
    return this.err(`No game found with id ${roomID}`);
  this.exit();
  room.join(this);
}

module.exports = function (ws) {
  var sock = new Sock(ws);
  sock.on("join", join);
  sock.on("create", create);

  Game.broadcastGameInfo();
  sock.send("set", { serverVersion: VERSION });
};
