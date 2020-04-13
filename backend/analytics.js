const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rankingsPath = path.join(__dirname, "../data/picks/results.txt");

const CardColors = {
  "W": 0,
  "U": 1,
  "B": 2,
  "R": 3,
  "G": 4,
  "C": 5
};

const CardColorNames = {
  "White": 0,
  "Blue": 1,
  "Black": 2,
  "Red": 3, 
  "Green": 4,
  "Colorless": 5,
  "Multicolor": 6
};

/**
 * @desc ... Searches our rankings file for a card and returns what rank it is.
 * @param {Object} card ... The card object.
 * @returns {Int} ... Returns the card rank, -1 if not found.
 */
async function pullCardRank(card) {
  const fileStream = fs.createReadStream(rankingsPath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  var rank = 0;

  console.log(card.name);

  for await (var line of rl) {
    var card_line;
    card_line = line.split(" ");
    card_line.shift();
    card_line = card_line.join(" ");
    
    if (card.name == card_line) {
      return rank;
    }

    rank++
  }

  return -1;
}


async function getCardRank(card) {
  promise = pullCardRank(card);
  result = await promise;

  return result;
}

/** 
 * @desc eatColorPips ... Separates out the colored pips {4}{W} --> W for bias analysis.
 * @param {String} manaCost ... String of the manacost with generic and colored costs.
 * @returns {Array} ... Returns an array of the color pip bias.
 */
function eatColorPips(manaCost) {
  var colorBias = [0, 0, 0, 0, 0, 0]; // The last value refers to the total number of color pips.

  // Symbols to be removed from card mana costs.
  const toBeRemoved = ["{", "}", "X", "/"];

  for (var item in toBeRemoved) {
    manaCost = manaCost.split(toBeRemoved[item]).join("");
  }

  for (var number = 0; number <= 9; number++) {
    manaCost = manaCost.split(number).join("");
  }

  for (var char = 0; char < manaCost.length; char++) {
    colorBias[CardColors[manaCost.charAt(char)]]++;
    colorBias[colorBias.length - 1]++; // Increment the total number of color pips.
  }

  return colorBias;
}

/**
 * @desc generatePackStats(pack) ... Examines and create an object for the statistics of a pack.
 * @param {object} pack ... An object containing the name, UUID, CMC, and other relevant information about the pack.
 * @returns {object} ... Returns an object containing information about the pack.
 */
function generatePackStats(packs) {
  // colorBias, an array from [0, 1] reference enum CardColors, each pack is weighted by color.
  var colorBias = [0, 0, 0, 0, 0, 0, 0];
  var colorPipBias = [0, 0, 0, 0, 0];
  var typeBias = {};
  var rarityBias = {};

  var cmcBias = 0;
  var totalCount = packs.length;
  var nonLandCount = 0;
  var colorPips = 0;
  var bestPick;

  for (var pack in packs) {
    // packObj used to make my life easier regarding referencing.
    var packObj = packs[pack];

    var manaCost = packObj.manaCost;
    var type = packObj.type;
    var rarity = packObj.rarity;
    var color = packObj.color;
    var CMC = packObj.cmc;
    var rank = getCardRank(packObj);

    console.log(rank);
    

    if (type != "Land") {
      nonLandCount++;

      colorBias[CardColorNames[color]]++;

      if (CMC > 0) {
        cmcBias += CMC;
      }

      if (color != "Colorless") {
        var newColorBias = eatColorPips(manaCost);

        for (var val = 0; val < colorPipBias.length; val++) {
          colorPipBias[val] += newColorBias[val];
        }

        colorPips += newColorBias[newColorBias.length - 1];
      }  
    }

    typeBias[type] = (typeBias[type] || 0) + 1; // Increase the number for whatever type it is or initialize the value.
    rarityBias[rarity] = (rarityBias[rarity] || 0) + 1; 
  }

  // Adjust the weights of everything.
  for (var pipVal = 0; pipVal < colorPipBias.length; pipVal++) {
    colorPipBias[pipVal] /= colorPips;
  }

  for (var biasVal = 0; biasVal < colorBias.length; biasVal++) {
    colorBias[biasVal] /= nonLandCount;
  }

  cmcBias /= nonLandCount;

  for (var types in typeBias) {
    typeBias[types] /= totalCount;
  }

  for (var rarities in rarityBias) {
    rarityBias[rarities] /= totalCount;
  }

  var packStats = {"colorBias": colorBias, "colorPipBias": colorPipBias, "typeBias": typeBias, "rarityBias": rarityBias, "cmcBias": cmcBias}
  return packStats;  
}

module.exports = generatePackStats;