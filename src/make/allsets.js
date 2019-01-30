const fs = require("fs");
const https = require("https");
const rp = require("request-promise-native");
const unzip = require("unzip");
const logger = require("../logger");
const { reloadSets } = require("../sets-service");
const parseCards = require("./cards");

const allSetsPath = "data/AllSets.json";
const mtgJsonURL = "https://mtgjson.com/json/AllSets.json.zip";
const versionURL = "https://mtgjson.com/json/version.json";
const setsVersion = "data/version.json";

const prepareAllSets = (raw) => {
  const setsToIgnore = ["TSB", "ITP", "CP1", "CP2", "CP3"];
  // Add set codes here to have them removed
  for (var removeSet of setsToIgnore) {
    if (raw[removeSet]) {
      delete raw[removeSet];
    }
    else {
      logger.warning("Set " + removeSet + " would be removed but not found in MTGJSON. (in make/cards)");
    }
  }

  const types = ["core", "expansion", "commander", "planechase", "starter", "un"];
  const specialSets = ["UMA", "EMA", "MMA", "VMA", "CNS", "TPR", "MM2", "EXP", "MPS", "CN2", "MM3", "MPS_AKH", "IMA", "BBD", "A25"];
  for (let setCode in raw) {
    if (!types.includes(raw[setCode].type) && !specialSets.includes(setCode)) {
      delete raw[setCode];
    }
  }

  const COLORS = {
    W: "white",
    U: "blue",
    B: "black",
    R: "red",
    G: "green"
  };

  ["BFZ", "OGW"].forEach(setName => {
    for (card of raw[setName].cards)
      if (card.text && card.text.startsWith("Devoid"))
        card.colors = card.manaCost
          .replace(/[\d{}]/g, "")
          .replace(/(.)\1+/g, "$1")
          .split("")
          .map(c => COLORS[c]);
  });

  var card;
  for (card of raw.EMN.cards)
    if (card.layout === "double-faced" || card.layout === "meld")
      card.rarity = "special";
  for (card of raw.SOI.cards)
    if (card.layout === "double-faced")
      card.rarity = "special";
  for (card of raw.ISD.cards)
    if (card.layout === "double-faced")
      card.rarity = "special";
  for (card of raw.DGM.cards)
    if (/Guildgate/.test(card.name))
      card.rarity = "special";
  for (card of raw.CNS.cards)
    if ((card.type === "Conspiracy")
      || /draft/.test(card.text))
      card.rarity = "special";
  for (card of raw.FRF.cards)
    if (card.types[0] === "Land"
      && (card.name !== "Crucible of the Spirit Dragon"))
      card.rarity = "special";

  // Delete promo cards of sets
  for (let setCode in raw) {
    const set = raw[setCode];
    if (set.baseSetSize) {
      set.cards = set.cards.filter(({ number }) => parseInt(number) <= set.baseSetSize);
    }
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
      //masterpiecelist[masterset]['cards']
    } else {
      sets[masterset]["special"] = {
        "masterpieces": []
      };
      for (var mpindex in masterpiecelist[masterset]["cards"]) {
        sets[masterset]["special"]["masterpieces"].push(masterpiecelist[masterset]["cards"][mpindex].toLowerCase());
      }
    }
    var mastercards = masterpiecelist[masterset]["cards"];
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

const isVersionNewer = (remoteVer, currentVer) => (
  Number(remoteVer.version.replace(/\./g, "")) > Number(currentVer.version.replace(/\./g, ""))
);

const isVersionUpToDate = async () => {
  const options = {
    method: "GET",
    uri: versionURL,
    json: true
  };
  //TODO: use new Promise and forget about rp
  const remoteVersion = await rp(options);

  if (fs.existsSync(setsVersion) && !isVersionNewer(remoteVersion, require("../../data/version.json"))) {
    return true;
  }

  const version = JSON.stringify(remoteVersion);
  logger.info(`Found a new version ${version}`);
  fs.writeFileSync(setsVersion, version);
  return false;
};

const fetchZip = () => (
  new Promise((resolve, reject) => {
    https.get(mtgJsonURL, response => {
      response
        .pipe(unzip.Parse())
        .on("entry", (entry) => {
          const fileName = entry.path;
          if (fileName == "AllSets.json") {
            logger.info("Updating AllSets.json");
            const file = fs.createWriteStream(allSetsPath);
            entry.pipe(file)
              .on("finish", () => file.close(resolve));
          }
        })
        .on("error", reject);
    });
  }));

const download = async () => {
  logger.info("Checking if AllSets.json is up to date");
  const isUpToDate = await isVersionUpToDate();
  if (!isUpToDate) {
    await fetchZip();
    logger.info("Fetch AllSets.json finished. Updating the cards and sets data");
    const rawSets = JSON.parse(fs.readFileSync(allSetsPath, "UTF-8"));
    prepareAllSets(rawSets);
    const { allSets, allCards } = parseCards(rawSets);
    postParseSets(allSets, allCards);
    logger.info("Parsing AllSets.json finished");
    fs.writeFileSync("data/sets.json", JSON.stringify(allSets));
    fs.writeFileSync("data/cards.json", JSON.stringify(allCards));
    logger.info("Writing sets.json and cards.json finished");
    reloadSets();
    logger.info("Cards and sets updated");
  } else {
    logger.info("AllSets.json is up to date");
  }
};

module.exports = {
  download
};

//Allow this script to be called directly from commandline.
if (!module.parent) {
  download();
}
