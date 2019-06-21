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
  var { basic, common, uncommon, rare, mythic, special, size } = set;

  if (mythic && !_.rand(8))
    rare = mythic;

  if (!rare.length) {
    rare = uncommon; //In some sets rare didn't exist. So we replace them with uncommons
  }

  //make small sets draftable.
  if (size < 10 && code != "SOI" && code != "EMN")
    size = 10;

  var pack = [].concat(
    _.choose(3, uncommon),
    _.choose(1, rare)
  );

  if (code == "SOI")
    //http://markrosewater.tumblr.com/post/141794840953/if-the-as-fan-of-double-face-cards-is-1125-that
    if (_.rand(8) == 0) {
      size = size - 1;
      if (_.rand(15) < 3)
        pack.push(_.choose(1, special.mythic));
      else
        pack.push(_.choose(1, special.rare));
    }
  if (code == "EMN")
    if (_.rand(8) == 0) {
      size = size - 1;
      if (_.rand(5) < 1)
        pack.push(_.choose(1, special.mythic));
      else
        pack.push(_.choose(1, special.rare));
    }
  let foilCard = false;
  let specialrnd;
  switch (code) {
  case "EMN":
    if (_.rand(2) < 1)
      special = special.uncommon;
    else
      special = special.common;
    break;

  case "SOI":
    if (_.rand(106) < 38)
      special = special.uncommon;
    else
      special = special.common;
    break;
  case "DGM":
    special = _.rand(20)
      ? special.gate
      : special.shock;
    break;
  case "EMA":
  case "MMA":
  case "MM2":
  case "MM3":
  case "IMA":
  case "UMA":
    special = selectRarity(set);
    foilCard = true;
    break;
  case "VMA":
    //http://www.wizards.com/magic/magazine/article.aspx?x=mtg/daily/arcana/1491
    if (_.rand(53))
      special = selectRarity(set);
    break;
  case "FRF":
    special = _.rand(20)
      ? special.common
      : special.fetch;
    break;
  case "ISD":
    //http://www.mtgsalvation.com/forums/magic-fundamentals/magic-general/327956-innistrad-block-transforming-card-pack-odds?comment=4
    //121 card sheet, 1 mythic, 12 rare (13), 42 uncommon (55), 66 common
    specialrnd = _.rand(121);
    if (specialrnd == 0)
      special = special.mythic;
    else if (specialrnd < 13)
      special = special.rare;
    else if (specialrnd < 55)
      special = special.uncommon;
    else
      special = special.common;
    break;
  case "DKA":
    //http://www.mtgsalvation.com/forums/magic-fundamentals/magic-general/327956-innistrad-block-transforming-card-pack-odds?comment=4
    //80 card sheet, 2 mythic, 6 rare (8), 24 uncommon (32), 48 common
    specialrnd = _.rand(80);
    if (specialrnd <= 1)
      special = special.mythic;
    else if (specialrnd < 8)
      special = special.rare;
    else if (specialrnd < 32)
      special = special.uncommon;
    else
      special = special.common;
    break;
  case "DOM": {
    // http://markrosewater.tumblr.com/post/172581930278/do-the-legendaries-that-appear-in-the-legendary
    // Every booster must contain a legendary creature either as uncommon or rare
    let hasLegendaryCreature = false;
    const isLegendaryCreature = cardName => {
      const card = getCards()[cardName];
      return card.supertypes.includes("Legendary") && card.type === "Creature";
    };

    pack.some(cardName => {
      return hasLegendaryCreature = isLegendaryCreature(cardName);
    });

    if (!hasLegendaryCreature) {
      var packIndex = 0;
      var pool = uncommon;
      // Choose to replace an uncommon(default) or rare slot
      if (_.rand(4) === 0) {
        packIndex = 3;
        var isMythic = mythic.includes(pack[packIndex]);
        pool = isMythic ? mythic : rare;
      }
      const legendaryCreatures = pool.filter(isLegendaryCreature);
      pack[packIndex] = _.choose(1, legendaryCreatures);
    }
    break;
  }
  case "M19": {
    //http://wizardsmagic.tumblr.com/post/175584204911/core-set-2019-packs-basic-lands-and-upcoming
    // 5/12 of times -> dual-land
    // 7/12 of times -> basic land
    const dualLands = common.filter(cardName => getCards()[cardName].type === "Land");
    common = common.filter(cardName => !dualLands.includes(cardName)); //delete dualLands from possible choice as common slot
    const isDualLand = _.rand(12) < 6;
    const land = _.choose(1, isDualLand ? dualLands : basic);
    pack.push(...land);
    break;
  }
  case "GRN":
  case "RNA": {
    // No basics. Always 1 common slots are occupied by guildgates
    const guildGates = common.filter(cardName => getCards()[cardName].type === "Land" && getCards()[cardName].sets[code].rarity == "common");
    common = common.filter(cardName => !guildGates.includes(cardName)); //delete guildGates from possible choice as common slot
    pack.push(_.choose(1, guildGates));
    break;
  }
  case "MH1": {
    // Each pack has a snow basic land
    // https://magic.wizards.com/en/articles/archive/card-preview/modern-horizons-tokens-and-art-series-2019-05-30
    //
    const snowLands = [
      "snow-covered island",
      "snow-covered forest",
      "snow-covered mountain",
      "snow-covered swamp",
      "snow-covered plains"
    ];
    common = common.filter(cardName => !snowLands.includes(cardName));
    pack = pack.concat(_.choose(1, snowLands));
    break;
  }
  case "WAR": {
    // https://magic.wizards.com/en/articles/archive/feature/closer-look-stained-glass-planeswalkers-2019-03-08
    // Every booster must contain a planeswalker either as uncommon or rare
    const isPlaneswalker = cardName => {
      const card = getCards()[cardName];
      return card.type === "Planeswalker";
    };
    const getPoolFromPackIndex = packIndex => {
      // Choose to replace an uncommon(default) or rare slot
      if (packIndex === 3) {
        var isMythic = mythic.includes(pack[packIndex]);
        return isMythic ? mythic : rare;
      } else {
        return uncommon;
      }
    };

    const planeswalkerCount = pack.filter(isPlaneswalker).length;

    switch (planeswalkerCount) {
    case 0: {
      var packIndex = _.rand(4);
      pool = getPoolFromPackIndex(packIndex);
      const planeswalkers = pool.filter(isPlaneswalker);
      pack[packIndex] = _.choose(1, planeswalkers);
      break;
    }
    case 1: {
      break;
    }
    default: {
      var planeswalkersToRemove = _.choose(planeswalkerCount - 1, pack.filter(isPlaneswalker));
      planeswalkersToRemove.forEach(cardName => {
        var packIndex = pack.indexOf(cardName);
        pool = getPoolFromPackIndex(packIndex);
        const nonPlaneswalkers = pool.filter(cardName => !isPlaneswalker(cardName));
        pack[packIndex] = _.choose(1, nonPlaneswalkers);
      });
    }
    }
    break;
  }
  case "TSP": {
    // Add a TSB card to replace common card
    const TSB = getSets()["TSB"];
    size = size - 1;
    pack.push(..._.choose(1, TSB.rare));
    break;
  }
  }
  var masterpiece = "";
  if (special) {
    if (special.masterpieces) {
      if (_.rand(144) == 0) {
        size = size - 1;
        specialpick = _.choose(1, special.masterpieces);
        specialpick = specialpick[0];
        pack.push(specialpick);
        masterpiece = specialpick;
      }
      special = 0;
    }
    else {
      var specialpick = _.choose(1, special);
      specialpick = specialpick[0];
      pack.push(specialpick);
      if (foilCard) {
        foilCard = specialpick;
      }
    }
  }
  if (_.rand(7) < 1 && !(foilCard) && !(masterpiece)) {
    // http://www.mtgsalvation.com/forums/magic-fundamentals/magic-general/768235-what-are-current-pack-odds-including-foils
    size = size - 1;
    foilCard = _.choose(1, pickFoil(set));
    pack.push(foilCard[0]);
  }
  pack = _.choose(size, common).concat(pack);

  return toCards(pack, code, foilCard, masterpiece);
}

function toCards(pool, code, foilCard, masterpiece) {
  var isCube = !code;
  var packSize = pool.length;
  return pool.map(cardName => {
    var card = Object.assign({}, getCards()[cardName]);
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

    if (masterpiece == card.name.toString().toLowerCase()) {
      card.rarity = "special";
      card.foil = true;
      if (code == "BFZ" || code == "OGW") {
        card.code = "EXP";
      } else if (code == "KLD" || code == "AER") {
        card.code = "MPS";
      } else if (code == "AKH" || code == "HOU") {
        card.code = "MPS_AKH";
      }
      set = sets[card.code];
      masterpiece = "";
    }
    if (foilCard == card.name.toString().toLowerCase()) {
      card.foil = true;
      foilCard = "";
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
