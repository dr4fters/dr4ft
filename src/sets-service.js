const fs = require("fs");
const readSetsFile = () => JSON.parse(fs.readFileSync("data/sets.json", "UTF-8"));

let toReload = false;
let sets;
const getSets = () => {
  if (!toReload && sets) {
    return sets;
  }
  sets = {};
  const AllSets = readSetsFile();
  for (let code in AllSets) {
    const { type, name, releaseDate } = AllSets[code];

    //We do not want to play with these types of set (unplayable or lacking cards)
    if (["masterpiece", "starter", "planechase", "commander"].includes(type)) {
      continue;
    }
    if (!sets[type]) {
      sets[type] = [{ code, name, releaseDate }];
    } else {
      sets[type].push({ code, name, releaseDate });
    }
  }

  //Add random possibility
  sets["random"] = [{ code: "RNG", name: "Random Set" }];

  // sort all keys depending on releaseDate
  for (let type in sets) {
    sets[type].sort((a, b) => {
      return Number(b.releaseDate.replace(/-/g, "")) - Number(a.releaseDate.replace(/-/g, ""));
    });
  }

  toReload = false;
  return sets;
};

const getRandomSet = () => {
  const allSets = getSets();
  const allTypes = Object.keys(allSets);
  let randomType = allTypes[allTypes.length * Math.random() << 0];
  //Avoid
  while (randomType == "random") {
    randomType = allTypes[allTypes.length * Math.random() << 0];
  }
  const randomSets = allSets[randomType];
  return randomSets[randomSets.length * Math.random() << 0];
};

const reloadSets = () => toReload = true;

module.exports = {
  getSets,
  reloadSets,
  getRandomSet,
};