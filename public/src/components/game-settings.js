import App from '../app'
import {LBox} from './checkbox'
let d = React.DOM

function Sort() {
  return d.div({},
    'Sort cards by: ',
    d.div({ className: 'connected-container' },
      ['cmc', 'color', 'type', 'rarity'].map(sort =>
        d.label({
          className: 'radio-label connected-component',
        }, d.input({
          checked: sort === App.state.sort,
          className: 'radio-input',
          name: 'sort-order',
          onChange: e => App.save('sort', e.currentTarget.value),
          type: 'radio',
          value: sort,
        }, sort)))))
}

export default React.createClass({
  render() {
    return d.div({ className: 'game-settings' },
      d.fieldset({ className: 'fieldset' },
        d.legend({ className: 'legend game-legend' }, 'Settings'),
        d.span({},
          LBox('chat', 'Show chat'),
          this.Side(),
          LBox('beep', 'Beep on new packs'),
          LBox('cols', 'Column view'),
          Sort())))
  },
  SideCB(e) {
    let side = e.target.checked
    App.save('side', side)
    App.emit('side')
  },
  Side() {
    return d.div({},
      d.label({},
        d.input({
          checked: App.state.side,
          onChange: this.SideCB,
          type: 'checkbox'
        }),
        ' Add picks to sideboard'))
  },
})
