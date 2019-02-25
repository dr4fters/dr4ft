var assert = require("assert");
var _ = require("./_");
var { getCards, getSets } = require("./data");
var BASICS = [
  "Forest",
  "Island",
  "Mountain",
  "Plains",
  "Swamp"
];

function controlCubeSettingsAndTransformList(cube, seats, type) {
  var { list, cards, packs, cubePoolSize } = cube;

  assert(typeof list === "string", "cube.list must be a string");
  assert(typeof cards === "number", "cube.cards must be a number");
  assert(typeof cubePoolSize === "number", "cube.cubePoolSize must be a number");
  assert(5 <= cards && cards <= 30, "cube.cards range must be between 5 and 30");
  assert(typeof packs === "number", "cube.packs must be a number");
  assert(3 <= packs && packs <= 12, "cube.packs range must be between 3 and 12");

  list = list.split("\n").map(_.ascii);

  var min = type === "cube draft"
    ? seats * cards * packs
    : seats * cubePoolSize;
  assert(min <= list.length && list.length <= 1e5,
    `this cube needs between ${min} and 100,000 cards; it has ${list.length}`);

  var bad = [];
  for (var cardName of list)
    if (!(cardName in getCards()))
      bad.push(cardName);

  if (bad.length) {
    var msg = `invalid cards: ${bad.splice(-10).join("; ")}`;
    if (bad.length)
      msg += `; and ${bad.length} more`;
    throw Error(msg);
  }

  cube.list = list;
}

module.exports = {
  deck(deck, pool) {
    pool = _.count(pool, "name");

    for (var zoneName in deck) {
      var zone = deck[zoneName];
      for (var cardName in zone) {
        if (typeof zone[cardName] !== "number")
          return;
        if (BASICS.indexOf(cardName) > -1)
          continue;
        if (!(cardName in pool))
          return;
        pool[cardName] -= zone[cardName];
        if (pool[cardName] < 0)
          return;
      }
    }

    return true;
  },
  game({ seats, type, sets, cube, isPrivate, fourPack, modernOnly = true, totalChaos = true }) {
    assert(["draft", "sealed", "cube draft", "cube sealed", "chaos draft", "chaos sealed"].includes(type),
      "type can be draft, sealed, chaos draft, chaos sealed, cube draft or cube sealed");
    assert(typeof isPrivate === "boolean", "isPrivate must be a boolean");
    assert(typeof seats === "number", "seats must be a number");
    assert(2 <= seats && seats <= 100, "seats' number must be between 2 and 100");

    switch (type) {
    case "draft":
    case "sealed":
      assert(Array.isArray(sets), "sets must be an array");
      sets.forEach(set =>
        assert(getSets()[set] !== undefined || set === "RNG", `set ${set} is invalid or does not exist`));
      if ("sealed" === type) {
        assert(typeof fourPack === "boolean", "fourPack must be a boolean");
        const minPacks = fourPack ? 4 : 6;
        assert(sets.length >=  minPacks, `sets must be at least ${minPacks}`);
      } else {
        assert(sets.length == 3, "sets length must be 3");
      }
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
