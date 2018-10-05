const config = require("../config.server");
const http = require("http");
const eio = require("engine.io");
const send = require("send");
const router = require("../src/router");

const server = http.createServer(function (req, res) {
  send(req, req.url, { root: "built" }).pipe(res);
}).listen(config.PORT);
eio(server).on("connection", router);

require("log-timestamp");
console.log(`Started up ${config.VERSION}`);
