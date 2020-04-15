const { upperFirst } = require("lodash");
const uuid_v1 = require("uuid").v1;

const toBoosterCard = (setCode) => (mtgjsonCard, index, rawCards) => {
  let {
    name,
    frameEffects,
    number,
    layout,
    colors,
    colorIdentity,
    names = [],
    convertedManaCost,
    types,
    supertypes = [],
    subtypes = [],
    manaCost,
    url,
    scryfallId,
    rarity,
    power,
    toughness,
    loyalty,
    text,
    uuid = `dr4ft-${uuid_v1()}`
  } = mtgjsonCard;

  if (supertypes.includes("Basic")) {
    rarity = "basic";
  }

  if (/split|aftermath|adventure/i.test(layout))
    name = names.join(" // ");

  const {isDoubleFaced, flippedCardURL, flippedIsBack, flippedNumber} = getDoubleFacedProps(mtgjsonCard, rawCards);
  const color = upperFirst(getColor(mtgjsonCard));

  return {
    uuid,
    name,
    names,
    color,
    colors,
    colorIdentity,
    setCode,
    scryfallId,
    cmc: convertedManaCost || 0,
    number,
    type: types[types.length - 1],
    manaCost: manaCost || "",
    rarity: upperFirst(rarity),
    url: url || `https://api.scryfall.com/cards/${scryfallId}?format=image`,
    layout,
    isDoubleFaced,
    flippedCardURL,
    flippedIsBack,
    flippedNumber,
    supertypes,
    subtypes,
    power,
    toughness,
    loyalty,
    text,
    frameEffects
  };
};

const COLORS = {
  W: "white",
  U: "blue",
  B: "black",
  R: "red",
  G: "green"
};

function getDoubleFacedProps({layout, names}, rawCards) {
  const isDoubleFaced = /^double-faced$|^transform$|^flip$|^meld$/i.test(layout);
  let flippedCardURL = "";
  let flippedIsBack = false;
  let flippedNumber = "";
  if (isDoubleFaced) {
    rawCards.some(x => {
      if (x.name === names[1]) {
        flippedCardURL = `https://api.scryfall.com/cards/${x.scryfallId}?format=image`;
        if (/^double-faced$|^transform$/.test(layout)) {
          flippedCardURL += "&face=back";
          flippedIsBack = true;
          flippedNumber = x.number;
        }
        return true;
      }
    });
  }
  return {
    isDoubleFaced, flippedCardURL, flippedIsBack, flippedNumber
  };
}

function getColor({ colors, frameEffects = [] }) {
  if (frameEffects.includes("devoid")) {
    return "colorless";
  }

  switch (colors.length) {
  case 0:
    return "colorless";
  case 1:
    return COLORS[colors[0]];
  default:
    return "multicolor";
  }
}

module.exports = toBoosterCard;
