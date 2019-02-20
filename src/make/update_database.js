const fs = require("fs");
const logger = require("../logger");
const { writeCards, writeSets } = require("../data");
const parseCards = require("./cards");

const allSetsPath = "data/AllSets.json";

const prepareSet = (raw) => {
  const COLORS = {
    W: "white",
    U: "blue",
    B: "black",
    R: "red",
    G: "green"
  };

  if (["BFZ", "OGW"].includes(raw.code)) {
    for (card of raw.cards) {
      if (card.text && card.text.startsWith("Devoid"))
        card.colors = card.manaCost
          .replace(/[\d{}]/g, "")
          .replace(/(.)\1+/g, "$1")
          .split("")
          .map(c => COLORS[c]);
    }
  }

  var card;

  switch (raw.code) {
  case "EMN": {
    for (card of raw.cards)
      if (card.layout === "double-faced" || card.layout === "meld")
        card.rarity = "special";
  }
    break;
  case "ISD":
  case "SOI": {
    for (card of raw.cards)
      if (card.layout === "double-faced")
        card.rarity = "special";
  }
    break;
  case "DGM": {
    for (card of raw.cards)
      if (/Guildgate/.test(card.name))
        card.rarity = "special";
  }
    break;
  case "CNS": {
    for (card of raw.cards)
      if ((card.type === "Conspiracy")
          || /draft/.test(card.text))
        card.rarity = "special";
  }
    break;
  case "FRF": {
    for (card of raw.cards)
      if (card.types[0] === "Land"
          && (card.name !== "Crucible of the Spirit Dragon"))
        card.rarity = "special";
  }
    break;
  }
};

