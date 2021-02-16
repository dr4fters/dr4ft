const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const readFile = (path) => JSON.parse(fs.readFileSync(path, "UTF-8"));
const { keyCardsUuidByNumber, groupCardsBySet, groupCardsByName } = require("./import/keyCards");

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
  writeCubeCards(allSets, allCards);
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

const sortByPriority = allSets => (card1, card2) => {
  const set1 = allSets[card1.setCode];
  const set2 = allSets[card2.setCode];

  if (isReleasedExpansionOrCoreSet(set1.type, set1.releaseDate)) {
    if(isReleasedExpansionOrCoreSet(set2.type, set2.releaseDate)) {
      return new Date(set2.releaseDate).getMilliseconds() - new Date(set1.releaseDate).getMilliseconds();
    } else {
      return -1;
    }
  } else if(isReleasedExpansionOrCoreSet(set2.type, set2.releaseDate)) {
    return 1;
  }

  return 0;
};

const writeCubeCards = (allSets, allCards) => {
  const groupedCards = groupCardsByName(Object.values(allCards));
  const groupedCardsArray = Object.values(groupedCards);
  const mySort = sortByPriority(allSets);
  groupedCardsArray.forEach((cards) => {
    cards.sort(mySort);
  });

  // Group cubable cards so they're easy to look up. A single card ends up
  // looking like:
  //
  // "abrade": {
  //     "default": "4b921a1e-853d-50f7-9d76-d7f107c6c7e3",
  //     "cmr": {
  //         "410": "7aad9d6f-4cef-5e79-a2c2-2491ae3a5498",
  //         "659": "5f43d620-b3a9-5f52-a6ce-325d63199131"
  //     },
  //     ...
  // }
  //
  // Split cards are listed multiple times, once for their combined name and
  // once each for each half of the split name.
  const cubableCards = groupedCardsArray
    .map((cards) => {
      return [cards[0].name.toLowerCase(), {
        default: cards[0].uuid,
        ..._.mapValues(groupCardsBySet(cards), keyCardsUuidByNumber)
      }];
    })
    /* Create entries for each side of split or double cards.
       E.g Fire // Ice will create 3 entries :
        - Fire // Ice
        - Fire
        - Ice
    */
    .flatMap(([cardName, cardValues]) => {
      const names = cardName.split(" // ");
      if (names.length <= 1) return [[cardName, cardValues]];

      return [
        [cardName, cardValues],
        ...names.map((name) => [name, cardValues])
      ];
    })
    /* It may happen that double cards have side's name clashing with other double cards names.
      E.g. "fire" name may clash with Fire // Ice and Start // Fire.
      To understand which is the true "default", we sort the cards by priority and choose the first one.
    */
    .reduce((cubableCards, [cardName, cardValues]) => {
      if (!cubableCards[cardName]) {
        cubableCards[cardName] = cardValues;
      } else {
        const card1 = getCardByUuid(cardValues.default);
        const card2 = getCardByUuid(cubableCards[cardName].default);
        const array = [card1, card2];
        array.sort(mySort);
        cubableCards[cardName] = {
          ...cubableCards[cardName],
          ...cardValues,
          default: array[0].uuid
        };
      }
      return cubableCards;
    }, {});
  fs.writeFileSync(`${getDataDir()}/${CUBABLE_CARDS_PATH}`, JSON.stringify(cubableCards, undefined, 4));
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
    const { type, name, releaseDate } = AllSets[code];

    //We do not want to play with these types of set
    if (!["core", "draft_innovation", "expansion", "funny", "starter", "masters", "custom"].includes(type)) {
      continue;
    }

    if (isReleasedExpansionOrCoreSet(type, releaseDate)) {
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

  //Add random possibility
  playableSets["random"] = [{ code: "RNG", name: "Random Set" }];

  // sort all keys depending on releaseDate
  for (let type in playableSets) {
    playableSets[type].sort((a, b) => {
      return Number(b.releaseDate.replace(/-/g, "")) - Number(a.releaseDate.replace(/-/g, ""));
    });
  }

  return playableSets;
};

const SET_TYPES_EXCLUDED_FROM_RANDOM_SET = new Set(["custom", "random", "funny"]);
const getRandomSet = () => {
  const allSets = getPlayableSets();
  const allTypes = Object.keys(allSets)
    .filter(setType => !SET_TYPES_EXCLUDED_FROM_RANDOM_SET.has(setType));

  const randomType = allTypes[allTypes.length * Math.random() << 0];

  const randomSets = allSets[randomType];
  return randomSets[randomSets.length * Math.random() << 0];
};

const getLatestReleasedSet = () => {
  if (!latestSet) {
    getPlayableSets();
  }
  return latestSet;
};

const getExpansionOrCoreModernSets = () => {
  const sets = [];
  for (const setCode in getSets()) {
    const set = getSets()[setCode];
    if (isReleasedExpansionOrCoreSet(set.type, set.releaseDate)
      && Date.parse("2003-07-26") <= Date.parse(set.releaseDate)) {
      set.code = setCode;
      sets.push(set);
    }
  }
  return sets;
};

const getExansionOrCoreSets = () => {
  const sets = [];
  for (const setCode in getSets()) {
    const set = getSets()[setCode];
    if (isReleasedExpansionOrCoreSet(set.type, set.releaseDate)) {
      set.code = setCode;
      sets.push(set);
    }
  }
  return sets;
};

const isReleasedExpansionOrCoreSet = (type, releaseDate) => (
  ["expansion", "core"].includes(type) &&
  Date.parse(releaseDate) <= new Date()
);

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
  getRandomSet,
  getLatestReleasedSet,
  getExpansionOrCoreModernSets,
  getExansionOrCoreSets,
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
