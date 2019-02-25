import _ from "NodePackages/utils/utils";
import App from "./app";

let Cards = {
  Plains:   401994,
  Island:   401927,
  Swamp:    402059,
  Mountain: 401961,
  Forest:   401886
};

export let BASICS = Object.keys(Cards);
let COLORS_TO_LANDS = {
  "W": "Plains",
  "U": "Island",
  "B": "Swamp",
  "R": "Mountain",
  "G": "Forest",
};

for (let name in Cards)
  Cards[name] = {name,
    cmc: 0,
    code: "BFZ",
    color: "colorless",
    rarity: "basic",
    type: "Land",
    url: "https://api.scryfall.com/cards/multiverse/"+`${Cards[name]}`+"?format=image"
  };

let rawPack, clicked;
export let Zones = {
  pack: {},
  main: {},
  side: {},
  junk: {}
};

function hash() {
  let {main, side} = Zones;
  App.send("hash", { main, side });
}

let events = {
  side() {
    let dst = Zones[App.state.side ? "side" : "main"];

    let srcName = App.state.side ? "main" : "side";
    let src = Zones[srcName];

    _.add(src, dst);
    Zones[srcName] = {};
  },
  add(cardName) {
    let zone = Zones[App.state.side ? "side" : "main"];
    zone[cardName] || (zone[cardName] = 0);
    zone[cardName]++;
    App.update();
  },
  click(zoneName, cardName, e) {
    if (zoneName === "pack")
      return clickPack(cardName);

    let src = Zones[zoneName];
    let dst = Zones[e.shiftKey
      ? zoneName === "junk" ? "main" : "junk"
      : zoneName === "side" ? "main" : "side"];

    dst[cardName] || (dst[cardName] = 0);

    src[cardName]--;
    dst[cardName]++;

    if (!src[cardName])
      delete src[cardName];

    App.update();
  },
  copy() {
    let textField = document.createElement("textarea");
    textField.value = filetypes.txt();
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    hash();
  },
  download() {
    let {filename, filetype} = App.state;
    let data = filetypes[filetype]();
    _.download(data, filename + "." + filetype);
    hash();
  },
  start() {
    let {addBots, useTimer, timerLength, shufflePlayers} = App.state;
    let options = {addBots, useTimer, timerLength, shufflePlayers};
    App.send("start", options);
  },
  pack(cards) {
    rawPack = cards;
    let pack = Zones.pack = {};

    for (let card of cards) {
      let {name} = card;
      Cards[name] = card;
      pack[name] || (pack[name] = 0);
      pack[name]++;
    }
    App.update();
    if (App.state.beep)
      document.getElementById("beep").play();
  },
  log(draftLog) {
    App.state.log = draftLog;
  },
  getLog() {
    let {id, log, players, self, sets, type, filename} = App.state;
    let isCube = /cube/.test(type);
    let date = new Date().toISOString().slice(0, -5).replace(/-/g,"").replace(/:/g,"").replace("T","_");
    let data = [
      `Event #: ${id}`,
      `Time: ${date}`,
      "Players:"
    ];

    players.forEach((x, i) =>
      data.push(i === self ? `--> ${x.name}` : `    ${x.name}`)
    );

    for (var round in log) {
      data.push("", `------ ${isCube ? "Cube" : sets.shift()} ------`);
      log[round].forEach(function (pick, i) {
        data.push("", `Pack ${round} pick ${i + 1}:`);
        data = data.concat(pick);
      });
    }

    _.download(data.join("\n"), `${filename}-draftlog.txt`);
  },

  create() {
    let {type, seats, title, isPrivate, fourPack, modernOnly, totalChaos} = App.state;
    let savename = App.state.type === "draft" ? App.state.sets[0] + "-draft" : App.state.type;
    App.state.filename = savename + "-" + new Date().toISOString().slice(0, -5).replace(/-/g,"").replace(/:/g,"").replace("T","-");
    App.save("filename", App.state.filename);
    seats = Number(seats);
    let options = { type, seats, title, isPrivate, fourPack, modernOnly, totalChaos };

    if (/cube/.test(type))
      options.cube = cube();
    else {
      let {sets} = App.state;
      if (type === "draft")
        sets = sets.slice(0, 3);
      options.sets = sets;
    }
    resetZones();
    App.send("create", options);
  },
  pool(cards) {
    ["main", "side", "junk"].forEach(zoneName => Zones[zoneName] = {});

    let zone = Zones[App.state.side
      ? "side"
      : "main"];

    for (let card of cards) {
      let {name} = card;
      Cards[name] = card;

      zone[name] || (zone[name] = 0);
      zone[name]++;
    }
    App.update();
  },
  land(zoneName, cardName, e) {
    let n = Number(e.target.value);
    if (n)
      Zones[zoneName][cardName] = n;
    else
      delete Zones[zoneName][cardName];
    App.update();
  },
  deckSize(e) {
    let n = Number(e.target.value);
    if (n && n > 0)
      App.state.deckSize = n;
    App.update();
  },
  suggestLands() {
    // Algorithm: count the number of mana symbols appearing in the costs of
    // the cards in the pool, then assign lands roughly commensurately.
    let colors = ["W", "U", "B", "R", "G"];
    let colorRegex = /\{[^}]+\}/g;
    let manaSymbols = {};
    colors.forEach(x => manaSymbols[x] = 0);

    // Count the number of mana symbols of each type.
    for (let card of Object.keys(Zones["main"])) {
      let quantity = Zones["main"][card];
      card = Cards[card];

      if (!card.manaCost)
        continue;
      let cardManaSymbols = card.manaCost.match(colorRegex);

      for (let color of colors)
        for (let symbol of cardManaSymbols)
          // Test to see if '{U}' contains 'U'. This also handles things like
          // '{G/U}' triggering both 'G' and 'U'.
          if (symbol.indexOf(color) !== -1)
            manaSymbols[color] += quantity;
    }

    _resetLands();
    // NB: We could set only the sideboard lands of the colors we are using to
    // 5, but this reveals information to the opponent on Cockatrice (and
    // possibly other clients) since it tells the opponent the sideboard size.
    colors.forEach(color => Zones["side"][COLORS_TO_LANDS[color]] = 5);

    colors = colors.filter(x => manaSymbols[x] > 0);
    colors.forEach(x => manaSymbols[x] = Math.max(3, manaSymbols[x]));
    colors.sort((a, b) => manaSymbols[b] - manaSymbols[a]);

    // Round-robin choose the lands to go into the deck. For example, if the
    // mana symbol counts are W: 2, U: 2, B: 1, cycle through the sequence
    // [Plains, Island, Swamp, Plains, Island] infinitely until the deck is
    // finished.
    //
    // This has a few nice effects:
    //
    //   * Colors with greater mana symbol counts get more lands.
    //
    //   * When in a typical two color deck adding 17 lands, the 9/8 split will
    //   be in favor of the color with slightly more mana symbols of that
    //   color.
    //
    //   * Every color in the deck is represented, if it is possible to do so
    //   in the remaining number of cards.
    //
    //   * Because of the minimum mana symbol count for each represented color,
    //   splashing cards doesn't add exactly one land of the given type
    //   (although the land count may still be low for that color).
    //
    //   * The problem of deciding how to round land counts is now easy to
    //   solve.
    let manaSymbolsToAdd = colors.map(color => manaSymbols[color]);
    let colorsToAdd = [];
    const emptyManaSymbols = () => !manaSymbolsToAdd.every(x => x === 0);

    for (let i = 0; emptyManaSymbols(); i = (i + 1) % colors.length) {
      if (manaSymbolsToAdd[i] === 0)
        continue;
      colorsToAdd.push(colors[i]);
      manaSymbolsToAdd[i]--;
    }

    if (colorsToAdd.length > 0) {
      let mainDeckSize = Object.keys(Zones["main"])
        .map(x => Zones["main"][x])
        .reduce((a, b) => a + b);
      let landsToAdd = App.state.deckSize - mainDeckSize;

      let j = 0;
      for (let i = 0; i < landsToAdd; i++) {
        let color = colorsToAdd[j];
        let land = COLORS_TO_LANDS[color];
        if (!Zones["main"].hasOwnProperty(land))
          Zones["main"][land] = 0;
        Zones["main"][land]++;

        j = (j + 1) % colorsToAdd.length;
      }
    }

    App.update();
  },
  resetLands() {
    _resetLands();
    App.update();
  },
};

