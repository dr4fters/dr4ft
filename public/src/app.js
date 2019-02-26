import _ from "NodePackages/utils/utils";
import EventEmitter from "NodePackages/ee/ee";
import {STRINGS} from "./config";
import eio from "engine.io-client";
import { DateTime } from "luxon";

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
    isPrivate: true,
    fourPack: false,
    modernOnly: false,
    totalChaos: false,
    type: "draft",
    sets: [],
    availableSets: {},
    list: "",
    cards: 15,
    packs: 3,
    cubePoolSize: 90,

    addBots: true,
    shufflePlayers: true,
    useTimer: true,
    timerLength: "Moderate", // Fast Moderate or Slow

    beep: false,
    chat: true,
    cols: false,
    deckSize: 40,
    filename: "filename",
    filetype: "txt",
    side: false,
    sort: "rarity",
    log: {},
    cardSize: "normal",
    game: {},

    get didGameStart() {
      // both round === 0 and round is undefined
      return App.state.round;
    },
    get isGameFinished() {
      return App.state.round === -1;
    },
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
    // Set default sets
    if (App.state.sets.length === 0 && App.state.latestSet) {
      App.state.sets = Array(6).fill(App.state.latestSet.code);
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
  updateFileName() {
    const savename = App.state.game.type === "draft" ? App.state.game.sets[0] + "-draft" : App.state.game.type;
    // Timezone based on each individual drafter
    App.state.filename = savename + "-" + DateTime.local().toFormat("yyyy-MM-dd_TT").replace(/:/g, "-");
    App.save("filename", App.state.filename);
  }
};

export default App;
