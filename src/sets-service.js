const { getSets: getSavedSets } = require("./data");

let sets;
let latestSet;

const getSets = () => {
  if (sets) {
    return sets;
  }
  sets = {};

  const AllSets = getSavedSets();
  for (let code in AllSets) {
    const { type, name, releaseDate } = AllSets[code];

    if (!latestSet) {
      latestSet = { code, type, name, releaseDate };
    } else if (Number(releaseDate.replace(/-/g, "")) > Number(latestSet.releaseDate.replace(/-/g, ""))) {
      latestSet = { code, type, name, releaseDate };
    }

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

  return sets;
};

const getRandomSet = () => {
  const allSets = getSets();
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
    getSets();
  }
  return latestSet;
};

module.exports = {
  getSets,
  getRandomSet,
  getLatestReleasedSet,
};