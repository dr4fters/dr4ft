const fs = require("fs");
const express = require("express");
const setsRouter = express.Router();
const { getSets, saveSetAndCards } = require("../data");
const doSet = require("../import/doSet");
const logger = require("../logger");
const parser = require("../import/xml/parser");

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
        logger.error(`Could not parse XML file: ${err} - ${err.stack}`);
        res.status(400).json(`the xml submitted is not valid: ${err.message}`);
        return;
      }
    } else if( /\.json/.test(file.name)) {
      try {
        const json = JSON.parse(content);
        integrateJson(json, res);
      } catch (err) {
        logger.error(`Could not parse JSON file because ${err} - ${err.stack}`);
        res.status(400).json(`the json submitted is not valid: ${err.message}`);
      }
    }
    res.json({ "message": "file integrated successfully" });
  });

function integrateJson(json) {
  if(!json.code) {
    throw new Error("Custom set should have a code");
  }
  const sets = getSets();

  if ((json.code in sets)) {
  // Unless it's a custom set. In this case, we allow overriding
    if (sets[json.code].type !== CUSTOM_TYPE) {
      throw new Error(`Set existing already. Not saving again set with code "${json.code}" to database`);
    } else {
      logger.info(`Custom set ${json.code} already existing. Overriding with new file...`);
    }
  }

  //TODO: that should be done done by a service -> parse and save (and write file)
  json.type = CUSTOM_TYPE; //Force set as custom
  const [set, cards] = doSet(json);
  saveSetAndCards({ set, cards });
  logger.info(`adding new set with code "${json.code}" to database`);

  //TODO: That should be done by something else. Move out of controller
  //Moving custom set to custom directory
  fs.writeFile(`data/custom/${json.code}.json`, JSON.stringify(json, undefined, 4), (err) => {
    if (err) {
      logger.error(`Could not save file ${json.code}.json. ${err}`);
    } else {
      logger.info(`Saved custom set as file ${json.code}.json`);
    }
  });
}

module.exports = setsRouter;
