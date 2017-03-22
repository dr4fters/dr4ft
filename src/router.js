const {VERSION} = require('../config.server')
var Game = require('./game')
var Room = require('./room')
var Sock = require('./sock')
var util = require('./util')

var rooms = {
  lobby: new Room({isPrivate: true})
}

function create(opts) {
  try {
    util.game(opts)
  } catch(err) {
    return this.err(err.message)
  }

  opts.id = this.id
  var g = new Game(opts)
  rooms[g.id] = g
  this.send('route', 'g/' + g.id)
  g.once('kill', kill)
}

function join(roomID) {
  var room = rooms[roomID]
  if (!room)
    return this.err(`room ${roomID} not found`)
  this.exit()
  room.join(this)
}

function kill() {
  delete rooms[this.id]
}

module.exports = function (ws) {
  var sock = new Sock(ws)
  sock.on('join', join)
  sock.on('create', create)

  Game.broadcastGameInfo()
  sock.send('set', { serverVersion: VERSION })
}
