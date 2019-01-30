const logger = require("../logger");
const doSet = require("./doSet");

function makeCards(rawSets) {
  var allCards = {};
  var allSets = {};

  for (var code in rawSets) {
    logger.info(`Parsing ${code} started`);
    allSets[code] = doSet(rawSets[code], code, rawSets, allCards);
    logger.info(`Parsing ${code} finished`);
  }

  return { allCards, allSets };
}

module.exports = makeCards;