const postParseSets = (sets, cards) => {
  var masterpiecelist = {
    "BFZ": {
      "cards": ["prairie stream", "sunken hollow", "smoldering marsh", "cinder glade", "canopy vista", "hallowed fountain", "watery grave", "blood crypt", "stomping ground", "temple garden", "godless shrine", "steam vents", "overgrown tomb", "sacred foundry", "breeding pool", "flooded strand", "polluted delta", "bloodstained mire", "wooded foothills", "windswept heath", "marsh flats", "scalding tarn", "verdant catacombs", "arid mesa", "misty rainforest"],
      "code": "EXP"
    },
    "OGW": {
      "cards": ["mystic gate", "sunken ruins", "graven cairns", "fire-lit thicket", "wooded bastion", "fetid heath", "cascade bluffs", "twilight mire", "rugged prairie", "flooded grove", "ancient tomb", "dust bowl", "eye of ugin", "forbidden orchard", "horizon canopy", "kor haven", "mana confluence", "strip mine", "tectonic edge", "wasteland"],
      "code": "EXP"
    },
    "KLD": {
      "cards": ["cataclysmic gearhulk", "torrential gearhulk", "noxious gearhulk", "combustible gearhulk", "verdurous gearhulk", "aether vial", "champion's helm", "chromatic lantern", "chrome mox", "cloudstone curio", "crucible of worlds", "gauntlet of power", "hangarback walker", "lightning greaves", "lotus petal", "mana crypt", "mana vault", "mind's eye", "mox opal", "painter's servant", "rings of brighthearth", "scroll rack", "sculpting steel", "sol ring", "solemn simulacrum", "static orb", "steel overseer", "sword of feast and famine", "sword of fire and ice", "sword of light and shadow"],
      "code": "MPS"
    },
    "AER": {
      "cards": ["Paradox Engine", "Planar Bridge", "Arcbound Ravager", "Black Vise", "Chalice of the Void", "Defense Grid", "Duplicant", "Engineered Explosives", "Ensnaring Bridge", "Extraplanar Lens", "Grindstone", "Meekstone", "Oblivion Stone", "Ornithopter", "Sphere of Resistance", "Staff of Domination", "Sundering Titan", "Sword of Body and Mind", "Sword of War and Peace", "Trinisphere", "Vedalken Shackles", "Wurmcoil Engine"],
      "code": "MPS"
    },
    "AKH": {
      "cards": ["Austere Command", "Aven Mindcensor", "Containment Priest", "Loyal Retainers", "Worship", "Wrath of God", "Consecrated Sphinx", "Counterbalance", "Counterspell", "Cryptic Command", "Daze", "Divert", "Force of Will", "Pact of Negation", "Spell Pierce", "Stifle", "Attrition", "Dark Ritual", "Diabolic Intent", "Entomb", "Mind Twist", "Aggravated Assault", "Chain Lightning", "Maelstrom Pulse", "Vindicate", "Hazoret the Fervent", "Kefnet the Mindful", "Oketra the True", "Bontu the Glorified", "Rhonas the Indomitable"],
      "code": "MPS_AKH"
    },
    "HOU": {
      "cards": ["Armageddon", "Capsize", "Forbid", "Omniscience", "Opposition", "Sunder", "Threads of Disloyalty", "Avatar of Woe", "Damnation", "Desolation Angel", "Diabolic Edict", "Doomsday", "No Mercy", "Slaughter Pact", "Thoughtseize", "Blood Moon", "Boil", "Shatterstorm", "Through the Breach", "Choke", "The Locust God", "Lord of Extinction", "The Scarab God", "The Scorpion God"],
      "code": "MPS_AKH"
    }
  };
  for (var masterset in masterpiecelist) {
    if (sets[masterset]["special"]) {
      sets[masterset]["special"]["masterpieces"] = [];
    } else {
      sets[masterset]["special"] = {
        "masterpieces": []
      };
      for (var mpindex in masterpiecelist[masterset]["cards"]) {
        sets[masterset]["special"]["masterpieces"].push(masterpiecelist[masterset]["cards"][mpindex].toLowerCase());
      }
    }
  }
  var { EMN } = sets;
  EMN.special = {
    "mythic": [
      "gisela, the broken blade",
      "ulrich of the krallenhorde"
    ],
    "rare": [
      "voldaren pariah",
      "docent of perfection",
      "bruna, the fading light",
      "hanweir garrison",
      "hanweir battlements"
    ],
    "common": [
      "ulvenwald captive",
      "vildin-pack outcast",
      "midnight scavengers",
      "graf rats"
    ],
    "uncommon": [
      "tangleclaw werewolf",
      "shrill howler",
      "conduit of storms",
      "extricator of sin",
      "kessig prowler",
      "smoldering werewolf",
      "curious homunculus",
      "grizzled angler",
      "lone rider",
      "cryptolith fragment"
    ]
  };
  EMN.size = 8;
  var { SOI } = sets;
  SOI.special = {
    "mythic": [
      "archangel avacyn",
      "startled awake",
      "arlinn kord"
    ],
    "rare": [
      "hanweir militia captain",
      "elusive tormentor",
      "thing in the ice",
      "geier reach bandit",
      "sage of ancient lore",
      "westvale abbey"
    ],
    "uncommon": [
      "avacynian missionaries",
      "pious evangel",
      "town gossipmonger",
      "aberrant researcher",
      "daring sleuth",
      "uninvited geist",
      "accursed witch",
      "heir of falkenrath",
      "kindly stranger",
      "breakneck rider",
      "convicted killer",
      "skin invasion",
      "village messenger",
      "autumnal gloom",
      "duskwatch recruiter",
      "hermit of the natterknolls",
      "lambholt pacifist",
      "harvest hand",
      "neglected heirloom",
      "thraben gargoyle"
    ],
    "common": [
      "convicted killer",
      "gatstaf arsonists",
      "hinterland logger",
      "solitary hunter"
    ]
  };
  SOI.size = 8;
  var { ISD } = sets;
  ISD.special = {
    mythic: [
      "garruk relentless"
    ],
    rare: [
      "bloodline keeper",
      "daybreak ranger",
      "instigator gang",
      "kruin outlaw",
      "ludevic's test subject",
      "mayor of avabruck"
    ],
    uncommon: [
      "civilized scholar",
      "cloistered youth",
      "gatstaf shepherd",
      "hanweir watchkeep",
      "reckless waif",
      "screeching bat",
      "ulvenwald mystics"
    ],
    common: [
      "delver of secrets",
      "grizzled outcasts",
      "thraben sentry",
      "tormented pariah",
      "village ironsmith",
      "villagers of estwald"
    ]
  };
  var { DKA } = sets;
  DKA.special = {
    mythic: [
      "elbrus, the binding blade",
      "huntmaster of the fells"
    ],
    rare: [
      "mondronen shaman",
      "ravenous demon"
    ],
    uncommon: [
      "afflicted deserter",
      "chalice of life",
      "lambholt elder",
      "soul seizer"
    ],
    common: [
      "chosen of markov",
      "hinterland hermit",
      "loyal cathar",
      "scorned villager"
    ]
  };
  var { DGM } = sets;
  DGM.mythic.splice(DGM.mythic.indexOf("maze's end"), 1);
  DGM.special = {
    gate: DGM.special,
    shock: [
      "blood crypt",
      "breeding pool",
      "godless shrine",
      "hallowed fountain",
      "overgrown tomb",
      "sacred foundry",
      "steam vents",
      "stomping ground",
      "temple garden",
      "watery grave",
      "maze's end"
    ]
  };

  alias(DGM.special.shock, "DGM", cards);

  var { FRF } = sets;
  for (let card of FRF.special) {
    cards[card].sets.FRF.rarity = / /.test(card) ? "common" : "basic";
  }
  FRF.special = {
    common: FRF.special,
    fetch: [
      "flooded strand",
      "bloodstained mire",
      "wooded foothills",
      "windswept heath",
      "polluted delta",
    ]
  };
  alias(FRF.special.fetch, "FRF", cards);

  sets.OGW.common.push("wastes");// wastes are twice as common
};

