const { getCardByUuid, getSet } = require("./data");
const _ = require("./_");
const logger = require("./logger");
const boosterRules = require("../data/boosterRules.json");

const makeBoosterFromRules = (setCode) => {
  const set = getSet(setCode);
  if (!set) {
    throw new Error(`${setCode} does not exist`);
  }

  const setRules = boosterRules[setCode];
  if (!setRules) {
    return getDefaultBooster(set);
  }

  try {
    const { boosters, totalWeight, sheets } = setRules;
    const boosterSheets = getBoosterSheets(boosters, totalWeight);
    return Object.entries(boosterSheets)
      .flatMap(chooseCards(sheets));
  } catch (error) {
    logger.error(`could not produce a booster of ${setCode}. Falling back to default booster. ${error.stack}`);
    return getDefaultBooster(set);
  }
};

const getDefaultBooster = (set) => {
  let {
    Basic,
    Common,
    Uncommon,
    Rare,
    Mythic,
    size
  } = set;

  if (Mythic && !_.rand(8))
    Rare = Mythic;

  if (!Rare.length) {
    Rare = Uncommon; //In some sets rare didn't exist. So we replace them with uncommons
  }

  //make small sets draftable.
  if (size < 10)
    size = 10;

  const cardNames = [].concat(
    _.choose(size, Common),
    _.choose(3, Uncommon),
    _.choose(1, Rare)
  );

  if (Basic) {
    cardNames.push(_.choose(1, Basic)[0]);
  }

  return cardNames.map(getCardByUuid);
};

const getBoosterSheets = (boosters, totalWeight) => {
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
  const {totalWeight, cardsByColor, cards, balance_colors} = sheets[sheetCode];
  const ret = new Set();

  if (balance_colors) {
    ["G", "U", "W", "B", "R"].forEach((color) => {
      ret.add( _.choose(1, cardsByColor[color])[0] );
    });

    const n = Object.keys(cards).length;
    const nums = {
      "W": cardsByColor["W"].length * numberOfCardsToPick - n,
      "B": cardsByColor["B"].length * numberOfCardsToPick - n,
      "U": cardsByColor["U"].length * numberOfCardsToPick - n,
      "R": cardsByColor["R"].length * numberOfCardsToPick - n,
      "G": cardsByColor["G"].length * numberOfCardsToPick - n,
      "c": cardsByColor["c"].length * numberOfCardsToPick,
    };
    const den = (numberOfCardsToPick - 5 ) * n;

    while (ret.size < numberOfCardsToPick) {
      var rand = _.rand(den) + 1;
      Object.keys(nums).some((color) => {
        if (rand <= nums[color]) {
          ret.add( _.choose(1, cardsByColor[color])[0] );
          return true;
        }
        rand -= nums[color];
      });
    }

  } else {
    while (ret.size < numberOfCardsToPick) {
      ret.add(getRandomCard(Object.entries(cards), totalWeight));
    }
  }

  return [...ret].map((uuid) => ({
    ...getCardByUuid(uuid),
    foil: /foil/.test(sheetCode)
  }));
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
