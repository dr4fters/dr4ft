const {describe, it} = require("mocha");
const assert = require("assert");
const cardStats = require("./analytics.js");
const boosterGenerator = require("./boosterGenerator");
const {range} = require("lodash");

// List of potentially problematic cards to test over for pack analysis.
const TestCard = {
  uuid: "576e9e04-acd7-5d24-bc19-1dd765e9d1b8",
  name: "Purphoros's Intervention",
  names: [],
  color: "Red",
  colors: [ "R" ],
  colorIdentity: [ "R" ],
  setCode: "THB",
  scryfallId: "ecc911ee-0e12-4b10-add7-9a9d63c29443",
  cmc: 1,
  number: "151",
  type: "Sorcery",
  manaCost: "{X}{R}",
  rarity: "Rare",
  url: "https://api.scryfall.com/cards/ecc911ee-0e12-4b10-add7-9a9d63c29443?format=image",
  layout: "normal",
  isDoubleFaced: false,
  flippedCardURL: "",
  supertypes: [],
  subtypes: [],
  text: "Choose one —\n" +
    "• Create an X/1 red Elemental creature token with trample and haste. Sacrifice it at the beginning of the next end step.\n" +
    "• Purphoros's Intervention deals twice X damage to target creature or planeswalker.",
  foil: true
};

/**
 * @desc withinRange ... Returns a boolean whether or not a number is within range of a set tolerance +/-.
 * @param {float} val 
 * @param {float} tolerance 
 * @returns {boolean} ... Is the value within range.
 */
function withinRange(val, expected, tolerance) {
  return (val <= tolerance + expected && val >= tolerance - expected);
}

/**
 * @desc Compares an arr/obj and returns if they're the same.
 * @param {arr/obj} val0 ... val0 to compare.
 * @param {arr/obj} val1 ... val1 to compare.
 * @returns {boolean} ... Are the values the same?
 */
function compareArray(val0, val1) {
  for (var val in val0) {
    if (val0[val] != val1[val]) {
      return false;
    }
  }

  return true;
}

var monoGreenTest = [];
  
for (var val = 0; val < 15; val++) {
  monoGreenTest.push(TestCard);
}

describe("Acceptance tests for card analytics generation", () => {
  it("Should return the known bias of a single card", () => {
    var stats = cardStats(monoGreenTest);
    var statsLength = 0;

    for (var output in stats) {
      if (stats[output] != undefined) {
        statsLength++;
      }
    }

    assert(statsLength == 5);
    assert(compareArray(stats.colorBias, [0, 0, 0, 1, 0, 0, 0]));
    assert(compareArray(stats.colorPipBias, [0, 0, 0, 1, 0]));
    assert(stats.cmcBias == 1);
  });

  it("Should return statistics near 100% +/- 2", () => {
    range(20).forEach(() => {
      var randomBooster = boosterGenerator("MH1");
      var stats = cardStats(randomBooster);
      
      var colorBias = stats.colorBias;
      var colorPipBias = stats.colorPipBias;

      var colorBiasPercentage = 0;
      var colorPipBiasPercentage = 0;

      for (var colorBiasVal in colorBias) {
        colorBiasPercentage += colorBias[colorBiasVal];
      }

      for (var colorPipVal in colorPipBias) {
        colorPipBiasPercentage += colorPipBias[colorPipVal];
      }

      assert(withinRange(colorBiasPercentage, 1, .02));
      assert(withinRange(colorPipBiasPercentage, 1, .02));
    });
  });
});