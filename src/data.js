const fs = require("fs");
const readFile = (path) => JSON.parse(fs.readFileSync(path, "UTF-8"));

var cards, sets, mws;
let playableSets, latestSet;

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

    //We do not want to play with these types of set (unplayable or lacking cards)
    if (["masterpiece", "starter", "planechase", "commander"].includes(type)) {
      continue;
    }

    if (type === "core" || type === "expansion") {
      if (!latestSet) {
        latestSet = { code, type, name, releaseDate };
      } else if (Number(releaseDate.replace(/-/g, "")) > Number(latestSet.releaseDate.replace(/-/g, ""))) {
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
  while (randomType == "random") {
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
    if (["expansion", "core"].includes(set.type) 
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
    if (["expansion", "core"].includes(set.type)) {
      set.code = setCode;
      sets.push(set);
    }
  }
  return sets;
};

module.exports = {
  getCards,
  getSets,
  getMws,
  writeCards,
  writeSets,
  getPlayableSets,
  getRandomSet,
  getLatestReleasedSet,
  getExpansionOrCoreModernSets,
  getExansionOrCoreSets
};
