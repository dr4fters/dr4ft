const toBoosterCard = require("./toBoosterCard");
const { groupCardUuidByNumber, groupCardNamesByRarity} = require("./groupCardNamesByRarity");

// TODO: this set should return a set or cards?
function doSet({code, baseSetSize, name, type, releaseDate, boosterV3, cards: mtgJsonCards}) {
  const cards = mtgJsonCards.reduce(toBoosterCard(code), {});
  //TODO: check if a different grouping function is available
  const cardNamesByRarity = groupCardNamesByRarity(baseSetSize, Object.values(cards));
  const size = !boosterV3 ? 4 : boosterV3.filter(x => x === "common").length;

  return [{
    name,
    type,
    releaseDate,
    baseSetSize,
    size,
    cardsByNumber: {
      ...groupCardUuidByNumber(baseSetSize, Object.values(cards))
    },
    ...cardNamesByRarity
  }, cards];
}

module.exports = doSet;
