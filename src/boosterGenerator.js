const {
  getCardByUuid,
  getSet,
  getCardByName
} = require("./data");
const _ = require("./_");
const logger = require("./logger");
const boosterRules = require("../data/booster_generation.json");

const makeBoosterFromRules = (setCode) => {
  const set = getSet(setCode);
  if (!set) {
    throw new Error(`${setCode} does not exist`);
  }

  const setRules = boosterRules.filter(({ code }) => setCode.toLowerCase() === code);
  if (setRules.length === 0) {
    return getDefaultBooster(set);
  }

  try {
    const { boosters, sheets } = setRules[0];
    const boosterSheets = getBoosterSheets(boosters);
    return Object.entries(boosterSheets)
      .flatMap(chooseCards(sheets))
      .map(toCard);
  } catch (error) {
    logger.error(`could not produce a booster. Falling back to default booster. ${error}`);
    return getDefaultBooster(set);
  }
};

const getDefaultBooster = (set) => {
  let {
    basic,
    common,
    uncommon,
    rare,
    mythic,
    size
  } = set;

  if (mythic && !_.rand(8))
    rare = mythic;

  if (!rare.length) {
    rare = uncommon; //In some sets rare didn't exist. So we replace them with uncommons
  }

  //make small sets draftable.
  if (size < 10)
    size = 10;

  const cardNames = [].concat(
    _.choose(1, basic),
    _.choose(size, common),
    _.choose(3, uncommon),
    _.choose(1, rare)
  );

  return cardNames.map(getCardByUuid);
};

const getBoosterSheets = (boosters) => {
  const totalWeight = boosters.reduce((acc, { weight }) => acc + weight, 0);
  var boosterPick = _.rand(totalWeight) + 1;
  var boosterSheets;
  boosters.some(b => {
    if (boosterPick <= b.weight) {
      boosterSheets = b.sheets;
      return true;
    }
    boosterPick -= b.weight;
  });
  return boosterSheets;
};

const chooseCards = sheets => ([sheetCode, numberOfCardsToPick]) => {
  const sheet = sheets[sheetCode];
  const totalWeight = Object.values(sheet.cards).reduce((acc, val) => acc + val, 0);
  const cards = Array(numberOfCardsToPick).fill().map(() =>
    getRandomCard(Object.entries(sheet.cards), totalWeight)
  );
  return cards;
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

const toCard = (cardCode) => {
  const [setCode, cardNumber] = cardCode.split(":");
  const { cardsByNumber } = getSet(setCode.toUpperCase());
  const [uuid] = cardsByNumber[cardNumber];
  return getCardByUuid(uuid);
};

module.exports = makeBoosterFromRules;
