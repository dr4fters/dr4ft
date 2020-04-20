import _ from "utils/utils";
import App from "./app";
import {vanillaToast} from "vanilla-toast";
import {times, constant, countBy, findIndex, range} from "lodash";
import {BASIC_LANDS_BY_COLOR_SIGN, ZONE_JUNK, ZONE_MAIN, ZONE_PACK, ZONE_SIDEBOARD} from "./gamestate";

/**
 * TODO: add autopickId to GameState
 *  check when change of autopick or when a new pack arrives to modify the autopick value
 *  or find a way to indicate what card is autopick
 */
let clickedCardId;

export const getZone = (zoneName) => App.state.gameState.get(zoneName);

function hash() {
  App.send("hash", {
    main: App.state.gameState.countCardsByName(ZONE_MAIN),
    side: App.state.gameState.countCardsByName(ZONE_SIDEBOARD),
  });
}

/**
 * @desc this is the list of all the events that can be triggered by the App
 * the rule is that the function name is the event to be triggered
 * e.g: add(card) is triggered by App.emit("add", card)
 */
const events = {
  add(card) {
    const zoneName = App.state.side ? ZONE_SIDEBOARD : ZONE_MAIN;
    App.state.gameState.add(zoneName, card);
    App.update();
  },
  click(zoneName, card, e) {
    if (zoneName === ZONE_PACK)
      return clickPack(card);

    const dst = e.shiftKey
      ? zoneName === ZONE_JUNK ? ZONE_MAIN : ZONE_JUNK
      : zoneName === ZONE_SIDEBOARD ? ZONE_MAIN : ZONE_SIDEBOARD;

    App.state.gameState.move(zoneName, dst, card);

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
    const {filename, filetype} = App.state;
    const data = filetypes[filetype]();
    _.download(data, filename + "." + filetype);
    hash();
  },
  start() {
    const {addBots, useTimer, timerLength, shufflePlayers} = App.state;
    const options = {addBots, useTimer, timerLength, shufflePlayers};
    App.send("start", options);
  },
  pickNumber(pick) {
    App.save("pickNumber", pick);
  },
  pack(cards) {
    App.state.gameState.pack(cards);
    App.update();
    const anchor = document.querySelector("#cardZone");
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth" });
    }
    if (App.state.beep) {
      if (App.state.notify) {
        if (document.hidden) {
          new Notification("Pack awaiting", {
            icon: "/4-hq.png",
            body: "A new pack is available!"
          });
        }
      } else {
        const beep = document.getElementById("beep");
        if (beep) {
          beep.play();
        }
      }
    }
  },
  log(draftLog) {
    App.state.log = draftLog;
  },
  getLog() {
    const {id, log, players, self, sets, gamesubtype, filename} = App.state;
    const isCube = /cube/.test(gamesubtype);
    const date = new Date().toISOString().slice(0, -5).replace(/-/g, "").replace(/:/g, "").replace("T", "_");
    let data = [
      `Event #: ${id}`,
      `Time: ${date}`,
      "Players:"
    ];

    players.forEach((player, i) =>
      data.push(i === self ? `--> ${player.name}` : `    ${player.name}`)
    );

    Object.values(log).forEach((round, index) => {
      data.push("", `------ ${isCube ? "Cube" : sets.shift()} ------`);
      round.forEach(function (pick, i) {
        data.push("", `Pack ${index} pick ${i + 1}:`);
        data = data.concat(pick);
      });
    });

    _.download(data.join("\n"), `${filename}-draftlog.txt`);
  },

  create() {
    let {gametype, gamesubtype, seats, title, isPrivate, modernOnly, totalChaos, chaosDraftPacksNumber, chaosSealedPacksNumber} = App.state;
    seats = Number(seats);

    //TODO: either accept to use the legacy types (draft, sealed, chaos draft ...) by  keeping it like this
    // OR change backend to accept "regular draft" instead of "draft" and "regular sealed" instead of "sealed"
    const type = `${/regular/.test(gamesubtype) ? "" : gamesubtype + " "}${gametype}`;

    let options = {type, seats, title, isPrivate, modernOnly, totalChaos};

    switch (gamesubtype) {
    case "regular": {
      const {setsDraft, setsSealed} = App.state;
      options.sets = gametype === "sealed" ? setsSealed : setsDraft;
      break;
    }
    case "cube":
      options.cube = cube();
      break;
    case "chaos":
      options.chaosPacksNumber = /draft/.test(gametype) ? chaosDraftPacksNumber : chaosSealedPacksNumber;
      break;
    }
    App.send("create", options);
  },
  changeSetsNumber(type, event) {
    event.preventDefault();
    const packsNumber = event.currentTarget.value;
    const sets = App.state[type];

    if (sets.length < packsNumber) {
      const toAdd = packsNumber - sets.length;
      const lastSet = sets.slice(-1)[0];
      sets.push(...times(toAdd, constant(lastSet)));
    } else if (sets.length > packsNumber) {
      sets.splice(packsNumber);
    }

    App.save(type, sets);
  },
  pool(cards) {
    const zoneName = App.state.side ? ZONE_SIDEBOARD : ZONE_MAIN;
    this.state.gameState.addToPool(zoneName, cards);
    App.update();
  },
  land(zoneName, card, e) {
    const n = Number(e.target.value);
    App.state.gameState.setLands(zoneName, card, n);
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
    const colors = ["W", "U", "B", "R", "G"];
    const colorRegex = /{[^}]+}/g;
    const manaSymbols = {};
    colors.forEach(x => manaSymbols[x] = 0);

    // Count the number of mana symbols of each type.
    for (const card of App.state.gameState.get(ZONE_MAIN)) {
      if (!card.manaCost)
        continue;
      const cardManaSymbols = card.manaCost.match(colorRegex);

      for (const color of colors)
        for (const symbol of cardManaSymbols)
          // Test to see if '{U}' contains 'U'. This also handles things like
          // '{G/U}' triggering both 'G' and 'U'.
          if (symbol.indexOf(color) !== -1)
            manaSymbols[color] += 1;
    }

    App.state.gameState.resetLands();
    // NB: We could set only the sideboard lands of the colors we are using to
    // 5, but this reveals information to the opponent on Cockatrice (and
    // possibly other clients) since it tells the opponent the sideboard size.
    colors.forEach(color => {
      const basicLand = BASIC_LANDS_BY_COLOR_SIGN[color];
      App.state.gameState.setLands(ZONE_SIDEBOARD, basicLand, 5);
    });

    const mainColors = colors.filter(x => manaSymbols[x] > 0);
    mainColors.forEach(x => manaSymbols[x] = Math.max(3, manaSymbols[x]));
    mainColors.sort((a, b) => manaSymbols[b] - manaSymbols[a]);

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
    const manaSymbolsToAdd = mainColors.map(color => manaSymbols[color]);
    const colorsToAdd = [];
    const emptyManaSymbols = () => !manaSymbolsToAdd.every(x => x === 0);

    for (let i = 0; emptyManaSymbols(); i = (i + 1) % mainColors.length) {
      if (manaSymbolsToAdd[i] === 0)
        continue;
      colorsToAdd.push(mainColors[i]);
      manaSymbolsToAdd[i]--;
    }

    if (colorsToAdd.length > 0) {
      const mainDeckSize = App.state.gameState.getMainDeckSize();
      const landsToAdd = App.state.deckSize - mainDeckSize;

      let j = 0;
      const basicLandsMap = {};
      for (let i = 0; i < landsToAdd; i++) {
        const color = colorsToAdd[j];
        basicLandsMap[color] = ++basicLandsMap[color] || 1;
        j = (j + 1) % colorsToAdd.length;
      }

      Object.entries(basicLandsMap).forEach(([color, number]) => {
        App.state.gameState.setLands(ZONE_MAIN, BASIC_LANDS_BY_COLOR_SIGN[color], number);
      });
    }

    App.update();
  },
  resetLands() {
    App.state.gameState.resetLands();
    App.update();
  },
  chat(messages) {
    App.set({
      messages
    });
  },
  hear(message) {
    App.set({
      messages: [...App.state.messages, message]
    });
    if (!App.state.chat) {
      vanillaToast.info(`${message.name}: ${message.text}`);
    }
  },
  command(message) {
    App.set({
      messages: [...App.state.messages, message]
    });
  },
  notification(e) {
    if (!e.target.checked) {
      App.save("notify", false);
    } else if ("Notification" in window) {
      Notification.requestPermission().then((result) => {
        App.save("notificationResult", result);
        App.save("notify", result === "granted");
      });
    } else {
      App.save("notificationResult", "notsupported");
      App.save("notify", false);
    }
  },
};

