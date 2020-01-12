
const express = require("express");
const games = require("./games");
const sets = require("./sets");
const cubes = require("./cubes");
const apiRouter = express.Router();

apiRouter
  .use("/games", games)
  .use("/sets", sets)
  .use("/cubes", cubes);

module.exports = apiRouter;
