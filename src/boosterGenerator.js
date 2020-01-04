const {getCardByUuid, getSet, getCardByName} = require("./data");
const _ = require("./_");
const boosterRules = require("../data/booster_generation.json");

const makeBoosterFromRules = (setCode) => {
  const set = getSet(setCode);
  if (!set) {
    throw new Error(`${setCode} does not exist`);
  }

  const setRules = boosterRules.filter(({code}) => setCode.toLowerCase() === code);

  if (setRules.length === 0){
    var { common, uncommon, rare, mythic, size } = set;

    if (mythic && !_.rand(8))
      rare = mythic;

    if (!rare.length) {
      rare = uncommon; //In some sets rare didn't exist. So we replace them with uncommons
    }

    //make small sets draftable.
    if (size < 10)
      size = 10;

    const cardNames = [].concat(
      _.choose(size - 4, common),
      _.choose(3, uncommon),
      _.choose(1, rare)
    );

    return cardNames.map(getCardByName);
  }

  const { boosters, sheets } = setRules[0];

  const totalWeight = boosters.reduce((acc, {weight}) => acc + weight, 0);
  var boosterPick = _.rand(totalWeight) + 1;
  var boosterSheets;
  boosters.some(b => {
    if (boosterPick <= b.weight) {
      boosterSheets = b.sheets;
      return true;
    }
    boosterPick -= b.weight;
  });

  const boosterCardCodes = Object.entries(boosterSheets).flatMap(([sheetCode, numberOfCardsToPick]) => {
    const sheet = sheets[sheetCode];
    const totalWeight = Object.values(sheet.cards).reduce((acc, val) => acc + val, 0);
    const cards = Array(numberOfCardsToPick).fill().map(() =>
      getRandomCard(Object.entries(sheet.cards), totalWeight)
    );
    return cards;
  });

  return boosterCardCodes.map((cardCode) => {
    const [setCode, cardNumber] = cardCode.split(":");
    const {cardsByNumber} = getSet(setCode.toUpperCase());
    const [uuid] = cardsByNumber[cardNumber];
    return getCardByUuid(uuid);
  });
};

const getRandomCard = (cardsWithWeight, totalWeight) => {
  var cardPick = _.rand(totalWeight) + 1;
  var card;

  cardsWithWeight.some(([cardCode, weight]) => {
    if (cardPick <= weight) {
      card = cardCode;
      return true;
    }
    cardPick -= weight;
  });

  return card;
};

module.exports = makeBoosterFromRules;
