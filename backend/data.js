const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const readFile = (path) => JSON.parse(fs.readFileSync(path, "UTF-8"));

const DATA_DIR = "data";
const DRAFT_STATS_DIR = "draftStats";
const CARDS_PATH = "cards.json";
const CUBABLE_CARDS_PATH = "cubable_cards_by_name.json";
const SETS_PATH = "sets.json";
const BOOSTER_RULES_PATH = "boosterRules.json";

let cards, cubableCardsByName, sets, playableSets, latestSet, boosterRules;

const getDataDir = () => {
  const repoRoot = process.cwd();
  const dataDir = path.join(repoRoot, DATA_DIR);
  return dataDir;
};

const reloadData = (filename) => {
  switch (filename) {
  case CARDS_PATH: {
    cards = null;
    break;
  }
  case CUBABLE_CARDS_PATH: {
    cubableCardsByName = null;
    break;
  }
  case SETS_PATH: {
    sets = null;
    playableSets = null;
    latestSet = null;
    break;
  }
  case BOOSTER_RULES_PATH: {
    boosterRules = null;
    break;
  }
  }
};

const getSets = () => {
  if (!sets) {
    sets = readFile(`${getDataDir()}/${SETS_PATH}`);
  }
  return sets;
};

const getSet = (setCode) => getSets()[setCode];

const getCards = () => {
  if (!cards) {
    cards = readFile(`${getDataDir()}/${CARDS_PATH}`);
  }
  return cards;
};

const mergeCardsTogether = (oldCards, newCards) => ({
  ...oldCards,
  ...newCards
});

//TODO: someone should handle this? Maybe a service?
const saveSetAndCards = ({set: newSet, cards: newCards}) => {
  saveSetsAndCards({
    ...sets,
    [newSet.code]: newSet
  }, mergeCardsTogether(getCards(), newCards));
};

const saveSetsAndCards = (allSets, allCards) => {
  writeSets(allSets);
  writeCards(allCards);
};

const getCardByUuid = (uuid) => {
  return getCards()[uuid];
};

const parseCubableCardName = (cardName) => {
  // Cube cards can be written as:
  //
  // * "Abrade" (just card name)
  // * "Abrade (CMR)" (card name + set code)
  // * "Abrade (CMR 410)" (card name + set code + number within set)
  const match = cardName.match(/^(.*?)(?: +\((\w+)(?: +(\w+))?\))? *$/);
  if (!match) return null;

  return {name: match[1], set: match[2], number: match[3]};
};

const getCubableCardUuidByName = (cardName) => {
  if (!cubableCardsByName) {
    cubableCardsByName = readFile(`${getDataDir()}/${CUBABLE_CARDS_PATH}`);
  }

  const card = parseCubableCardName(cardName);
  if (!card) return null;

  const options = cubableCardsByName[card.name];
  if (!options) return null;
  if (!card.set) return options.default;

  const byNumber = options[card.set];
  if (!byNumber) return options.default;
  if (card.number && byNumber[card.number]) return byNumber[card.number];

  return byNumber[Object.keys(byNumber).sort()[0]];
};

const getCubableCardByName = (cardName) => {
  return getCardByUuid(getCubableCardUuidByName(cardName));
};

const writeCards = (newCards) => {
  fs.writeFileSync(`${getDataDir()}/${CARDS_PATH}`, JSON.stringify(newCards, undefined, undefined));
};

const writeSets = (newSets) => {
  fs.writeFileSync(`${getDataDir()}/${SETS_PATH}`, JSON.stringify(newSets, undefined, 4));
};

const getPlayableSets = () => {
  if (playableSets) {
    return playableSets;
  }
  playableSets = {};

  const AllSets = getSets();
  for (let code in AllSets) {
    const { name, releaseDate } = AllSets[code];
    const type = "regular";


    if (Date.parse(releaseDate) <= new Date()) {
      if (!latestSet) {
        latestSet = { code, type, name, releaseDate };
      } else if (new Date(releaseDate).getTime() > new Date(latestSet.releaseDate).getTime()) {
        latestSet = { code, type, name, releaseDate };
      }
    }


    if (!playableSets[type]) {
      playableSets[type] = [{ code, name, releaseDate }];
    } else {
      playableSets[type].push({ code, name, releaseDate });
    }
  }

  // sort all keys depending on releaseDate
  for (let type in playableSets) {
    playableSets[type].sort((a, b) => {
      return Number(b.releaseDate.replace(/-/g, "")) - Number(a.releaseDate.replace(/-/g, ""));
    });
  }

  return playableSets;
};

const getLatestReleasedSet = () => {
  if (!latestSet) {
    getPlayableSets();
  }
  return latestSet;
};


function saveDraftStats(id, stats) {
  if (!fs.existsSync(`${getDataDir()}/${DRAFT_STATS_DIR}`)) {
    fs.mkdirSync(`${getDataDir()}/${DRAFT_STATS_DIR}`);
  }

  fs.writeFileSync(`${getDataDir()}/${DRAFT_STATS_DIR}/${id}.json`, JSON.stringify(stats, undefined, 4));
}

const getBoosterRules = (setCode) => {
  if (!boosterRules) {
    boosterRules = readFile(`${getDataDir()}/${BOOSTER_RULES_PATH}`);
  }
  return boosterRules[setCode];
};

const getBoosterRulesVersion = () => {
  if (!boosterRules) {
    try {
      boosterRules = readFile(`${getDataDir()}/${BOOSTER_RULES_PATH}`);
    } catch(error) {
      return "";
    }
  }
  return boosterRules.repoHash;
};

const saveBoosterRules = (boosterRules) => {
  fs.writeFileSync(`${getDataDir()}/${BOOSTER_RULES_PATH}`, JSON.stringify(boosterRules, undefined, 4));
};

module.exports = {
  getDataDir,
  getCards,
  getSets,
  getSet,
  getPlayableSets,
  getLatestReleasedSet,
  saveSetAndCards,
  saveSetsAndCards,
  saveDraftStats,
  mergeCardsTogether,
  getCardByUuid,
  getCardByName: getCubableCardByName,
  reloadData,
  getBoosterRules,
  getBoosterRulesVersion,
  saveBoosterRules
};
