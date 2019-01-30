const fs = require("fs");
const express = require("express");
const setsRouter = express.Router();
const { getSets, getCards, writeSets, writeCards } = require("../data");
const doSet = require("../make/doSet");
const logger = require("../logger");

if (!fs.existsSync("data/custom")) {
  fs.mkdirSync("data/custom");
}

setsRouter
  .post("/upload", (req, res, next) => {
    let file = req.files.file;
    const content = file.data.toString();

    try {
      const json = JSON.parse(content);
      const newCards = getCards();
      const sets = getSets();

      // Avoid overwriting existing sets
      if ((json.code in sets)) {
        logger.warn(`Set existing already. Not saving agin set with code "${json.code}" to database`);
        res.status(400).json(`Set existing already. Not saving agin set with code "${json.code}" to database`);
        return;
      }

      json.type = "custom"; //Force set as custom
      const parsedSet = doSet(json, {}, newCards);

      logger.info(`adding new set with code "${json.code}" to database`);
      sets[json.code] = parsedSet;
      writeSets(sets);
      writeCards(newCards);

      //Moving custom set to custom directory
      file.mv(`data/custom/${json.code}.json`, function (err) {
        if (err) {
          return res.status(500).send(err);
        }
      });

      res.json({ "message": "set integrated successfully" });
    } catch (err) {
      logger.error(`Could not parse JSON file because ${err}`);
      res.status(400).json(`the json submitted is not valid: ${err}`);
    }
  });

module.exports = setsRouter;