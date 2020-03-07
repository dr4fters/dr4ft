const fs = require("fs");
const logger = require("../backend/logger");
const { saveSetsAndCards } = require("../backend/data");
const doSet = require("../backend/import/doSet");

const updateDatabase = () => {
  let allCards = {};
  const allSets = {};

  // Add normal sets
  const setsToIgnore = ["ITP", "CP1", "CP2", "CP3"];
  const types = ["core", "expansion", "commander", "planechase", "starter", "funny", "masters", "draft_innovation", "masterpiece"];
  if (fs.existsSync("data/sets")) {
    const files = fs.readdirSync("data/sets");
    files.forEach(file => {
      if (!/.json/g.test(file)) {
        return;
      }
      const [setName,] = file.split(".");
      if (setsToIgnore.includes(setName)) {
        return;
      }
      const path = `data/sets/${file}`;
      try {
        const json = JSON.parse(fs.readFileSync(path, "UTF-8"));
        if (json.code && types.includes(json.type)) {
          logger.info(`Found set to integrate ${json.code} with path ${path}`);
          const [set, cards] = doSet(json);
          allSets[json.code] = set;
          allCards = { ...allCards, ...cards };
          logger.info(`Parsing ${json.code} finished`);
        }
      } catch (err) {
        logger.error(`Error while integrating the file ${path}: ${err.stack}`);
      }
    });
  }
  // Add custom sets
  if (fs.existsSync("data/custom")) {
    const files = fs.readdirSync("data/custom");
    files.forEach(file => {
      // Integrate only json file
      if (/.json/g.test(file)) {
        const path = `data/custom/${file}`;
        try {
          const json = JSON.parse(fs.readFileSync(path, "UTF-8"));
          if (json.code) {
            json.type = "custom";
            logger.info(`Found custom set to integrate ${json.code} with path ${path}`);
            const [set, cards] = doSet(json);
            allSets[json.code] = set;
            allCards = { ...allCards, ...cards };
            logger.info(`Parsing ${json.code} finished`);
          }
        } catch (err) {
          logger.error(`Error while integrating the file ${path}: ${err.stack}`);
        }
      }
    });
  }

  logger.info("Parsing AllSets.json finished");
  saveSetsAndCards(allSets, allCards);
  logger.info("Writing sets.json and cards.json finished");
};

module.exports = updateDatabase;

if (!module.parent) {
  updateDatabase();
}
