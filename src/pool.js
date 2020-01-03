var _ = require("./_");
var { getCards, getSets, getMws, getRandomSet, getExpansionOrCoreModernSets: getModernList, getExansionOrCoreSets: getSetsList } = require("./data");

function selectRarity(set) {
  // average pack contains:
  // 14 cards
  // 10 commons
  // 3 uncommons
  // 7/8 rare
  // 1/8 mythic
  // * 8 -> 112/80/24/7/1

  let n = _.rand(112);
  if (n < 1)
    return set.mythic;
  if (n < 8)
    return set.rare;
  if (n < 32)
    return set.uncommon;
  return set.common;
}

function pickFoil(set) {
  var rngFoil = _.rand(6);
  if (rngFoil < 1)
    if (set.mythic)
      if (_.rand(set.mythic.length + (set.rare.length * 2)) < set.mythic.length)
        return set.mythic;
      else
        return set.rare;
    else
      return set.rare;
  if (rngFoil < 3)
    return set.uncommon;
  return set.common;
}

function toPack(code) {
  var set = getSets()[code];
  var { common, uncommon, rare, mythic, size } = set;

  if (mythic && !_.rand(8))
    rare = mythic;

  if (!rare.length) {
    rare = uncommon; //In some sets rare didn't exist. So we replace them with uncommons
  }

  //make small sets draftable.
  if (size < 10)
    size = 10;

  var pack = [].concat(
    _.choose(size - 4, common),
    _.choose(3, uncommon),
    _.choose(1, rare)
  );

  return toCards(pack, code);
}

function toCards(pool, code) {
  var isCube = !code;
  var packSize = pool.length;
  return pool.map(cardName => {
    var card = {  ...getCards()[cardName.toLowerCase()] };
    card.packSize = packSize;
    var { sets } = card;

    if (isCube)
      [code] = Object.keys(sets)
        .filter(set => !["EXP", "MPS", "MPS_AKH"].includes(set)); // #121: Filter Invocations art

    card.code = getMws()[code] || code;
    var set = sets[code];

    // If the set doesn't exists for TimeSpiral
    // Check in TimeSpiralTimeshifted
    if (!set && code === "TSP") {
      set = sets["TSB"];
    }

    delete card.sets;
    return Object.assign(card, set);
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
