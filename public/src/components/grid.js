import _ from '../../lib/utils'
import App from '../app'
import {getZone} from '../cards'
import {Spaced} from './spacer'
let d = React.DOM

export default React.createClass({
  render() {
    let zones = this.props.zones.map(zone)
    return d.div({}, zones)
  }
})

function zone(zoneName) {
  let zone = getZone(zoneName)
  let values = _.values(zone)
  let cards = _.flat(values)

  let isAutopickable = card => zoneName === 'pack' && card.isAutopick

  let items = cards.map(card =>
      React.createElement(Card, {
        card: card,
        isAutopick: isAutopickable(card),
        zoneName:zoneName
      })
    )
  return d.div({ className: 'zone' },
    d.h1({}, Spaced(
      d.span({}, `${zoneName}${zoneName === 'pack' ? " " + App.state.round : ""}`),
      d.span({}, `${zoneName === 'pack' ? 'Pick ' : ''}${cards.length} ${zoneName === 'pack' ? ' /  ' + cards[0].packSize.toString() : ""}`))),
    items)
}

const Card = React.createClass({
  getInitialState() {
    return {
      card: this.props.card,
      url: this.props.card.url
    }
  },
  onMouseEnter() {
    if(this.state.card.isDoubleFaced) {
      this.setState({
        url: this.state.card.flippedCardURL
      })
    }
  },
  onMouseLeave() {
    this.setState({
      url: this.state.card.url
    })
  },
  render() {
    if(this.props.card != this.state.card) {
      this.state.card = this.props.card;
      this.state.url = this.props.card.url
    }
    return d.span({
      onMouseOver: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      className: `card ${this.props.isAutopick ? 'autopick-card ' : ''} card ${this.props.card.foil ? 'foil-card ' : ''}`,
      title: this.props.isAutopick ? 'This card will be automatically picked if your time expires.' : '',
      onClick: App._emit('click', this.props.zoneName, this.state.card.name),
    },
    d.img({
      src: this.state.url,
      alt: this.state.card.name,
    })
  )
  }
})