function _resetLands() {
  Object.keys(COLORS_TO_LANDS).forEach((key) => {
    let land = COLORS_TO_LANDS[key];
    Zones["main"][land] = Zones["side"][land] = 0;
  });
}

for (let event in events)
  App.on(event, events[event]);

function codify(zone) {
  let arr = [];
  for (let name in zone)
    arr.push(`    <card number="${zone[name]}" name="${name}"/>`);
  return arr.join("\n");
}

let filetypes = {
  cod() {
    return `\
<?xml version="1.0" encoding="UTF-8"?>
<cockatrice_deck version="1">
  <deckname>${App.state.filename}</deckname>
  <zone name="main">
${codify(Zones.main)}
  </zone>
  <zone name="side">
${codify(Zones.side)}
  </zone>
</cockatrice_deck>`;
  },
  mwdeck() {
    let arr = []
    ;["main", "side"].forEach(zoneName => {
      let prefix = zoneName === "side" ? "SB: " : "";
      let zone = Zones[zoneName];
      for (let name in zone) {
        let {code} = Cards[name];
        let count = zone[name];
        name = name.replace(" // ", "/");
        arr.push(`${prefix}${count} [${code}] ${name}`);
      }
    });
    return arr.join("\n");
  },
  json() {
    let {main, side} = Zones;
    return JSON.stringify({ main, side }, null, 2);
  },
  txt() {
    let arr = []
    ;["main", "side"].forEach(zoneName => {
      if (zoneName === "side")
        arr.push("Sideboard");
      let zone = Zones[zoneName];
      for (let name in zone) {
        let count = zone[name];
        arr.push(count + " " + name);
      }
    });
    return arr.join("\n");
  }
};

