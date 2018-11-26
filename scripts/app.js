const config = require("../config.server");
const http = require("http");
const eio = require("engine.io");
const send = require("send");
const router = require("../src/router");
const allSets = require("../src/make/allsets");
const parseCards = require("../src/make/cards");
require("log-timestamp");

// Download Allsets.json if there's a new one and make the card DB
allSets.download(parseCards);

const server = http.createServer(function (req, res) {
  send(req, req.url, { root: "built" }).pipe(res);
}).listen(config.PORT);
eio(server).on("connection", router);

console.log(`Started up ${config.VERSION}`);
