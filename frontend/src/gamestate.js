import {countBy, findIndex, keyBy, pullAt, range, remove} from "lodash";
import _ from "utils/utils";
import EventEmitter from "events";
import {ZONE_JUNK, ZONE_MAIN, ZONE_PACK, ZONE_SIDEBOARD} from "./zones";

export const COLORS_TO_LANDS_NAME = {
  "W": "Plains",
  "U": "Island",
  "B": "Swamp",
  "R": "Mountain",
  "G": "Forest",
};

/**
 * BASICS_LANDS is an array of all different basic lands
 */
const BASICS_LANDS = Object.entries(COLORS_TO_LANDS_NAME)
  .map(([colorSign, cardName]) => {
    return {
      name: cardName,
      cmc: 0,
      colorSign,
      code: "BFZ",
      color: "Colorless",
      rarity: "Basic",
      type: "Land",
      manaCost: "0",
      url: `https://api.scryfall.com/cards/named?exact=${cardName.toLowerCase()}&format=image`
    };
  });

export const BASIC_LANDS_BY_COLOR_SIGN = keyBy(BASICS_LANDS, "colorSign");

const defaultState = () => ({
  [ZONE_MAIN]: [],
  [ZONE_SIDEBOARD]: [],
  [ZONE_PACK]: [],
  [ZONE_JUNK]: []
});

/**
 * @desc Map<cardId, zoneName>
 * @example { "cardId": "main", "othercardId": "side}
 */
const defaultCardState = () => ({});

/**
 * @desc Map<zoneName, Map<color, count>
 * @example { "main": {"W": 2, "R": 3}, "side": {"B": 5, "U": 5} }
 */
const defaultLandDistribution = () => ({
  [ZONE_MAIN]: {},
  [ZONE_SIDEBOARD]: {},
});

/**
 * @desc contains the cards in all zone, the autopick reference and the land distributions
 * it is saved at every App update
 */
class GameState extends EventEmitter {
  #state;
  #zoneState;
  #landDistribution;
  #autopickCardId;

  constructor({
    state = defaultCardState(),
    landDistribution = defaultLandDistribution(),
    autopickCardId = null
  } = {
    state: defaultCardState(),
    landDistribution: defaultLandDistribution(),
    autopickCardId: null
  }) {
    super();
    this.#state = state;
    this.#landDistribution = landDistribution;
    this.#zoneState = defaultState();
    this.#autopickCardId = autopickCardId;
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

  getLandDistribution(zoneName, color) {
    return this.#landDistribution[zoneName][color] || 0;
  }

  _setLands(zoneName, card, n) {
    const zone = this.get(zoneName);
    remove(zone, (c) => c.name === card.name);
    // add n land
    range(n).forEach(() => zone.push(card));
    this.#landDistribution[zoneName][card.colorSign] = n;
  }

  setLands(zoneName, color, n) {
    this._setLands(zoneName, BASIC_LANDS_BY_COLOR_SIGN[color], n);
    this.updState();
  }

  resetLands() {
    Object.values(COLORS_TO_LANDS_NAME).forEach((basicLandName) => {
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
      landDistribution: this.#landDistribution,
      autopickCardId: this.#autopickCardId
    });
  }

  isAutopick(cardId) {
    return this.#autopickCardId === cardId;
  }

  updateAutopick(cardId) {
    this.#autopickCardId = cardId;
    this.updState();
  }

  resetPack() {
    this.get(ZONE_PACK).length = 0;
    this.#autopickCardId = null;
  }
}

const isLand = ({type}) => /land/i.test(type);

const sortLandsBeforeNonLands = (lhs, rhs) => {
  const lhsIsLand = isLand(lhs);
  const rhsIsLand = isLand(rhs);
  return rhsIsLand - lhsIsLand;
};

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
