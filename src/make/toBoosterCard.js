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
    power,
    toughness,
    loyalty,
    text,
    uuid
  } = mtgjsonCard;

  if (supertypes.includes("Basic")) {
    rarity = "basic";
  }

  if (/split|aftermath|adventure/i.test(layout))
    name = names.join(" // ");

  const {isDoubleFaced, flippedCardURL} = getDoubleFacedProps(mtgjsonCard, rawCards);
  const color = getColor(mtgjsonCard);

  acc[uuid] = {
    uuid,
    name,
    names,
    setCode,
    scryfallId,
    cmc: convertedManaCost || 0,
    color: capitalize(color),
    number,
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
