const toBoosterCard = require("./toBoosterCard");
const { keyCardsUuidByNumber, groupCardsUuidByRarity, keyCardsByUuid} = require("./keyCards");

function doSet({code, baseSetSize, name, type, releaseDate, boosterV3, cards: mtgJsonCards}) {
  const cards = mtgJsonCards
    .filter((card) => !card.isAlternative)
    .map(toBoosterCard(code));
  const size = !boosterV3 ? 4 : boosterV3.filter(x => x === "common").length;

  return [{
    code,
    name,
    type,
    releaseDate,
    baseSetSize,
    size,
    cardsByNumber: keyCardsUuidByNumber(cards),
    ...groupCardsUuidByRarity(cards)
  }, {
    ...keyCardsByUuid(cards)
  }];
}

module.exports = doSet;
