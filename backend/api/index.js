
const express = require("express");
const games = require("./games");
const sets = require("./sets");
const apiRouter = express.Router();

apiRouter
  .use("/games", games)
  .use("/sets", sets);

module.exports = apiRouter;
