const fs = require("fs");
const logger = require("./logger");
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
    if (!sets[type]) {
      sets[type] = [{ code, name, releaseDate }];
    } else {
      sets[type].push({ code, name, releaseDate });
    }
  }

  // sort all keys depending on releaseDate
  for(let type in sets) {
    sets[type].sort((a, b) => {
      return Number(b.releaseDate.replace(/-/g, "")) - Number(a.releaseDate.replace(/-/g, ""));
    });
  }

  toReload = false;
  return sets;
};

const reloadSets = () => toReload = true;

module.exports = {
  getSets,
  reloadSets
};