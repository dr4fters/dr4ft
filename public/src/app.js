import _ from '../lib/utils'
import EventEmitter from '../lib/ee'
import {STRINGS} from './config'

function message(msg) {
  let args = JSON.parse(msg)
  App.emit(...args)
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
    title: '',
    isPrivate: true,
    fourPack: false,
    modernOnly: false,
    totalChaos: false,
    type: 'draft',
    sets: [
      'XLN',
      'XLN',
      'XLN',
      'XLN',
      'XLN',
      'XLN'
    ],
    list: '',
    cards: 15,
    packs: 3,

    addBots: true,
    shufflePlayers: true,
    useTimer: true,
    timerLength: 'Moderate', // Fast Moderate or Slow

    beep: false,
    chat: true,
    cols: false,
    deckSize: 40,
    filename: 'filename',
    filetype: 'txt',
    side: false,
    sort: 'color',
    log: {},

    get didGameStart() {
      // both round === 0 and round is undefined
      return App.state.round
    },
    get isGameFinished() {
      return App.state.round === -1
    },
  },

  init(router) {
    App.on('set', App.set)
    App.on('error', App.error)
    App.on('route', App.route)

    App.restore()
    App.connect()
    router(App)
  },
  restore() {
    for (let key in this.state) {
      let val = localStorage[key]
      if (val) {
        try {
          this.state[key] = JSON.parse(val)
        } catch(e) {
          delete localStorage[key]
        }
      }
    }

    if (!this.state.id) {
      this.state.id = _.uid()
      localStorage.id = JSON.stringify(this.state.id)
    }
  },
  connect() {
    let {id, name} = App.state
    let options = {
      query: { id, name }
    }
    let ws = this.ws = eio(location.host, options)
    ws.on('open' , ()=> console.log('open'))
    ws.on('close', ()=> console.log('close'))
    ws.on('message', message)
  },
  send(...args) {
    let msg = JSON.stringify(args)
    this.ws.send(msg)
  },
  error(err) {
    App.err = err
    App.route('')
  },
  route(path) {
    if (path === location.hash.slice(1))
      App.update()
    else
      location.hash = path
  },
  save(key, val) {
    this.state[key] = val
    localStorage[key] = JSON.stringify(val)
    App.update()
  },
  set(state) {
    Object.assign(App.state, state)
    App.update()
  },
  update() {
    React.renderComponent(App.component, document.body)
  },
  _emit(...args) {
    return App.emit.bind(App, ...args)
  },
  _save(key, val) {
    return App.save.bind(App, key, val)
  },
  link(key, index) {
    let hasIndex = index !== void 0

    let value = App.state[key]
    if (hasIndex)
      value = value[index]

    function requestChange(val) {
      if (hasIndex) {
        let tmp = App.state[key]
        tmp[index] = val
        val = tmp
      }
      App.save(key, val)
    }

    return { requestChange, value }
  },
}

export default App
