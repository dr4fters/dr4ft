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
    const img = this.state.card && React.createElement(ImageHelper, {
      card: this.state.card,   
      className: this.state.className 
    })
    return d.div({}, zones, img)
  },

  enter(card, e) {
    let {offsetLeft} = e.target
    let {clientWidth} = document.documentElement

    let imgWidth = 240
    let colWidth = 180

    let className = offsetLeft + colWidth > clientWidth - imgWidth
      ? 'left'
      : 'right'

    this.setState({ card, className })
  },
  zone(zoneName) {
    let zone = getZone(zoneName)

    let sum = 0
    let cols = []
    for (let key in zone) {
      let items = zone[key].map(card =>
        d.div({
          onClick: App._emit('click', zoneName, card.name),
          onMouseOver: this.enter.bind(this, card),
          onMouseLeave: () => { this.setState({ card: false })}
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

const ImageHelper = React.createClass({
  render() {
    if(this.props.card.isDoubleFaced) {
      return d.div({
        className: this.props.className,
        id: 'doubleimg',
      },
      d.img({
        className: "card",
        src:this.props.card.url,
      }),
      d.img({
        className: "card",
        src:this.props.card.flippedCardURL,
      })
      )
    }

    return d.img({
      className: this.props.className,
      id: 'img',
      src: this.props.card.url,
    })
  }
})
