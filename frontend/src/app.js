import _ from "utils/utils";
import EventEmitter from "events";
import {STRINGS} from "./config";
import eio from "engine.io-client";
import {times, constant} from "lodash";
import GameState from "./gamestate";

function message(msg) {
  let args = JSON.parse(msg);
  App.emit(...args);
}

let App = {
  __proto__: new EventEmitter,

  state: {
    id: null,
    name: STRINGS.BRANDING.DEFAULT_USERNAME,

    serverVersion: null,
    numUsers: 0,
    numPlayers: 0,
    numActiveGames: 0,
    roomInfo: [],

    seats: 8,
    title: "",
    gameId: "",
    isPrivate: true,
    modernOnly: false,
    totalChaos: false,
    chaosDraftPacksNumber: 3,
    chaosSealedPacksNumber: 6,
    gametype: "draft",
    gamesubtype: "regular",
    sets: [],
    setsDraft: [],
    setsSealed: [],
    setsDecadentDraft: [],
    availableSets: {},
    list: "",
    cards: 15,
    packs: 3,
    cubePoolSize: 90,

    addBots: true,
    shufflePlayers: true,
    useTimer: true,
    timerLength: "Moderate", // Fast Moderate or Slow

    beep: true,
    notify: false,
    notificationGranted: false,
    chat: false,
    cols: false,
    hidepicks: false,
    deckSize: 40,
    filename: "filename",
    filetype: "txt",
    side: false,
    sort: "rarity",
    log: {},
    cardSize: "normal",
    cardLang: "en",
    game: {},
    mtgJsonVersion: {
      version: "0.0.0",
      date: "1970-01-01"
    },
    messages: [],
    pickNumber: 0,
    packSize: 15,
    gameSeats: 8, // seats of the game being played
    gameState: null, // records the current state of cards is a GameState
    gameStates: {}, // Object representation of the gameState

    get didGameStart() {
      // both round === 0 and round is undefined
      return App.state.round;
    },
    get isSealed() {
      return /sealed/.test(App.state.game.type);
    },
    get isGameFinished() {
      return App.state.round === -1;
    },
    get isDecadentDraft() {
      return /decadent draft/.test(App.state.game.type);
    },

    get notificationBlocked() {
      return ["denied", "notsupported"].includes(App.state.notificationResult);
    }
  },
  init(router) {
    App.on("set", App.set);
    App.on("error", App.error);
    App.on("route", App.route);

    App.restore();
    App.connect();
    router(App);
  },
  register(component) {
    App.connect();

    App.on("set", App.set);
    App.on("error", App.error);
    App.on("route", App.route);

    App.component = component;
  },
  restore() {
    for (let key in this.state) {
      let val = localStorage[key];
      if (val) {
        try {
          this.state[key] = JSON.parse(val);
        } catch(e) {
          delete localStorage[key];
        }
      }
    }

    if (!this.state.id) {
      this.state.id = _.uid();
      localStorage.id = JSON.stringify(this.state.id);
    }
  },
  connect() {
    let {id, name} = App.state;
    let options = {
      query: { id, name }
    };
    if(!this.ws) {
      this.ws = eio(location.href, options);
      this.ws.on("message", message);
    }
  },
  send(...args) {
    let msg = JSON.stringify(args);
    this.ws.send(msg);
  },
  initGameState(id) {
    const { gameStates } = App.state;
    if (!gameStates[id]) {
      App.state.gameState = new GameState();
    } else {
      App.state.gameState = new GameState(gameStates[id]);
    }
    App.state.gameState.on("updateGameState", (gameState) => {
      App.save("gameStates", {
        // ...App.state.gameStates,
        [id]: gameState
      });
    });
  },
  error(err) {
    App.err = err;
    App.route("");
  },
  route(path) {
    if (path === location.hash.slice(1))
      App.update();
    else
      location.hash = path;
  },
  save(key, val) {
    this.state[key] = val;
    localStorage[key] = JSON.stringify(val);
    App.update();
  },
  set(state) {
    Object.assign(App.state, state);
    if (App.state.latestSet) {
      // Default sets to the latest set.
      const defaultSetCode = App.state.latestSet.code;
      const replicateDefaultSet = (desiredLength) => times(desiredLength, constant(defaultSetCode));
      const initializeIfEmpty = (sets, desiredLength) => {
        if (sets.length === 0) {
          sets = replicateDefaultSet(desiredLength);
        }
      };
      initializeIfEmpty(App.state.setsSealed, 6);
      initializeIfEmpty(App.state.setsDraft, 3);
      initializeIfEmpty(App.state.setsDecadentDraft, 36);
    }
    App.update();
  },
  update() {
    if(App.component) {
      App.component.setState(App.state);
    }
  },
  _emit(...args) {
    return App.emit.bind(App, ...args);
  },
  _save(key, val) {
    return App.save.bind(App, key, val);
  },
  link(key, index) {
    let hasIndex = index !== void 0;

    let value = App.state[key];
    if (hasIndex)
      value = value[index];

    function requestChange(val) {
      if (hasIndex) {
        let tmp = App.state[key];
        tmp[index] = val;
        val = tmp;
      }
      App.save(key, val);
    }

    return { requestChange, value };
  },
  updateGameInfos({type, sets, packsInfo}) {
    const savename = type === "draft" ? sets[0] + "-draft" : type;
    const date = new Date();
    const currentTime = date.toISOString().slice(0, 10).replace("T", " ") + "_" + date.toString().slice(16, 21).replace(":", "-");
    const filename = `${savename.replace(/\W/, "-")}_${currentTime}`;

    App.set({
      filename,
      game: {type, sets, packsInfo}
    });
  },
  getZone(zoneName){
    return App.state.gameState.get(zoneName);
  },
  getSortedZone(zoneName) {
    return App.state.gameState.getSortedZone(zoneName, App.state.sort);
  }
};

export default App;
