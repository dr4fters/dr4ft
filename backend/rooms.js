const schedule = require("node-schedule");
const rooms = {};

schedule.scheduleJob("0 * * * * *", () => {
  const now = Date.now();
  Object.values(rooms)
    .forEach(({expires, kill}) => {
      if (expires < now) {
        kill("game over");
      }
    });
});

schedule.scheduleJob("* * * * * *", () => {
  Object.values(rooms)
    .forEach(({round, players}) => {
      if (round < 1) {
        return;
      }
      players.forEach((player) => {
        if (player.time && !--player.time)
          player.pickOnTimeout();
      });
    });
});

module.exports = {
  add: (roomId, room) => rooms[roomId] = room,
  get: roomId => rooms[roomId],
  delete: (roomId) => delete rooms[roomId],
  getAll: () => Object.values(rooms)
};
