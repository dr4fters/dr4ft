import React, {Component} from "react"

import _ from "Lib/utils"
import App from 'Src/app'
import {getZone} from 'Src/cards'
import {Spaced} from 'Src/utils'

const Grid = ({zones}) => (
  <div>
    {zones.map(zone)}
  </div>
)

const zone = (zoneName) => {
  const zone = getZone(zoneName)
  const values = _.values(zone)
  const cards = _.flat(values)

  const zoneTitle = zoneName + (zoneName === 'pack' ? " " + App.state.round : "");
  const zoneHelper
  = App.state.didGameStart
  ? zoneName === 'pack'
    ? `Pick ${App.state.cards - cards.length} / ${cards[0].packSize.toString()} ${cards.length === 1 ? 'card' : 'cards' }`
    : cards.length
  : 0

  return (
    <div className='zone' key={_.uid()}>
      <h1>
        <Spaced elements={[zoneTitle, zoneHelper]}/>
      </h1>
      {cards.map(card => <Card card={card} zoneName={zoneName} />)}
    </div>
  )
}

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.card.url
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    if(this.props.card.isDoubleFaced) {
      this.setState({
        url: this.props.card.flippedCardURL
      });
    }
  }

  onMouseLeave() {
    if(this.props.card.isDoubleFaced) {
      this.setState({
        url: this.props.card.url
      });
    }
  }

  render() {
    const {card, zoneName} = this.props;
    const isAutopickable = zoneName === 'pack' && card.isAutopick;

    const className =
    `card ${isAutopickable ? 'autopick-card ' : ''}
    card ${card.foil ? 'foil-card ' : ''}`;

    const title
    = isAutopickable
      ? 'This card will be automatically picked if your time expires.'
      : '';

    return (
      <span key={_.uid()}
        className={className}
        title={title}
        onClick={App._emit('click', zoneName, card.name)}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}>
        <img src={this.state.url} alt={card.name}/>
      </span>
    );
  }
}

export default Grid
