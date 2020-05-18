import _ from "utils/utils";
import App from "./app";
import {vanillaToast} from "vanilla-toast";
import DOMPurify from "dompurify";
import {range, times, constant, countBy, findIndex} from "lodash";
import {ZONE_JUNK, ZONE_MAIN, ZONE_PACK, ZONE_SIDEBOARD} from "./zones";

/**
 * @desc this is the list of all the events that can be triggered by the App
 * the rule is that the function name is the event to be triggered
 * e.g: add(card) is triggered by App.emit("add", card)
 */
const events = {
  add(card) {
    const zoneName = App.state.side ? ZONE_SIDEBOARD : ZONE_MAIN;
    App.state.gameState.add(zoneName, card);
    App.state.gameState.resetPack();
    App.update();
  },
  click(zoneName, card, e) {
    if (zoneName === ZONE_PACK) {
      clickPack(card);
      return;
    }

    const dst = e.shiftKey
      ? zoneName === ZONE_JUNK ? ZONE_MAIN : ZONE_JUNK
      : zoneName === ZONE_SIDEBOARD ? ZONE_MAIN : ZONE_SIDEBOARD;

    App.state.gameState.move(zoneName, dst, card);

    App.update();
  },
  copy() {
    const textField = document.createElement("textarea");
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
    App.save("log", draftLog);
  },
  getLog() {
    const {gameId, log, players, self, sets, gamesubtype, filename} = App.state;
    const isCube = /cube/.test(gamesubtype);
    const date = new Date().toISOString().slice(0, -5).replace(/-/g, "").replace(/:/g, "").replace("T", "_");
    const data = [
      `Event #: ${gameId}`,
      `Time: ${date}`,
      "Players:"
    ];

    players.forEach((player, i) =>
      data.push(i === self ? `--> ${player.name}` : `    ${player.name}`)
    );

    Object.values(log).forEach((round, index) => {
      data.push("", `------ ${isCube ? "Cube" : sets.shift()} ------`);
      round.forEach(function (pick, i) {
        data.push("", `Pack ${index + 1} pick ${i + 1}:`);
        pick.forEach((card) => data.push(card));
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
    case "decadent":
      options.sets = App.state.setsDecadentDraft;
      break;
    case "cube":
      options.cube = parseCubeOptions();
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
  land(zoneName, color, e) {
    const n = Number(e.target.value);
    App.state.gameState.setLands(zoneName, color, n);
    App.update();
  },
  deckSize(e) {
    const n = Number(e.target.value);
    if (n && n > 0) {
      App.state.deckSize = n;
    }
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
    App.state.gameState.get(ZONE_MAIN).forEach((card) => {
      if (!card.manaCost)
        return;
      const cardManaSymbols = card.manaCost.match(colorRegex);

      colors.forEach((color) => {
        Object.values(cardManaSymbols).forEach((symbol) => {
          // Test to see if '{U}' contains 'U'. This also handles things like
          // '{G/U}' triggering both 'G' and 'U'.
          if (symbol.indexOf(color) !== -1)
            manaSymbols[color] += 1;
        });
      });
    });

    App.state.gameState.resetLands();
    // NB: We could set only the sideboard lands of the colors we are using to
    // 5, but this reveals information to the opponent on Cockatrice (and
    // possibly other clients) since it tells the opponent the sideboard size.
    colors.forEach(color => {
      App.state.gameState.setLands(ZONE_SIDEBOARD, color, 5);
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
      if (manaSymbolsToAdd[i] === 0) {
        continue;
      }
      colorsToAdd.push(mainColors[i]);
      manaSymbolsToAdd[i]--;
    }

    if (colorsToAdd.length > 0) {
      const mainDeckSize = App.state.gameState.getMainDeckSize();

      let j = 0;
      const basicLandsMap = {};
      range(App.state.deckSize - mainDeckSize).forEach(() => {
        const color = colorsToAdd[j];
        basicLandsMap[color] = ++basicLandsMap[color] || 1;
        j = (j + 1) % colorsToAdd.length;
      });

      Object.entries(basicLandsMap).forEach(([color, number]) => {
        App.state.gameState.setLands(ZONE_MAIN, color, number);
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
      vanillaToast.info(`${message.name}: ${DOMPurify.sanitize(message.text)}`);
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
  const arr = [];
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

const parseCubeOptions = () => {
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
};

const clickPack = (card) => {
  const pack = App.state.gameState.get(ZONE_PACK);
  const index = findIndex(pack, ({cardId}) => cardId === card.cardId);
  if (!App.state.gameState.isAutopick(card.cardId)) {
    App.state.gameState.updateAutopick(card.cardId);
    App.send("autopick", index);
  } else {
    App.state.gameState.resetPack();
    App.update();
    App.send("pick", index);
  }
};

const hash = () => {
  App.send("hash", {
    main: App.state.gameState.countCardsByName(ZONE_MAIN),
    side: App.state.gameState.countCardsByName(ZONE_SIDEBOARD),
  });
};
