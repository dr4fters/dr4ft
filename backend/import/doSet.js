const toBoosterCard = require("./toBoosterCard");
const { keyCardsUuidByNumber, groupCardsUuidByRarity, keyCardsByUuid} = require("./keyCards");

// TODO: this set should return a set or cards?
function doSet({code, baseSetSize, name, type, releaseDate, boosterV3, cards: mtgJsonCards}) {
  const cards = mtgJsonCards
    .filter((card) => !card.isAlternative)
    .map(toBoosterCard(code));
  const size = !boosterV3 ? 4 : boosterV3.filter(x => x === "common").length;

  return [{
    name,
    type,
    releaseDate,
    baseSetSize,
    size,
    cardsByNumber: keyCardsUuidByNumber(cards),
    ...groupCardsUuidByRarity(baseSetSize, cards)
  }, {
    ...keyCardsByUuid(cards)
  }];
}

module.exports = doSet;
