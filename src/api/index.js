
const express = require("express");
const games = require("./games");
const apiRouter = express.Router();

apiRouter
  .use("/games", games);

module.exports = apiRouter;
