import {countBy, findIndex, pullAt, range, remove} from "lodash";
import _ from "utils/utils";

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

class GameState {
  inner;
  #onStateUpdated;

  constructor(onStateUpdated, state = defaultState) {
    this.#onStateUpdated = onStateUpdated;
    this.inner = state;
  }

  /**
   * @param zoneName
   * @returns {array}
   */
  get(zoneName) {
    return this.inner[zoneName];
  }

  countCardsByName(zoneName, fun = ({name}) => name) {
    return this.countCardsBy(zoneName, fun);
  }

  countCardsBy(zoneName, fun) {
    const zone = this.get(zoneName);
    return countBy(zone, fun);
  }

  pack(cards) {
    this.inner[ZONE_PACK] = cards;
    this.#onStateUpdated(this.inner);
  }

  add(zoneName, card) {
    const zone = this.get(zoneName);
    zone.push(card);
    this.#onStateUpdated(this.inner);
  }

  move(fromZone, toZone, card) {
    const src = this.get(fromZone);
    const dst = this.get(toZone);
    const cardIndex = findIndex(src, card);
    pullAt(src, cardIndex);
    dst.push(card);
    this.#onStateUpdated(this.inner);
  }

  addToPool(zoneName, cards) {
    cards
      .filter((card) => {
        return this.get(ZONE_MAIN).includes(card) ||
          this.get(ZONE_SIDE).includes(card) ||
          this.get(ZONE_JUNK).includes(card);
      })
      .forEach((card) => {
        this.add(zoneName, card);
      });
    this.#onStateUpdated(this.inner);
  }

  setLands(zoneName, card, n) {
    const zone = this.get(zoneName);
    remove(zone, (c) => c.name === card.name);
    // add n land
    range(n).forEach(() => {
      zone.push(card);
    });
    this.#onStateUpdated(this.inner);
  }

  resetLands() {
    Object.values(COLORS_TO_LANDS).forEach((basicLandName) => {
      [ZONE_MAIN, ZONE_SIDE, ZONE_JUNK].forEach((zoneName) => {
        remove(this.get(zoneName), ({name}) => basicLandName.toLowerCase() === name.toLowerCase());
      });
    });
    this.#onStateUpdated(this.inner);
  }

  getMainDeckSize() {
    return this.get(ZONE_MAIN).length;
  }

  addToMain(card) {
    this.get(ZONE_MAIN).push(card);
    this.#onStateUpdated(this.inner);
  }

  getSortedZone(zoneName, sort) {
    const cards = this.get(zoneName);
    const groups = _.group(cards, sort);
    for (const key in groups) {
      _.sort(groups[key], sortLandsBeforeNonLands, "color", "cmc", "name");
    }
    return Key(groups, sort);
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
