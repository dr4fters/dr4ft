const toBoosterCard = (setCode) => (acc, mtgjsonCard, index, rawCards) => {
  var {
    name,
    frameEffects,
    number,
    layout,
    names,
    convertedManaCost,
    types,
    supertypes = [],
    subtypes = [],
    manaCost,
    url,
    scryfallId,
    rarity,
    isAlternative,
    power,
    toughness,
    loyalty,
    text,
    uuid
  } = mtgjsonCard;

  if (isAlternative) {
    return acc;
  }

  // Keep only the non-flipped cards
  if (isFlippedCard(mtgjsonCard)) {
    return acc;
  }

  if (supertypes.includes("Basic")) {
    rarity = "Basic";
  }

  if (/split|aftermath|adventure/i.test(layout))
    name = names.join(" // ");

  const {isDoubleFaced, flippedCardURL} = getDoubleFacedProps(mtgjsonCard, rawCards);
  const color = getColor(mtgjsonCard);

  acc[name] = {
    uuid,
    name,
    names,
    setCode,
    scryfallId,
    cmc: convertedManaCost || 0,
    color: capitalize(color),
    number: parseInt(number),
    type: types[types.length - 1],
    manaCost: manaCost || "",
    rarity,
    sets: {
      [setCode]: {
        rarity: capitalize(rarity),
        url: url || `https://api.scryfall.com/cards/${scryfallId}?format=image`,
      }
    },
    layout,
    isDoubleFaced,
    flippedCardURL,
    supertypes,
    subtypes,
    power,
    toughness,
    loyalty,
    text,
    frameEffects
  };

  return acc;
};

//TODO: find an helper component to put that or make an enum for rarities, types etc.
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//TODO: unify with update_database
const COLORS = {
  W: "white",
  U: "blue",
  B: "black",
  R: "red",
  G: "green"
};

function getDoubleFacedProps({layout, names}, rawCards) {
  const isDoubleFaced = /^double-faced$|^transform$|^flip$|^meld$/i.test(layout);
  var flippedCardURL = "";
  if (isDoubleFaced) {
    rawCards.some(x => {
      if (x.name == names[1]) {
        flippedCardURL = `https://api.scryfall.com/cards/${x.scryfallId}?format=image`;
        if (/^double-faced$|^transform$/.test(layout)) {
          flippedCardURL += "&face=back";
        }
        return true;
      }
    });
  }
  return {
    isDoubleFaced, flippedCardURL
  };
}

function isFlippedCard({ side, number }) {
  return side && side !== "a" && !/a/.test(number);
}

function getColor({ colorIdentity, frameEffects = [] }) {
  if (frameEffects.includes("devoid")) {
    return "colorless";
  }

  switch (colorIdentity.length) {
  case 0:
    return "colorless";
  case 1:
    return COLORS[colorIdentity[0]];
  default:
    return "multicolor";
  }
}

module.exports = toBoosterCard;