function cube() {
  let {list, cards, packs, cubePoolSize} = App.state;
  cards = Number(cards);
  packs = Number(packs);
  cubePoolSize = Number(cubePoolSize);

  list = list
    .split("\n")
    .map(x => x
      .trim()
      .replace(/^\d+.\s*/, "")
      .replace(/\s*\/+\s*/g, " // ")
      .toLowerCase())
    .filter(x => x)
    .join("\n");

  return { list, cards, packs, cubePoolSize };
}

function clickPack(cardName) {
  let index = rawPack.findIndex(x => x.name === cardName);

  if (clicked !== cardName) {
    clicked = cardName;
    // There may be duplicate cards in a pack, but only one copy of a card is
    // shown in the pick view. We must be sure to mark them all since we don't
    // know which one is being displayed.
    rawPack.forEach(card => card.isAutopick = card.name === cardName);
    App.update();
    App.send("autopick", index);
    return clicked;
  }

  clicked = null;
  Zones.pack = {};
  App.update();
  App.send("pick", index);
}

function Key(groups, sort) {
  let keys = Object.keys(groups);
  let arr;

  switch(sort) {
  case "cmc":
    arr = [];
    for (let key in groups)
      if (parseInt(key) > 6) {
        [].push.apply(arr, groups[key]);
        delete groups[key];
      }

    if (arr.length) {
      groups["6"] || (groups["6"] = [])
      ;[].push.apply(groups["6"], arr);
    }
    return groups;

  case "color":
    keys =
        ["colorless", "white", "blue", "black", "red", "green", "multicolor"]
          .filter(x => keys.indexOf(x) > -1);
    break;
  case "rarity":
    keys =
        ["mythic", "rare", "uncommon", "common", "basic", "special"]
          .filter(x => keys.indexOf(x) > -1);
    break;
  case "type":
    keys = keys.sort();
    break;
  }

  let o = {};
  for (let key of keys)
    o[key] = groups[key];
  return o;
}

function sortLandsBeforeNonLands(lhs, rhs) {
  let isLand = x => x.type.toLowerCase().indexOf("land") !== -1;
  let lhsIsLand = isLand(lhs);
  let rhsIsLand = isLand(rhs);
  return rhsIsLand - lhsIsLand;
}

function resetZones() {
  Zones = {
    pack: {},
    main: {},
    side: {},
    junk: {}
  };
}

export function getZone(zoneName) {
  let zone = Zones[zoneName];

  let cards = [];
  for (let cardName in zone)
    for (let i = 0; i < zone[cardName]; i++)
      cards.push(Cards[cardName]);

  let {sort} = App.state;
  let groups = _.group(cards, sort);
  for (let key in groups)
    _.sort(groups[key], sortLandsBeforeNonLands, "color", "cmc", "name");

  groups = Key(groups, sort);

  return groups;
}
