import {countBy, findIndex, pullAt, range, remove} from "lodash";
import _ from "utils/utils";
import EventEmitter from "events";

export const ZONE_MAIN = "main";
export const ZONE_SIDE = "side";
export const ZONE_PACK = "pack";
export const ZONE_JUNK = "junk";

export const COLORS_TO_LANDS = {
  "W": "Plains",
  "U": "Island",
  "B": "Swamp",
  "R": "Mountain",
  "G": "Forest",
};

const defaultState = {
  [ZONE_MAIN]: [],
  [ZONE_SIDE]: [],
  [ZONE_PACK]: [],
  [ZONE_JUNK]: []
};

class GameState extends EventEmitter {
  #state;

  constructor(state = defaultState) {
    super();
    this.#state = state;
  }

  /**
   * @param zoneName
   * @returns {array}
   */
  get(zoneName) {
    return this.#state[zoneName];
  }

  countCardsByName(zoneName, fun = ({name}) => name) {
    return this.countCardsBy(zoneName, fun);
  }

  countCardsBy(zoneName, fun) {
    const zone = this.get(zoneName);
    return countBy(zone, fun);
  }

  pack(cards) {
    this.#state[ZONE_PACK] = cards;
    this.updState();
  }

  add(zoneName, card) {
    const zone = this.get(zoneName);
    zone.push(card);
    this.updState();
  }

  move(fromZone, toZone, card) {
    const src = this.get(fromZone);
    const dst = this.get(toZone);
    const cardIndex = findIndex(src, card);
    pullAt(src, cardIndex);
    dst.push(card);
    this.updState();
  }

  /**
   *
   * @param {string} zoneName
   * @param {array} cards
   */
  addToPool(zoneName, cards) {
    cards
      .filter((card) => {
        return !this.get(ZONE_MAIN).map(({cardId}) => cardId).includes(card.cardId)
          && !this.get(ZONE_SIDE).map(({cardId}) => cardId).includes(card.cardId) &&
          !this.get(ZONE_JUNK).map(({cardId}) => cardId).includes(card.cardId);
      })
      .forEach((card) => {
        this.add(zoneName, card);
      });
  }

  setLands(zoneName, card, n) {
    const zone = this.get(zoneName);
    remove(zone, (c) => c.name === card.name);
    // add n land
    range(n).forEach(() => {
      this.get(zoneName).add(card);
    });
  }

  resetLands() {
    Object.values(COLORS_TO_LANDS).forEach((basicLandName) => {
      [ZONE_MAIN, ZONE_SIDE, ZONE_JUNK].forEach((zoneName) => {
        remove(this.get(zoneName), ({name}) => basicLandName.toLowerCase() === name.toLowerCase());
      });
    });
    this.updState();
  }

  getMainDeckSize() {
    return this.get(ZONE_MAIN).length;
  }

  addToMain(card) {
    this.get(ZONE_MAIN).push(card);
    this.updState();
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
    this.emit("updateGameState", { gameState: this.#state });
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
