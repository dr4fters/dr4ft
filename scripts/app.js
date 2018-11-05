const config = require("../config.server");
const http = require("http");
const eio = require("engine.io");
const send = require("send");
const router = require("../src/router");
const allSets = require("../src/make/allsets");
const executeProcess = require("./executeProcess")

// Download Allsets.json if there's a new one and make the card DB
allSets.download(() => {
  executeProcess("src/make/cards");
  executeProcess("src/make/score");
});

const server = http.createServer(function (req, res) {
  send(req, req.url, { root: "built" }).pipe(res);
}).listen(config.PORT);
eio(server).on("connection", router);

require("log-timestamp");
console.log(`Started up ${config.VERSION}`);
