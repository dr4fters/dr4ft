const fs = require("fs");
const express = require("express");
const setsRouter = express.Router();
const { getSets, getCards, writeSets, writeCards } = require("../data");
const doSet = require("../make/doSet");
const logger = require("../logger");

if (!fs.existsSync("data/custom")) {
  fs.mkdirSync("data/custom");
}

const CUSTOM_TYPE = "custom";

setsRouter
  .post("/upload", (req, res, next) => {
    let file = req.files.filepond;
    const content = file.data.toString();

    try {
      const json = JSON.parse(content);
      const newCards = getCards();
      const sets = getSets();

      // Avoid overwriting existing sets
      if ((json.code in sets)) {
        // Unless it's a custom set. In this case, we allow overriding
        if (sets[json.code].type != CUSTOM_TYPE) {
          logger.warn(`Set existing already. Not saving agin set with code "${json.code}" to database`);
          res.status(400).json(`Set existing already. Not saving agin set with code "${json.code}" to database`);
          return;
        } else {
          logger.info(`Custom set ${json.code} already existing. Overriding with new file...`);
        }
      }

      const parsedSet = doSet(json, {}, newCards);
      parsedSet.type = CUSTOM_TYPE; //Force set as custom

      logger.info(`adding new set with code "${json.code}" to database`);
      sets[json.code] = parsedSet;
      writeSets(sets);
      writeCards(newCards);

      //Moving custom set to custom directory
      fs.writeFile(`data/custom/${json.code}.json`, JSON.stringify(json), (err) => {
        if (err) {
          logger.error(`Could not save file ${json.code}.json. ${err}`);
          return res.status(500).send(err);
        }
        logger.info(`Saved custom set as file ${json.code}.json`);
        res.json({ "message": "set integrated successfully" });
      });
    } catch (err) {
      logger.error(`Could not parse JSON file because ${err}`);
      res.status(400).json(`the json submitted is not valid: ${err}`);
    }
  });

module.exports = setsRouter;
