const fs = require("fs");
const logger = require("../backend/logger");
const { saveSetsAndCards, getSet, getCardByUuid } = require("../backend/data");
const doSet = require("../backend/import/doSet");
const boosterRules = require("../../booster_generation.json");

const updateDatabase = () => {
  var allCards = {};
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

  // update boosterGenerator file
  const rules = boosterRules.reduce((acc, { code, boosters, sheets }) => {
    const totalWeight = boosters.reduce((acc, { weight }) => acc + weight, 0);

    acc[code.toUpperCase()] = {
      totalWeight,
      boosters,
      sheets: Object.entries(sheets).reduce((acc, [code, {balance_colors = false, cards}]) => {
        const totalWeight = Object.values(cards).reduce((acc, val) => acc + val, 0);
        acc[code] = {
          balance_colors,
          totalWeight,
          cards: Object.entries(cards).reduce((acc, [cardCode, weigth]) => {
            const uuid = getUuid(cardCode);
            acc[uuid] = weigth;
            return acc;
          },{}),
          cardsByColor: Object.entries(cards).reduce((acc, [cardCode]) => {
            try {
              const {uuid, colorIdentity, type} = getCard(cardCode);
              if (type === "Land" || colorIdentity.length == 0) {
                (acc["c"] = acc["c"] || []).push(uuid);
              } else {
                colorIdentity.forEach((color) => {
                  (acc[color] = acc[color] || []).push(uuid);
                });
              }
            } catch(err) {
              console.log(cardCode + " doesn't match any card");
            }
            return acc;
          },{})
        };
        return acc;
      }, {}),
    };

    return acc;
  }, {});

  fs.writeFileSync("data/boosterRules.json", JSON.stringify(rules, undefined, 4));
};

const getUuid = (cardCode) => {
  const [setCode, cardNumber] = cardCode.split(":");
  const { cardsByNumber } = getSet(setCode.toUpperCase());
  return cardsByNumber[cardNumber] || cardsByNumber[parseInt(cardNumber)] || cardsByNumber[cardNumber.toLowerCase()];
};

const getCard = (cardCode) => {
  const uuid = getUuid(cardCode);
  return getCardByUuid(uuid);
};

module.exports = updateDatabase;

if (!module.parent) {
  updateDatabase();
}
