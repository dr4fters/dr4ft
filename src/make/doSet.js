const logger = require("../logger");

//TODO: unify with update_database
const COLORS = {
  W: "white",
  U: "blue",
  B: "black",
  R: "red",
  G: "green"
};

// TODO: this set should return a set or cards?
function doSet(rawSet, allCards = {}) {
  const { baseSetSize, code } = rawSet;
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

  var cards = {};
  for (const card of rawSet.cards) {
    const [parsedCard, error] = doCard({card, cards, rawSetCards: rawSet.cards, code});

    if (error) {
      logger.debug(error);
      continue;
    }
    cards[parsedCard.name.toLowerCase()] = parsedCard;
    // Avoid promo cards in sets
    // Maybe use groupBy rarity?
    if (!baseSetSize || baseSetSize >= parsedCard.number) {
      set[parsedCard.rarity].push(parsedCard.name.toLowerCase());
    }
  }

  //because of split cards, do this only after processing the entire set
  // Pull this out -> have some component that merges the cards together
  for (var cardName in cards) {
    const card = cards[cardName];
    var lc = cardName.toLowerCase();

    if (lc in allCards)
      allCards[lc].sets[code] = card.sets[code];
    else
      allCards[lc] = card;
  }

  //TODO: understand why we delete these?
  for (var rarity of ["mythic", "special"])
    if (!set[rarity].length)
      delete set[rarity];

  set.size = !rawSet.booster ? 4 : rawSet.booster.filter(x => x === "common").length;
  return [set, allCards];
}

function doCard({card, cards /* this should go out*/, rawSetCards /* this should go out*/, code /* this should go out*/ }) {
  var { name, number, layout, names, convertedManaCost, colors, types, supertypes,
    manaCost, url, scryfallId, side, isAlternative, power, toughness, loyalty, text } = card;
  var rarity = card.rarity.split(" ")[0].toLowerCase();

  if (isAlternative) {
    return [null, `${name} is an alternative. skip`];
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
  if (side && side !== "a" && !/a/.test(number)) {
    return [null, `${name} has side ${side}. avoiding`];
  }

  // TODO: move all this part of split card out.
  if (/split|aftermath|adventure/i.test(layout))
    name = names.join(" // ");

  // if we already added this card
  // and it's a split card, we just add the manacost
  if (name in cards) {
    if (/^split$/i.test(layout)) {
      var c = cards[name];
      c.cmc += convertedManaCost;
      if (c.color !== color)
        c.color = "multicolor";
      return [null, "split card"];
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


  const isDoubleFaced = /^double-faced$|^transform$|^flip$|^meld$/i.test(layout);
  var flippedCardURL = ""; //Taking care of DoubleFaced Cards URL
  if (isDoubleFaced) {
    logger.info(`${name} has side ${side} and other card ${names[1]}`);
    rawSetCards.some(x => {
      if (x.name == card.names[1]) {
        flippedCardURL = `https://api.scryfall.com/cards/${x.scryfallId}?format=image`;
        if(/^double-faced$|^transform$/.test(layout)){
          flippedCardURL += "&face=back";
        }
        return true;
      }
    });
  }

  return [{
    scryfallId,
    color: capitalize(color),
    name,
    number: parseInt(number),
    type: types[types.length - 1],
    cmc: convertedManaCost || 0,
    manaCost: manaCost || "",
    rarity,
    //TODO: should that be the responsability of something else?
    sets: {
      [code]: {
        rarity: capitalize(rarity),
        url: url || `https://api.scryfall.com/cards/${scryfallId}?format=image`
      }
    },
    layout: layout,
    isDoubleFaced: isDoubleFaced,
    flippedCardURL: flippedCardURL,
    names: names,
    supertypes: supertypes || [],
    power,
    toughness,
    loyalty,
    text
  }];
}

//TODO: find an helper component to put that or make an enum for rarities, types etc.
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = doSet;
