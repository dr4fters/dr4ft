const toBoosterCard = require("./toBoosterCard");
const groupCardNamesByRarity = require("./groupCardNamesByRarity");

// TODO: this set should return a set or cards?
function doSet({code, baseSetSize, name, type, releaseDate, booster, cards: mtgJsonCards}) {
  const cards = mtgJsonCards.reduce(toBoosterCard(code), {});
  const cardNamesByRarity = groupCardNamesByRarity(baseSetSize, Object.values(cards));
  const size = !booster ? 4 : booster.filter(x => x === "common").length;

  return [{
    name,
    type,
    releaseDate,
    baseSetSize,
    size,
    ...cardNamesByRarity
  }, cards];
}

module.exports = doSet;
