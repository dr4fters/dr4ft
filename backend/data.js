const fs = require("fs");
const readFile = (path) => JSON.parse(fs.readFileSync(path, "UTF-8"));
const {  keyCardsByName, groupCardsByName } = require("./import/keyCards");

let cards, cubableCardsByName, sets;
let playableSets, latestSet;

const getSets = () => {
  if (!sets) {
    sets = readFile("data/sets.json");
  }
  return sets;
};

const getSet = (setCode) => {
  if (!sets) {
    sets = readFile("data/sets.json");
  }
  return sets[setCode];
};

const getCards = () => {
  if (!cards) {
    cards = readFile("data/cards.json");
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
  // Do not put here -> circular reference >_<
  // Sock.broadcast("set", { availableSets: getPlayableSets(), latestSet: getLatestReleasedSet() });
};

const getCardByUuid = (uuid) => {
  return getCards()[uuid];
};

const getCubableCardByName = (cardName) => {
  if (!cubableCardsByName) {
    cubableCardsByName = readFile("data/cubable_cards_by_name.json");
  }
  return cubableCardsByName[cardName];
};

const writeCards = (newCards) => {
  fs.writeFileSync("data/cards.json", JSON.stringify(newCards, undefined, 4));
  cards = newCards;
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

  const cubableCards = groupedCardsArray
    .map((cards) => cards[0]) // take the first card of each group
    .flatMap((card) => {
      const names = card.name.split(" // ");
      const arr = (names.length > 1) ? [card] : [];
      return arr.concat(names.map((name) => ({
        ...card,
        name
      })));
    });
  cubableCardsByName = keyCardsByName(cubableCards);
  fs.writeFileSync("data/cubable_cards_by_name.json", JSON.stringify(cubableCardsByName, undefined, 4));
};

const writeSets = (newSets) => {
  fs.writeFileSync("data/sets.json", JSON.stringify(newSets, undefined, 4));
  sets = newSets;
  playableSets = null;
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

const getRandomSet = () => {
  const allSets = getPlayableSets();
  const allTypes = Object.keys(allSets);
  let randomType = allTypes[allTypes.length * Math.random() << 0];

  //Avoid random set
  while (randomType === "random") {
    randomType = allTypes[allTypes.length * Math.random() << 0];
  }
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
  if (!fs.existsSync("data/draftStats")) {
    fs.mkdirSync("data/draftStats");
  }

  const file = `data/draftStats/${id}.json`;
  fs.writeFileSync(file, JSON.stringify(stats, undefined, 4));
}

module.exports = {
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
  getCardByName: getCubableCardByName
};
