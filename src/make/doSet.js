const _ = require("../_");
const logger = require("../logger");

const COLORS = {
  W: "white",
  U: "blue",
  B: "black",
  R: "red",
  G: "green"
};

const findPicUrl = ({ name, url, scryfallId, printings = [], rawSets }) => {
  if (url || scryfallId) {
    return url || `https://api.scryfall.com/cards/${scryfallId}?format=image`;
  } else {
    logger.warn(`card ${name} doesn't have a picture :( !!`);
    var picUrl;
    printings.some(printing => {
      if (rawSets[printing]) {
        const maybeCard = rawSets[printing].cards.find(c => c.name === name);
        if (maybeCard && (maybeCard.url || maybeCard.scryfallId)) {
          picUrl = maybeCard.url || `https://api.scryfall.com/cards/${maybeCard.scryfallId}?format=image`;
          return true;
        }
      }
    });
    return picUrl;
  }
};

function doSet(rawSet, rawSets = {}, allCards = {}) {
  const { baseSetSize, code } = rawSet;
  var cards = {};
  var set = {
    name: rawSet.name,
    type: rawSet.type,
    releaseDate: rawSet.releaseDate,
    baseSetSize: baseSetSize,
    basic: [],
    common: [],
    uncommon: [],
    rare: [],
    mythic: [],
    special: [],
  };
  var card;

  for (card of rawSet.cards) {
    doCard({card, cards, code, set, rawSets, baseSetSize});
  }

  //because of split cards, do this only after processing the entire set
  for (var cardName in cards) {
    card = cards[cardName];
    var lc = cardName.toLowerCase();

    if (lc in allCards)
      allCards[lc].sets[code] = card.sets[code];
    else
      allCards[lc] = card;
  }

  for (var rarity of ["mythic", "special"])
    if (!set[rarity].length)
      delete set[rarity];

  set.size = !rawSet.booster ? 4 : rawSet.booster.filter(x => x === "common").length;
  return set;
}

function doCard({card, cards, code, set, rawSets, baseSetSize}) {
  var { name, number, layout, names, convertedManaCost, colors, types, supertypes, manaCost, url, scryfallId, printings } = card;
  var rarity = card.rarity.split(" ")[0].toLowerCase();

  // With MTGJsonv4, a new rarity exists
  if ("timeshifted" == rarity) {
    return;
  }

  if (/^basic/i.test(rarity))
    if (/snow-covered/i.test(name))
      rarity = "special";
    else
      rarity = "basic";

  if (supertypes.includes("Basic")) {
    rarity = "basic";
  }

  // Keep only the non-flipped cards
  // Flipped cards have an mciNumber or a number containing the letter b
  if (/^double-faced$|^flip$/i.test(layout) && /b/i.test(number))
    return;

  var picUrl = findPicUrl({ name, url, scryfallId, printings, rawSets });

  if (/split|aftermath/i.test(layout))
    name = names.join(" // ");

  name = _.ascii(name);

  if (name in cards) {
    if (/^split$|^aftermath$/i.test(layout)) {
      var c = cards[name];
      c.cmc += convertedManaCost;
      if (c.color !== color)
        c.color = "multicolor";
      return;
    }
  }

  var color = !colors || !colors.length
    ? "colorless"
    : !Array.isArray(colors)
      ? colors.toLowerCase()
      : colors.length > 1
        ? "multicolor"
        : Object.keys(COLORS).includes(colors[0])
          ? COLORS[colors[0].toUpperCase()]
          : colors[0]; // shouldn't happen


  const isDoubleFaced = /^double-faced$/i.test(layout);
  var flippedCardURL = "";//Taking care of DoubleFaced Cards URL
  if (isDoubleFaced) {
    cards.some(x => {
      if (x.name == card.names[1]) {
        flippedCardURL = `https://api.scryfall.com/cards/${x.scryfallId}?format=image&face=back`;
        return true;
      }
    });
  }

  cards[name] = {
    scryfallId,
    color,
    name,
    type: types[types.length - 1],
    cmc: convertedManaCost || 0,
    manaCost: manaCost || "",
    sets: {
      [code]: {
        rarity,
        url: picUrl
      }
    },
    layout: layout,
    isDoubleFaced: isDoubleFaced,
    flippedCardURL: flippedCardURL,
    names: names,
    supertypes: supertypes || []
  };

  // Avoid promo cards in sets
  if (!baseSetSize || baseSetSize >= parseInt(number)) {
    set[rarity].push(name.toLowerCase());
  }
}

module.exports = doSet;
