import App from '../app'
import {BASICS, Zones} from '../cards'
let d = React.DOM

function Lands() {
  let colors = ['White', 'Blue', 'Black', 'Red', 'Green']
  let symbols = colors.map(x =>
    d.td({},
      d.img({ src: `http://www.wizards.com/Magic/redesign/${x}_Mana.png` })))

  let [main, side] = ['main', 'side'].map(zoneName => {
    let inputs = BASICS.map(cardName =>
      d.td({},
        d.input({
          className: 'number',
          min: 0,
          onChange: App._emit('land', zoneName, cardName),
          type: 'number',
          value: Zones[zoneName][cardName] || 0
        })))

    return d.tr({},
      d.td({}, zoneName),
      inputs)
  })

  let suggest = d.tr({},
    d.td({}, 'deck size'),
    d.td({}, d.input({
      className: 'number',
      min: 0,
      onChange: App._emit('deckSize'),
      type: 'number',
      value: App.state.deckSize,
    })),
    d.td({ colSpan: 2 }, d.button({
      className: 'land-suggest-button',
      onClick: App._emit('resetLands')
    }, 'reset lands')),
    d.td({ colSpan: 2 }, d.button({
      className: 'land-suggest-button',
      onClick: App._emit('suggestLands')
    }, 'suggest lands')))

  return d.fieldset({ className: 'land-controls fieldset' },
    d.legend({ className: 'legend game-legend' }, 'Lands'),
    d.table({},
      d.tr({},
        d.td(),
        symbols),
      main,
      side,
      suggest))
}

function Download() {
  let filetypes = ['cod', 'json', 'mwdeck', 'txt'].map(filetype =>
    d.option({}, filetype))
  let select = d.select({ valueLink: App.link('filetype') }, filetypes)

  return d.div({ className: 'connected-container' },
    d.button({
      className: 'connected-component',
      onClick: App._emit('download')
    }, 'Download as'),
    d.input({
      type: 'text',
      className: 'download-filename connected-component',
      placeholder: 'filename',
      valueLink: App.link('filename'),
    }),
    select,
    d.span({ className: 'download-button' }))
}

export default React.createClass({
  render() {
    if (App.state.isGameFinished || App.state.didGameStart)
      return d.div({ className: 'deck-settings' },
        Lands(),
        d.fieldset({ className: 'download-controls fieldset' },
          d.legend({ className: 'legend game-legend' }, 'Download'),
          Download(),
          this.Copy(),
          this.Log())
        )
    return null
  },
  Copy() {
    return d.div({ className: 'copy-controls connected-container' },
      d.button({
        className: 'connected-component',
        onClick: App._emit('copy', this.refs.decklist)
      }, 'Make copyable text'),
      d.textarea({
        className: 'connected-component',
        placeholder: 'decklist',
        ref: 'decklist',
        readOnly: true
      }))
  },
  Log() {
    return d.div({ },
      d.button({
        className: 'connected-component',
        onClick: App._emit('getLog')
      }, 'Download Draft Log'))
  }

})
