var _ = require("./_");
var { getCards, getSets, getMws } = require("./data");
const { getRandomSet } = require("./sets-service");

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
  case "DOM":
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
      // Choose to replace an uncommon or rare slot
      if (_.rand(4) === 0) {
        var packIndex = 3;
        var isMythic = mythic.includes(pack[packIndex]);
        var pool = isMythic ? mythic : rare;
      } else {
        // Uncommon slot
        var packIndex = 0;
        var pool = uncommon;
      }
      const legendaryCreatures = pool.filter(isLegendaryCreature);
      pack[packIndex] = _.choose(1, legendaryCreatures);
    }
    break;
  case "M19":
    //http://wizardsmagic.tumblr.com/post/175584204911/core-set-2019-packs-basic-lands-and-upcoming
    // 5/12 of times -> dual-land
    // 7/12 of times -> basic land
    const dualLands = common.filter(cardName => getCards()[cardName].type === "Land");
    common = common.filter(cardName => !dualLands.includes(cardName)); //delete dualLands from possible choice as common slot
    const isDualLand = _.rand(12) < 6;
    const land = _.choose(1, isDualLand ? dualLands : basic);
    pack.push(...land);
    break;
  case "GRN":
  case "RNA":
    // No basics. Always 1 common slots are occupied by guildgates
    const guildGates = common.filter(cardName => getCards()[cardName].type === "Land" && getCards()[cardName].sets[code].rarity == "common");
    common = common.filter(cardName => !guildGates.includes(cardName)); //delete guildGates from possible choice as common slot
    pack.push(_.choose(1, guildGates));
    break;
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

module.exports = function (src, playerCount, isSealed, isChaos, modernOnly, totalChaos) {
  if (!(src instanceof Array)) {
    if (!(isChaos)) {
      var isCube = true;
      _.shuffle(src.list);
    }
  }
  else {
    for (i = 0; i < src.length; i++) {
      if (src[i] == "RNG") {
        src[i] = getRandomSet().code;
      }
    }
  }
  if (isSealed) {
    var count = playerCount;
    var size = 90;
  } else {
    count = playerCount * src.packs;
    size = src.cards;
  }
  var pools = [];

  if (isCube || isSealed) {
    if (!(isChaos)) {
      while (count--)
        pools.push(isCube
          ? toCards(src.list.splice(-size))
          : [].concat(...src.map(toPack)));
    } else {
      var setlist = [];
      var modernSets = ["AER", "KLD", "EMN", "SOI", "OGW", "BFZ", "ORI", "DTK", "FRF", "KTK", "M15", "JOU", "BNG", "THS", "M14", "DGM", "GTC", "RTR", "M13", "AVR", "DKA", "ISD", "M12", "NPH", "MBS", "SOM", "M11", "ROE", "WWK", "ZEN", "M10", "ARB", "CON", "ALA", "EVE", "SHM", "MOR", "LRW", "10E", "FUT", "PLC", "TSP", "CSP", "DIS", "GPT", "RAV", "9ED", "SOK", "8ED", "BOK", "CHK", "5DN", "DST", "MRD"];
      if (modernOnly) {
        setlist = modernSets;
      }
      else {
        for (let code in getSets())
          if (code != "UNH" && code != "UGL")
            setlist.push(code);
      }
      if (!(totalChaos)) {
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < playerCount; j++) {
            let setindex = _.rand(setlist.length);
            let code = setlist[setindex];
            setlist.splice(setindex, 1);
            pools.push(toPack(code));
          }
        }
      }
      else {
        var setindex = 0;
        for (var i = 0; i < 3; i++) {
          for (var j = 0; j < playerCount; j++) {
            var chaosPool = [];
            setindex = _.rand(setlist.length);
            if (setlist[setindex].mythic && !_.rand(8)) {
              chaosPool.push(_.choose(1, getSets()[setlist[setindex]].mythic));
            }
            else {
              chaosPool.push(_.choose(1, getSets()[setlist[setindex]].rare));
            }
            for (let k = 0; k < 3; k++) {
              setindex = _.rand(setlist.length);
              chaosPool.push(_.choose(1, getSets()[setlist[setindex]].uncommon));
            }
            for (let k = 0; k < 11; k++) {
              setindex = _.rand(setlist.length);
              chaosPool.push(_.choose(1, getSets()[setlist[setindex]].common));
            }
            pools.push(toCards(chaosPool));
          }
        }
      }
    }
  } else {
    for (let code of src.reverse())
      for (let i = 0; i < playerCount; i++)
        pools.push(toPack(code));
  }
  return pools;
};

