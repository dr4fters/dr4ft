const fs = require("fs");
const readFile = (path) => JSON.parse(fs.readFileSync(path, "UTF-8"));

var cards, sets, mws;

const getSets = () => {
  if (!sets) {
    sets = readFile("data/sets.json");
  }
  return sets;
};

const getCards = () => {
  if (!cards) {
    cards = readFile("data/cards.json");
  }
  return cards;
};

const getMws = () => {
  if (!mws) {
    mws = readFile("data/mws.json");
  }
  return mws;
};

const writeCards = (newCards) => {
  fs.writeFileSync("data/cards.json", JSON.stringify(newCards));
  cards = newCards;
};

const writeSets = (newSets) => {
  fs.writeFileSync("data/sets.json", JSON.stringify(newSets));
  sets = newSets;
};

module.exports = {
  getCards,
  getSets,
  getMws,
  writeCards,
  writeSets
};