Object.keys(events).forEach((event) => App.on(event, events[event]));

function codify(zone) {
  let arr = [];
  Object.entries(countBy(zone, "name")).forEach(([name, number]) => {
    arr.push(`    <card number="${number}" name="${name}"/>`);
  });
  return arr.join("\n");
}

const filetypes = {
  cod() {
    return `\
<?xml version="1.0" encoding="UTF-8"?>
<cockatrice_deck version="1">
  <deckname>${App.state.filename}</deckname>
  <zone name="main">
${codify(App.state.gameState.get(ZONE_MAIN))}
  </zone>
  <zone name="side">
${codify(App.state.gameState.get(ZONE_SIDEBOARD))}
  </zone>
</cockatrice_deck>`;
  },
  mwdeck() {
    const arr = [];
    [ZONE_MAIN, ZONE_SIDEBOARD].forEach(zoneName => {
      const prefix = zoneName === ZONE_SIDEBOARD ? "SB: " : "";
      const zone = App.state.gameState.countCardsBy(zoneName, ({setCode, name}) => `${setCode}|${name}`);
      Object.entries(zone).forEach(([cardName, count]) => {
        const [code, name] = cardName.split("|");
        const sanitizedName = name.replace(" // ", "/");
        arr.push(`${prefix}${count} [${code}] ${sanitizedName}`);
      });
    });
    return arr.join("\n");
  },
  json() {
    return JSON.stringify({
      main: App.state.gameState.countCardsByName(ZONE_MAIN),
      side: App.state.gameState.countCardsByName(ZONE_SIDEBOARD)
    }, null, 2);
  },
  txt() {
    const arr = [];
    [ZONE_MAIN, ZONE_SIDEBOARD].forEach(zoneName => {
      if (zoneName === ZONE_SIDEBOARD) {
        arr.push("Sideboard");
      }
      Object.entries(App.state.gameState.countCardsByName(zoneName))
        .forEach(([name, count]) => {
          arr.push(`${count} ${name}`);
        });
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

  return {list, cards, packs, cubePoolSize};
}

function clickPack(card) {
  const pack = App.state.gameState.get(ZONE_PACK);
  const index = findIndex(pack, ({cardId}) => cardId === card.cardId);
  if (clickedCardId !== card.cardId) {
    clickedCardId = card.cardId;
    // There may be duplicate cards in a pack, but only one copy of a card is
    // shown in the pick view. We must be sure to mark them all since we don't
    // know which one is being displayed.
    pack.forEach(c => c.isAutopick = card.cardId === c.cardId);
    App.update();
    App.send("autopick", index);
  } else {
    clickedCardId = null;
    pack.length = 0;
    App.update();
    App.send("pick", index);
  }
}

export const getSortedZone = (zoneName) => App.state.gameState.getSortedZone(zoneName, App.state.sort);

export function getZoneDisplayName(zoneName) {
  switch (zoneName) {
  case ZONE_PACK:
    return "Pack";
  case ZONE_MAIN:
    return "Main Deck";
  case ZONE_SIDEBOARD:
    return "Sideboard";
  case ZONE_JUNK:
    return "Junk";
  default:
    return "UNKNOWN ZONENAME";
  }
}

/**
 *
 * @param {string} setCode the setCode of the card
 * @param {(string|number)} number the number of the card
 * @return {string} the
 *
 * @example
 *  getScryfallImage("XLN", 1)
 *  getScryfallImage("XLN", "10a")
 *  getScryfallImage("XLN", "10b")
 */
const getScryfallImage = (setCode, number) => (
  `https://api.scryfall.com/cards/${setCode.toLowerCase()}/${number}?format=image&version=${App.state.cardSize}`
);

/**
 *
 * @description returns a cards image URL with the lang selected in the app
 * @param {string} setCode the setCode of the card
 * @param {(string|number)} number the number of the card
 * @return {string} the
 *
 * @example
 *  getScryfallImage("XLN", 1)
 *  getScryfallImage("XLN", "10a")
 *  getScryfallImage("XLN", "10b")
 */
const getScryfallImageWithLang = (setCode, number) => (
  `https://api.scryfall.com/cards/${setCode.toLowerCase()}/${number}/${App.state.cardLang}?format=image&version=${App.state.cardSize}`
);

/**
 * A MTG card
 * @typedef {Object} Card
 * @property {string} setCode - The setCode
 * @property {(string|number)} number the number of the card
 * @property {string} scryfallId - The scryfallId
 * @property {string} url - The original image url of the card
 */


/**
 * @description builds an event function that returns an image url
 * @param {Card} param0
 */
export const getFallbackSrc = ({setCode, number}) => {
  if (!setCode || !number) {
    return null;
  }

  const url = getScryfallImage(setCode, number);
  return ev => {
    if (url !== ev.target.src) {
      ev.target.src = url;
    }
  };
};
/**
 * @description builds an image url based on the card properties
 * @param {Card} card
 * @returns {string} the image url to display
 */
export const getCardSrc = ({scryfallId = "", url, setCode, number, isBack}) => (
  scryfallId !== ""
    ? `${getScryfallImageWithLang(setCode, number)}${isBack ? "&face=back" : ""}`
    : url
);

