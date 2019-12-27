const fs = require("fs");
const express = require("express");
const setsRouter = express.Router();
const { getSets, getCards, writeSets, writeCards, getPlayableSets, getLatestReleasedSet } = require("../data");
const doSet = require("../make/doSet");
const Sock = require("../sock");
const logger = require("../logger");
const parser = require("../make/xml/parser");

if (!fs.existsSync("data/custom")) {
  fs.mkdirSync("data/custom");
}

const CUSTOM_TYPE = "custom";

setsRouter
  .post("/upload", (req, res) => {
    let file = req.files.filepond;
    const content = file.data.toString();

    if (/\.xml$/.test(file.name)) {
      try {
        Object.values(parser.parse(content)).forEach(json => {
          integrateJson(json, res);
        });
      } catch(err) {
        logger.error(`Could not parse XML file: ${err}`);
        res.status(400).json(`the xml submitted is not valid: ${err.message}`);
        return;
      }
    } else if( /\.json/.test(file.name)) {
      try {
        const json = JSON.parse(content);
        integrateJson(json, res);
      } catch (err) {
        logger.error(`Could not parse JSON file because ${err}`);
        res.status(400).json(`the json submitted is not valid: ${err.message}`);
      }
    }
    res.json({ "message": "file integrated successfully" });
  });

function integrateJson(json) {
  const newCards = getCards();
  const sets = getSets();

  // Avoid overwriting existing sets
  if ((json.code in sets)) {
  // Unless it's a custom set. In this case, we allow overriding
    if (sets[json.code].type != CUSTOM_TYPE) {
      throw new Error(`Set existing already. Not saving agin set with code "${json.code}" to database`);
    } else {
      logger.info(`Custom set ${json.code} already existing. Overriding with new file...`);
    }
  }

  const [parsedSet, parsedCards] = doSet(json, {}, newCards);
  parsedSet.type = CUSTOM_TYPE; //Force set as custom

  logger.info(`adding new set with code "${json.code}" to database`);
  sets[json.code] = parsedSet;
  writeSets(sets);
  Sock.broadcast("set", { availableSets: getPlayableSets(), latestSet: getLatestReleasedSet() });

  writeCards(parsedCards);

  //Moving custom set to custom directory
  fs.writeFile(`data/custom/${json.code}.json`, JSON.stringify(json), (err) => {
    if (err) {
      throw new Error(err);
    }
    logger.info(`Saved custom set as file ${json.code}.json`);
  });
}

module.exports = setsRouter;
