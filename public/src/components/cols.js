import App from '../app'
import {getZone} from '../cards'
let d = React.DOM

export default React.createClass({
  getInitialState() {
    return {
      className: 'right'
    }
  },
  render() {
    let zones = this.props.zones.map(this.zone)
    let img = this.state.url && d.img({
      className: this.state.className,
      id: 'img',
      onMouseEnter: this.enter.bind(this, this.state.url),
      src: this.state.url
    })
    return d.div({}, zones, img)
  },

  enter(url, e) {
    let {offsetLeft} = e.target
    let {clientWidth} = document.documentElement

    let imgWidth = 240
    let colWidth = 180

    let className = offsetLeft + colWidth > clientWidth - imgWidth
      ? 'left'
      : 'right'

    this.setState({ url, className })
  },
  zone(zoneName) {
    let zone = getZone(zoneName)

    let sum = 0
    let cols = []
    for (let key in zone) {
      let items = zone[key].map(card =>
        d.div({
          onClick: App._emit('click', zoneName, card.name),
          onMouseOver: this.enter.bind(this, card.url)
        }, d.img({ src: card.url, alt: card.name }))
      )

      sum += items.length
      cols.push(d.div({ className: 'col' },
        d.div({}, `${key} - ${items.length} cards`),
        items))
    }

    return d.div({ className: 'zone' },
      d.h1({}, `${zoneName} ${sum}`),
      cols)
  }
})
