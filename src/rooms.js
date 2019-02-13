const Room = require("./room");

var rooms = {
  lobby: new Room({isPrivate: true})
};

module.exports = {
  add: (roomId, room) => rooms[roomId] = room,
  get: roomId => rooms[roomId],
  delete: (roomId) => delete rooms[roomId],
};
