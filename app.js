const CONFIG = require('./config.server')

var http = require('http')
var eio = require('engine.io')
var send = require('send')
var traceur = require('traceur')

traceur.require.makeDefault(function(path) {
  return path.indexOf('node_modules') === -1
})

const fs = require('fs')
const allSets = require("./src/make/allsets")

fs.open("data/AllSets.json", "r", (err, fd) => {
  if (err) {
    console.log("No AllSets.json detected. Downloading the file...")
    allSets.download("http://mtgjson.com/json/AllSets.json", "data/AllSets.json", () => {
      console.log("Download of AllSets.json completed")
    })
  }
})
var router = require('./src/router')

var server = http.createServer(function(req, res) {
  send(req, req.url, { root: 'public' }).pipe(res)
}).listen(CONFIG.PORT)
var eioServer = eio(server).on('connection', router)

require('log-timestamp')
console.log(`Started up ${CONFIG.VERSION}`)
