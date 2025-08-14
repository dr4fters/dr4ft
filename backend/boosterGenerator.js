const {getCardByUuid, getSet} = require("./data");
const {sampleSize, random, concat} = require("lodash");

const makeBoosterFromRules = (setCode) => {
  const set = getSet(setCode);
  return getDefaultBooster(set);
};

const getDefaultBooster = (set) => {
  let { Common, Uncommon, Rare, Legendary, Special } = set;
  const isLegendary = Legendary && !random(6);

  const cardNames = concat(
    sampleSize(Common, 9),
    sampleSize(Uncommon, 3),
    sampleSize(isLegendary? Legendary : Rare, 1),
    sampleSize([...Common,...Uncommon,...Rare,...Legendary,...Special], 1)
  );

  console.log(cardNames);

  return cardNames.map(getCardByUuid);
};

module.exports = makeBoosterFromRules;
