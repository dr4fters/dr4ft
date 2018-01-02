import App from '../app'
import {Zones} from '../cards'

import Chat from './chat'
import Cols from './cols'
import Grid from './grid'
import DeckSettings from './deck-settings'
import GameSettings from './game-settings'
import {LBox} from './checkbox'
let d = React.DOM

const READY_TITLE_TEXT = 'The host may start the game once all users have clicked the "ready" checkbox.'

export default React.createClass({
  componentWillMount() {
    App.state.players = []
    App.send('join', this.props.id)
    App.state.chat = true
  },
  componentDidMount() {
    this.timer = window.setInterval(decrement, 1e3)
  },
  componentWillUnmount() {
    window.clearInterval(this.timer)
  },
  componentWillReceiveProps({id}) {
    if (this.props.id === id)
      return

    App.send('join', id)
  },
  render() {
    return d.div({ className: 'container' },
      d.audio({ id: 'beep', src: '/media/beep.wav' }),
      d.div({ className: 'game' },
        d.div({ className: 'game-controls' },
          d.div({ className: 'game-status' }, this.Players(), this.Start()),
          DeckSettings(),
          GameSettings()),
        this.Cards()),
      Chat())
  },

  Cards() {
    if (Object.keys(Zones.pack).length)
      let pack = Grid({ zones: ['pack'] })
    let component = App.state.cols ? Cols : Grid
    let pool = component({ zones: ['main', 'side', 'junk'] })
    return [pack, pool]
  },
  Start() {
    if (App.state.didGameStart || !App.state.isHost)
      return

    let numNotReady = App.state.players.filter(x => !x.isReadyToStart).length
    let readyToStart = (numNotReady === 0)
    let startButton
      = readyToStart
      ? d.button({ onClick: App._emit('start') }, 'Start game')
      : d.button({ disabled: true, title: READY_TITLE_TEXT }, 'Start game')

    let readyReminderText = ''
    if (!readyToStart) {
      let players = (numNotReady === 1 ? 'player' : 'players')
      readyReminderText =
        d.span({ style: { marginLeft: '5px' } },
          `Waiting for ${numNotReady} ${players} to become ready...`)
    }
    
    let timers = ['Fast','Moderate','Slow','Leisurely'].map(x => d.option({}, x))
    let startControls = ''
    if (App.state.type !== 'sealed' && App.state.type !== 'cube sealed') {
      startControls = d.div({},
        d.div({}, `Format: ${App.state.format}`),
        LBox('addBots', 'bots'),
        d.div({},
          d.label({},
            LBox('useTimer', 'timer: '),
            d.label({},
              d.select({
                disabled: !App.state.useTimer,
                valueLink: App.link('timerLength')
              }, timers),'')),
          LBox('shufflePlayers', 'Random Seating'),
          d.div({}, startButton, readyReminderText)
        )
      )
    }
    else {
      startControls = d.div({},
        d.div({}, `Format: ${App.state.format}`),
          d.div({}, startButton, readyReminderText))
    }

    return d.fieldset({ className: 'start-controls fieldset' },
      d.legend({ className: 'legend game-legend' }, 'Start game'),
      d.span({}, startControls))
  },
  Players() {
    let rows = App.state.players.map(row)
    let columns = [
      d.th({}, '#'),
      d.th({}, ''), // connection status
      d.th({}, 'name'),
      d.th({}, 'packs'),
      d.th({}, 'time'),
      d.th({}, 'cock'),
      d.th({}, 'mws'),
    ]

    if (!App.state.didGameStart)
      columns.push(d.th({ title: READY_TITLE_TEXT }, 'ready'))

    if (App.state.isHost)
      columns.push(d.th({})) // kick

    let playersTable = d.table({ id: 'players' },
      d.tr({}, ...columns),
      rows)

    return d.fieldset({ className: 'fieldset' },
      d.legend({ className: 'legend game-legend' }, 'Players'),
      playersTable)
  }
})

function row(p, i) {
  let {players, self} = App.state
  let {length} = players

  if (length % 2 === 0)
    let opp = (self + length/2) % length

  let className
    = i === self ? 'self'
    : i === opp  ? 'opp'
    : null

  let connectionStatusIndicator
    = p.isBot ? d.span({
        className: 'icon-bot',
        title: 'This player is a bot.',
      })
    : d.span({
        className: 'icon-connected',
        title: '',
      })

  let readyCheckbox
    = i === self ? d.input({
        checked: p.isReadyToStart,
        disabled: true,
        onChange: App._emit('readyToStart'),
        type: 'checkbox',
      })
    : d.input({
        checked: p.isReadyToStart,
        disabled: true,
        type: 'checkbox',
      })

  let columns = [
    d.td({}, i + 1),
    d.td({}, connectionStatusIndicator),
    d.td({}, p.name),
    d.td({}, p.packs),
    d.td({}, p.time),
    d.td({}, p.hash && p.hash.cock),
    d.td({}, p.hash && p.hash.mws),
  ]

  if (!App.state.didGameStart) {
    columns.push(d.td({
      className: 'ready',
      title: READY_TITLE_TEXT
    }, readyCheckbox))

    if (App.state.isHost) {
      columns.push(
        d.td({},
          d.button({
              onClick: ()=> App.send('swap', [i, i - 1]),
            },
            d.img({ src: `../../media/arrow-up.png`, width: "16px" })
          ),
          d.button({
              onClick: ()=> App.send('swap', [i, i + 1]),
            },
            d.img({ src: `../../media/arrow-down.png`, width: "16px" })
          )
        )
      )
    }
  }

  if (App.state.isHost)
    if (i !== self && !p.isBot)
      columns.push(d.td({}, d.button({
        onClick: ()=> App.send('kick', i),
      }, 'kick')))
    else
      columns.push(d.td({}))

  return d.tr({ className }, ...columns)
}

function decrement() {
  for (let p of App.state.players)
    if (p.time)
      p.time--
  App.update()
}
