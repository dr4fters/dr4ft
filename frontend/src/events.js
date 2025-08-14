import _ from "utils/utils";
import {vanillaToast} from "vanilla-toast";
import DOMPurify from "dompurify";
import {range, times, constant} from "lodash";

import App from "./app";
import {ZONE_MAIN, ZONE_PACK, ZONE_SIDEBOARD} from "./zones";
import exportDeck from "./export";

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
  burn(card) {
    if (!App.state.gameState.isBurn(card.cardId)) {
      App.state.gameState.updateCardBurn(card.cardId, App.state.game.burnsPerPack);
    } else if (App.state.gameState.isSelectionReady(App.state.picksPerPack, App.state.game.burnsPerPack)) {
      App.state.gameState.resetPack();
      App.update();
      App.send("confirmSelection");
    }
  },
  confirmSelection () {
    if (App.state.gameState.isSelectionReady(App.state.picksPerPack, App.state.game.burnsPerPack)) {
      App.send("confirmSelection");
    }
  },
  click(zoneName, card, e) {
    if (zoneName === ZONE_PACK) {
      clickPack(card);
      return;
    }

    if (card.type === "Leader" || card.type === "Base") {
      return;
    }

    const dst = zoneName === ZONE_SIDEBOARD ? ZONE_MAIN : ZONE_SIDEBOARD;

    App.state.gameState.move(zoneName, dst, card);

    App.update();
  },
  copy() {
    const {exportDeckFormat: format, exportDeckFilename: filename} = App.state;
    const textField = document.createElement("textarea");
    textField.value = exportDeck[format].copy(filename, collectDeck(), collectLeader(), collectBase());

    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();

    hash();
  },
  download() {
    const {exportDeckFormat: format, exportDeckFilename: filename} = App.state;
    const data = exportDeck[format].download(filename, collectDeck(), collectLeader(), collectBase());

    _.download(data, filename + exportDeck[format].downloadExtension);

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
    const {gameId, log, players, self, sets, gamesubtype, exportDeckFilename} = App.state;
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

    _.download(data.join("\n"), `${exportDeckFilename}-draftlog.txt`);
  },

  create() {
    let {gametype, gamesubtype, seats, title, isPrivate, modernOnly, totalChaos, picksPerPack} = App.state;
    seats = Number(seats);

    //TODO: either accept to use the legacy types (draft, sealed, chaos draft ...) by  keeping it like this
    // OR change backend to accept "regular draft" instead of "draft" and "regular sealed" instead of "sealed"
    const type = `${/regular/.test(gamesubtype) ? "" : gamesubtype + " "}${gametype}`;

    let options = {type, seats, title, isPrivate, modernOnly, totalChaos,picksPerPack};

    switch (gamesubtype) {
    case "regular": {
      const {setsDraft, setsSealed} = App.state;
      options.sets = gametype === "sealed" ? setsSealed : setsDraft;
      break;
    }
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
  changePicksPerPack(event) {
    App.state.picksPerPack = event.currentTarget.value;
    App.update();
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

const parseCubeOptions = () => {
  let {list, cards, packs, cubePoolSize, burnsPerPack} = App.state;
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

  return {list, cards, packs, cubePoolSize, burnsPerPack};
};

const clickPack = (card) => {
  if (!App.state.gameState.isPick(card.cardId)) {
    App.state.gameState.updateCardPick(card.cardId, App.state.picksPerPack);
  } else if (App.state.gameState.isSelectionReady(App.state.picksPerPack, App.state.game.burnsPerPack)) {
    App.state.gameState.resetPack();
    App.update();
    App.send("confirmSelection");
  }
};

const hash = () => {
  App.send("hash", {
    main: App.state.gameState.countCardsByName(ZONE_MAIN),
    side: App.state.gameState.countCardsByName(ZONE_SIDEBOARD),
  });
};

const collectDeck = () => {
  console.log(App.state.gameState.get(ZONE_MAIN));

  return ({
    [ZONE_MAIN]: collectByName(App.state.gameState.get(ZONE_MAIN)),
    [ZONE_SIDEBOARD]: collectByName(App.state.gameState.get(ZONE_SIDEBOARD), true)
  });
};

const collectLeader = () => {
  return App.state.selectedLeader;
};

const collectBase = () => {
  return App.state.selectedBase;
};

function collectByName (cards, sideboard = false) {
  const collector = cards.reduce((acc, card) => {
    if (card.type === "Base" || card.type === "Leader") {
      return acc;
    }

    const SWUID = `${card.defaultExpansionAbbreviation}_${card.defaultCardNumber}`;
    if (acc[SWUID]) acc[SWUID].count += 1;
    else acc[SWUID] = { id: SWUID, count: 1, sideboard };

    return acc;
  }, {});

  return Object.values(collector);
}