const alias = (arr, code, cards) => {
  // some boosters contain reprints which are not in the set proper
  for (var cardName of arr) {
    var { sets } = cards[cardName];
    var codes = Object.keys(sets);
    var last = codes[codes.length - 1];
    sets[code] = sets[last];
  }
};

const updateDatabase = () => {
  const rawSets = {};

  // Add sets
  const setsToIgnore = ["TSB", "ITP", "CP1", "CP2", "CP3"];
  const types = ["core", "expansion", "commander", "planechase", "starter", "un"];
  const specialSets = ["UMA", "EMA", "MMA", "VMA", "CNS", "TPR", "MM2", "EXP", "MPS", "CN2", "MM3", "MPS_AKH", "IMA", "BBD", "A25"];
  if (fs.existsSync("data/sets")) {
    const files = fs.readdirSync("data/sets");
    files.forEach(file => {
      if (!/.json/g.test(file)) {
        return;
      }
      const [setName,] = file.split(".");
      if (setsToIgnore.includes(setName)) {
        return;
      }
      const path = `data/sets/${file}`;
      try {
        const json = JSON.parse(fs.readFileSync(path, "UTF-8"));
        if (json.code && !rawSets[json.code] &&
          (types.includes(json.type) || specialSets.includes(json.code))) {
          logger.info(`Found set to integrate ${json.code} with path ${path}`);
          prepareSet(json);
          rawSets[json.code] = json;
        }
      } catch (err) {
        logger.error(`Error while parsing file ${path}: ${err}`);
      }
    });
  }
  // Add custom sets
  if (fs.existsSync("data/custom")) {
    const files = fs.readdirSync("data/custom");
    files.forEach(file => {
      // Integrate only json file
      if (/.json/g.test(file)) {
        const path = `data/custom/${file}`;
        try {
          const json = JSON.parse(fs.readFileSync(path, "UTF-8"));
          if (json.code && !rawSets[json.code]) {
            json.type = "custom";
            logger.info(`Found custom set to integrate ${json.code} with path ${path}`);
            rawSets[json.code] = json;
          }
        } catch (err) {
          logger.error(`Error while parsing file ${path}: ${err}`);
        }
      }
    });
  }
  const { allSets, allCards } = parseCards(rawSets);
  postParseSets(allSets, allCards);
  logger.info("Parsing AllSets.json finished");
  writeCards(allCards);
  writeSets(allSets);
  logger.info("Writing sets.json and cards.json finished");
};


module.exports = updateDatabase;

if (!module.parent) {
  updateDatabase();
}
