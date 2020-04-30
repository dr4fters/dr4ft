const express = require("express");
const gamesRouter = express.Router();
const Game = require("../game");
const Rooms = require("../rooms");
const Util = require("../util");
const assert = require("assert");

const checkGameId = (req, res, next) => {
  req.game = Rooms.get(req.params.gameId);
  if (!req.game) {
    res.status(404).json({
      message: `No game found with Id ${req.params.gameId}`
    });
  } else {
    next();
  }
};

const checkGameSecret = (req, res, next) => {
  try {
    assert(req.game.secret === req.query.secret, "The secret provided doesn't fit gameId's secret");
    next();
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const checkGameStartParams = (req, res, next) => {
  try {
    Util.start(req.body);
    next();
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const checkGameCreateParams = (req, res, next) => {
  try {
    Util.game(req.body);
    next();
  } catch (err) {
    res.status(400).json(err.message);
  }
};

gamesRouter

  /*
    Request Params:
      title[string],
      seats[int],
      type[enum:"draft","sealed","glimpse","cube sealed","cube draft","cube glimpse","chaos draft","chaos sealed","chaos glimpse"],
      sets[stringArray(for example "XLN,XLN,XLN"],
      cube[object],
      isPrivate[boolean],
      modernOnly[boolean],
      totalChaos[boolean]
  */
  .post("/", checkGameCreateParams, (req, res) => {
    const game = new Game(req.body);
    res.json({
      "link": `#g/${game.id}`,
      "secret": game.secret
    });
  })

  /* start => {addBots, useTimer, timerLength, shufflePlayers} */
  .post("/:gameId/start", checkGameId, checkGameSecret, checkGameStartParams, (req, res) => {
    req.game.start(req.body);
    res.json({
      "message": `Game ${req.params.gameId} successfully started`,
      "bots": req.game.bots
    });
  })
  /**
   * sends an object according to the endpoint api/games/:gameId/status.
   * It shows if the game started, the current pack and players' infos.
   */
  .get("/:gameId/status", checkGameId, (req, res) => {
    res.send(req.game.getStatus());
  })

  /**
   * can accept a `seat`(from 0 to X) or an `id` (playerId) to get informations,
   * according to the endoint api/games/:gameId/decks.
   * If no `seat` and `id` are requested,
   * then it returns an array of the decks of all players.
   */
  // secret=[string]&seat=[int]&id[string]
  .get("/:gameId/deck", checkGameId, checkGameSecret, (req, res) => {
    res.send(req.game.getDecks(req.query));
  });

module.exports = gamesRouter;
