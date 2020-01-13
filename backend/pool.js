const {sample, shuffle, random, range} = require("lodash");
const boosterGenerator = require("./boosterGenerator");
const { getCardByUuid, getCardByName, getRandomSet, getExpansionOrCoreModernSets: getModernList, getExansionOrCoreSets: getSetsList } = require("./data");

const SealedCube = ({ cubeList, playersLength, playerPoolSize = 90 }) => {
  return DraftCube({
    cubeList,
    playersLength,
    packsNumber: 1,
    playerPackSize: playerPoolSize
  });
};

//TODO: filter cards that are from set EXP etc.
const DraftCube = ({ cubeList, playersLength, packsNumber = 3, playerPackSize = 15 }) => {
  let list = shuffle(cubeList); // copy the list to work on it

  return range(playersLength * packsNumber)
    .map(() => {
      return list.splice(0, playerPackSize).map(getCardByName);
    });
};

// Replace RNG set with real set
const replaceRNGSet = (sets) => (
  sets.map(set => set === "RNG" ? getRandomSet().code : set)
);

const SealedNormal = ({ playersLength, sets }) => (
  new Array(playersLength).fill(replaceRNGSet(sets))
    .map(sets => sets.flatMap(boosterGenerator))
);

const DraftNormal = ({ playersLength, sets }) => (
  replaceRNGSet(sets)
    .flatMap(set => new Array(playersLength).fill(set))
    .map(boosterGenerator)
);

// Get a random set and transform it to pack
function getRandomPack(setList) {
  const code = chooseRandomSet(setList).code;
  return boosterGenerator(code);
}

const chooseRandomSet = sample;

// Create a complete random pack
function getTotalChaosPack(setList) {
  const chaosPool = [];
  const randomSet = chooseRandomSet(setList);

  // Check if set has at least rares
  if (randomSet.Rare && randomSet.Rare.length > 0) {
    const isMythic = randomSet.mythic && random(7);
    chaosPool.push(sample(isMythic ? randomSet.Mythic : randomSet.Rare));
  } else {
    //If no rare exists for the set, we pick an uncommon
    chaosPool.push(sample(randomSet.Uncommon));
  }

  for (let k = 0; k < 3; k++) {
    chaosPool.push(sample(chooseRandomSet(setList).Uncommon));
  }

  for (let k = 0; k < 11; k++) {
    chaosPool.push(sample(chooseRandomSet(setList).Common));
  }

  return chaosPool.map(getCardByUuid);
}

const DraftChaos = ({ playersLength, packsNumber = 3, modernOnly, totalChaos }) => {
  const setList = modernOnly ? getModernList() : getSetsList();

  return range(playersLength * packsNumber)
    .map(() => totalChaos ? getTotalChaosPack(setList) : getRandomPack(setList));
};

const SealedChaos = ({ playersLength, packsNumber = 6, modernOnly, totalChaos }) => {
  const pool = DraftChaos({playersLength, packsNumber, modernOnly, totalChaos});
  return range(playersLength)
    .map(() => pool.splice(0, packsNumber).flat());
};

module.exports = {
  SealedCube,
  DraftCube,
  SealedNormal,
  DraftNormal,
  SealedChaos,
  DraftChaos
};
