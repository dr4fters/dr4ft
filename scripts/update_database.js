const fs = require("fs");
const path = require("path");
const logger = require("../backend/logger");
const { saveSetsAndCards, getDataDir } = require("../backend/data");
const doSet = require("../backend/import/doSet");

const updateDatabase = () => {
  let allCards = {};
  const allSets = {};

  // Add normal sets
  const setsToIgnore = ["ITP", "CP1", "CP2", "CP3"];

  const setsDataDir = path.join(getDataDir(), "sets");
  if (fs.existsSync(setsDataDir)) {
    const files = fs.readdirSync(setsDataDir);
    files.forEach(file => {
      if (!/.json/g.test(file)) {
        return;
      }
      const [setName,] = file.split(".");
      if (setsToIgnore.includes(setName)) {
        return;
      }
      const filePath = path.join(setsDataDir, `${file}`);
      try {
        const json = JSON.parse(fs.readFileSync(filePath, "UTF-8")).data;
        if (json.code) {
          logger.info(`Found set to integrate ${json.code} with path ${filePath}`);
          const [set, cards] = doSet(json);
          allSets[json.code] = set;
          allCards = { ...allCards, ...cards };
          logger.info(`Parsing ${json.code} finished`);
        } else {
          logger.warn(`Set ${json.name} with path ${filePath} will NOT BE INTEGRATED`);
        }
      } catch (err) {
        logger.error(`Error while integrating the file ${filePath}: ${err.stack}`);
      }
    });
  }
  // Add custom sets
  const customDataDir = path.join(getDataDir(), "custom");
  if (fs.existsSync(customDataDir)) {
    const files = fs.readdirSync(customDataDir);
    files.forEach(file => {
      // Integrate only json file
      if (/.json/g.test(file)) {
        const filePath = path.join(customDataDir, `${file}`);
        try {
          const json = JSON.parse(fs.readFileSync(filePath, "UTF-8"));
          if (json.code) {
            json.type = "custom";
            logger.info(`Found custom set to integrate ${json.code} with path ${filePath}`);
            const [set, cards] = doSet(json);
            allSets[json.code] = set;
            allCards = { ...allCards, ...cards };
            logger.info(`Parsing ${json.code} finished`);
          }
        } catch (err) {
          logger.error(`Error while integrating the file ${filePath}: ${err.stack}`);
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
