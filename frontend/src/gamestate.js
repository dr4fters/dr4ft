import {countBy, findIndex, keyBy, pullAt, range, remove} from "lodash";
import _ from "utils/utils";
import EventEmitter from "events";

export const ZONE_MAIN = "main";
export const ZONE_SIDEBOARD = "side";
export const ZONE_PACK = "pack";
export const ZONE_JUNK = "junk";

export const COLORS_TO_LANDS = {
  "W": "Plains",
  "U": "Island",
  "B": "Swamp",
  "R": "Mountain",
  "G": "Forest",
};

/**
 * BASICS is an array of basic lands
 */
export const BASICS = Object.entries(COLORS_TO_LANDS)
  .map(([colorSign, cardName]) => {
    return {
      name: cardName,
      cmc: 0,
      colorSign,
      code: "BFZ",
      color: "Colorless",
      rarity: "Basic",
      type: "Land",
      manaCost: 0,
      url: `https://api.scryfall.com/cards/named?exact=${cardName.toLowerCase()}&format=image`
    };
  });

export const BASIC_LANDS_BY_COLOR_SIGN = keyBy(BASICS, "colorSign");

const defaultState = () => ({
  [ZONE_MAIN]: [],
  [ZONE_SIDEBOARD]: [],
  [ZONE_PACK]: [],
  [ZONE_JUNK]: []
});

/**
 * @desc Map of <cardId, zoneName>
 * @type {{}}
 */
const defaultCardState = () => ({});

// Faire zone -> type de land -> number
const defaultLandDistribution = () => ({
  [ZONE_MAIN]: {},
  [ZONE_SIDEBOARD]: {},
});

class GameState extends EventEmitter {
  #state;
  #zoneState;
  #landDistribution;

  constructor({state = defaultCardState(), landDistribution = defaultLandDistribution()} = {
    state: defaultCardState(),
    landDistribution: defaultLandDistribution()
  }) {
    super();
    this.#state = state;
    this.#landDistribution = landDistribution;
    this.#zoneState = defaultState();
  }

  /**
   * @param zoneName
   * @returns {array} the cards present in the zone
   */
  get(zoneName) {
    return this.#zoneState[zoneName];
  }

  countCardsByName(zoneName, fun = ({name}) => name) {
    return this.countCardsBy(zoneName, fun);
  }

  countCardsBy(zoneName, fun) {
    const zone = this.get(zoneName);
    return countBy(zone, fun);
  }

  pack(cards) {
    this.#zoneState[ZONE_PACK] = cards;
    this.updState();
  }

  add(zoneName, card) {
    const zone = this.get(zoneName);
    zone.push(card);
    if (card.cardId) {
      this.#state[card.cardId] = zoneName;
    }
  }

  move(fromZone, toZone, card) {
    const src = this.get(fromZone);
    const cardIndex = findIndex(src, card);
    pullAt(src, cardIndex);
    this.add(toZone, card);
    this.updState();
  }

  /**
   *
   * @param {string} zoneName
   * @param {array} cards
   */
  addToPool(zoneName, cards) {
    Object.entries(this.#landDistribution).forEach(([zoneName, landsRepartition]) => {
      Object.entries(landsRepartition).forEach(([colorSign, number]) => {
        const basicLand = BASIC_LANDS_BY_COLOR_SIGN[colorSign];
        this._setLands(zoneName, basicLand, number);
      });
    });

    cards
      .forEach((card) => {
        const knownZone = this.#state[card.cardId];
        this.add(knownZone || zoneName, card);
      });
    this.updState();
  }

  _setLands(zoneName, card, n) {
    const zone = this.get(zoneName);
    remove(zone, (c) => c.name === card.name);
    // add n land
    range(n).forEach(() => zone.push(card));
    this.#landDistribution[zoneName][card.colorSign] = n;
  }

  setLands(zoneName, card, n) {
    this._setLands(zoneName, card, n);
    this.updState();
  }

  resetLands() {
    Object.values(COLORS_TO_LANDS).forEach((basicLandName) => {
      [ZONE_MAIN, ZONE_SIDEBOARD, ZONE_JUNK].forEach((zoneName) => {
        remove(this.get(zoneName), ({name}) => basicLandName.toLowerCase() === name.toLowerCase());
      });
    });
    this.#landDistribution = defaultLandDistribution();
    this.updState();
  }

  getMainDeckSize() {
    return this.get(ZONE_MAIN).length;
  }

  getSortedZone(zoneName, sort) {
    const cards = this.get(zoneName);
    const groups = _.group(cards, sort);
    for (const key in groups) {
      _.sort(groups[key], sortLandsBeforeNonLands, "color", "cmc", "name");
    }
    return Key(groups, sort);
  }

  updState() {
    this.emit("updateGameState", {
      state: this.#state,
      landDistribution: this.#landDistribution
    });
  }
}

function sortLandsBeforeNonLands(lhs, rhs) {
  let isLand = x => x.type.toLowerCase().indexOf("land") !== -1;
  let lhsIsLand = isLand(lhs);
  let rhsIsLand = isLand(rhs);
  return rhsIsLand - lhsIsLand;
}

function Key(groups, sort) {
  let keys = Object.keys(groups);
  let arr;

  switch (sort) {
  case "cmc":
    arr = [];
    for (let key in groups)
      if (parseInt(key) >= 6) {
        [].push.apply(arr, groups[key]);
        delete groups[key];
      }

    if (arr.length) {
      groups["6+"] || (groups["6+"] = [])
      ;[].push.apply(groups["6+"], arr);
    }
    return groups;

  case "color":
    keys =
      ["Colorless", "White", "Blue", "Black", "Red", "Green", "Multicolor"]
        .filter(x => keys.indexOf(x) > -1);
    break;
  case "rarity":
    keys =
      ["Mythic", "Rare", "Uncommon", "Common", "Basic", "Special"]
        .filter(x => keys.indexOf(x) > -1);
    break;
  case "type":
    keys = keys.sort();
    break;
  }

  let o = {};
  for (let key of keys)
    o[key] = groups[key];
  return o;
}

export default GameState;
