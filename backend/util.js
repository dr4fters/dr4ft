const assert = require("assert");
const {countBy} = require("lodash");
const { getSet, getCardByName } = require("./data");
const BASICS = [
  "Forest",
  "Island",
  "Mountain",
  "Plains",
  "Swamp"
];

function controlCubeSettingsAndTransformList(cube, seats, type) {
  let {list, cards, packs, cubePoolSize} = cube;

  assert(typeof list === "string", "cube.list must be a string");
  assert(typeof cards === "number", "cube.cards must be a number");
  assert(typeof cubePoolSize === "number", "cube.cubePoolSize must be a number");
  assert(5 <= cards && cards <= 30, "cube.cards range must be between 5 and 30");
  assert(typeof packs === "number", "cube.packs must be a number");
  assert(1 <= packs && packs <= 12, "cube.packs range must be between 1 and 12");

  list = list.split("\n");

  const min = type === "cube draft"
    ? seats * cards * packs
    : seats * cubePoolSize;
  assert(min <= list.length && list.length <= 1e5,
    `The cube needs between ${min} and 100 000 cards with this settings, it has ${list.length}`);

  const bad = [];
  for (let cardName of list)
    if (!getCardByName(cardName))
      bad.push(cardName);

  if (bad.length) {
    let msg = `Invalid cards: ${bad.splice(-10).join("; ")}`;
    if (bad.length)
      msg += `; and ${bad.length} more`;
    throw Error(msg);
  }

  cube.list = list;
}

module.exports = {
  // Control if deck is legit
  // => all the deck's cards appear in players pool
  deck(deck, pool) {
    const poolByName = countBy(pool, ({name}) => name);

    for (const zoneName in deck) {
      const zone = deck[zoneName];
      for (let cardName in zone) {
        if (typeof zone[cardName] !== "number")
          return false;
        if (BASICS.indexOf(cardName) > -1)
          continue;
        if (!(cardName in poolByName))
          return false;
        poolByName[cardName] -= zone[cardName];
        if (poolByName[cardName] < 0)
          return false;
      }
    }

    return true;
  },
  game({ seats, type, sets, cube, isPrivate, modernOnly = true, chaosPacksNumber, totalChaos = true }) {
    const acceptableGameTypes = [
      "draft",
      "sealed",
      "cube draft",
      "cube sealed",
      "chaos draft",
      "chaos sealed",
      "decadent draft"
    ];
    assert(acceptableGameTypes.includes(type),
      `type can be one of: ${acceptableGameTypes.join(", ")}`);
    assert(typeof isPrivate === "boolean", "isPrivate must be a boolean");
    assert(typeof seats === "number", "seats must be a number");
    assert(seats >= 1 && seats <= 100, "seats' number must be between 1 and 100");

    switch (type) {
    case "draft":
    case "sealed":
      assert(Array.isArray(sets), "sets must be an array");
      assert(sets.length >= 1, "sets length must be at least 1");
      sets.forEach(set =>
        assert(set === "RNG" || getSet(set) !== undefined, `Set ${set} is invalid or does not exist`));
      break;
    case "cube draft":
    case "cube sealed":
      assert(typeof cube === "object", "cube must be an object");
      controlCubeSettingsAndTransformList(cube, seats, type);
      break;
    case "chaos draft":
    case "chaos sealed":
      assert(typeof modernOnly === "boolean", "modernOnly must be a boolean");
      assert(typeof totalChaos === "boolean", "totalChaos must be a boolean");
      assert(typeof chaosPacksNumber === "number", "chaosPacksNumber must be a number");
      break;
    }
  },

  start({ addBots, useTimer, timerLength, shufflePlayers }) {
    assert(typeof addBots === "boolean", "addBots must be a boolean");
    assert(typeof useTimer === "boolean", "useTimer must be a boolean");
    assert(typeof shufflePlayers === "boolean", "shufflePlayers must be a boolean");
    assert(useTimer && ["Fast", "Moderate", "Slow", "Leisurely"].includes(timerLength),
      "timerLength must be Fast, Moderate, Slow or Leisurely");
  }
};
