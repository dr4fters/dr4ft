const _ = require("./_");
const boosterGenerator = require("./boosterGenerator");
const { getRandomSet, getExpansionOrCoreModernSets: getModernList, getExansionOrCoreSets: getSetsList } = require("./data");

function toPack(code) {
  const pack = boosterGenerator(code);
  return toCards(pack, code);
}

function toCards(pool, code) {
  var packSize = pool.length; //TODO: add it to an event sent separatly to player
  return pool.map(card => {
    card.packSize = packSize;
    var { sets } = card;

    if (!code)
      [code] = Object.keys(sets)
        .filter(set => !["EXP", "MPS", "MPS_AKH"].includes(set)); // #121: Filter Invocations art

    var set = sets[code];

    // If the set doesn't exists for TimeSpiral
    // Check in TimeSpiralTimeshifted
    if (!set && code === "TSP") {
      set = sets["TSB"];
    }

    return {
      ...card,
      ...set
    };
  });
}

const SealedCube = ({ cubeList, playersLength, playerPoolSize = 90 }) => {
  return DraftCube({
    cubeList,
    playersLength,
    packsNumber: 1,
    playerPackSize: playerPoolSize
  });
};

const DraftCube = ({ cubeList, playersLength, packsNumber = 3, playerPackSize = 15 }) => {
  let list = _.shuffle(cubeList); // copy the list to work on it

  return new Array(playersLength * packsNumber).fill()
    .map(() => {
      const playerPool = list.splice(0, playerPackSize);
      return toCards(playerPool);
    });
};

// Replace RNG set with real set
const  replaceRNGSet = (sets) => (
  sets.map(set => set === "RNG" ? getRandomSet().code : set)
);

const SealedNormal = ({ playersLength, sets }) => (
  new Array(playersLength).fill(replaceRNGSet(sets))
    .map(sets => sets.flatMap(toPack))
);

const DraftNormal = ({ playersLength, sets }) => (
  replaceRNGSet(sets)
    .flatMap(set => new Array(playersLength).fill(set))
    .map(toPack)
);

// Get a random set and transform it to pack
function getRandomPack(setList) {
  const code = chooseRandomSet(setList).code;
  return toPack(code);
}

const chooseRandomSet = (setList) => (
  _.choose(1, setList)[0]
);

// Create a complete random pack
function getTotalChaosPack(setList) {
  const chaosPool = [];
  const randomSet = chooseRandomSet(setList);

  // Check if set has at least rares
  if (randomSet.rare && randomSet.rare.length > 0) {
    const isMythic = randomSet.mythic && !_.rand(8);
    chaosPool.push(_.choose(1, isMythic ? randomSet.mythic : randomSet.rare));
  } else {
    //If no rare exists for the set, we pick an uncommon
    chaosPool.push(_.choose(1, randomSet.uncommon));
  }

  for (let k = 0; k < 3; k++) {
    chaosPool.push(_.choose(1, chooseRandomSet(setList).uncommon));
  }

  for (let k = 0; k < 11; k++) {
    chaosPool.push(_.choose(1, chooseRandomSet(setList).common));
  }
  return toCards(chaosPool);
}

const DraftChaos = ({ playersLength, packsNumber = 3, modernOnly, totalChaos }) => {
  const setList = modernOnly ? getModernList() : getSetsList();

  return new Array(playersLength * packsNumber).fill()
    .map(() => totalChaos ? getTotalChaosPack(setList) : getRandomPack(setList));
};

const SealedChaos = ({ playersLength, packsNumber = 6, modernOnly, totalChaos }) => {
  const pool = DraftChaos({playersLength, packsNumber, modernOnly, totalChaos});
  return new Array(playersLength).fill()
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
