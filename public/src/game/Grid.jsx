import React, {Component} from "react";
import PropTypes from "prop-types";

import _ from "utils/utils";
import App from "../app";
import {getZone, getZoneDisplayName} from "../cards";
import {Spaced} from "../utils";

const Grid = ({zones}) => (
  <div>
    {zones.map(zone)}
  </div>
);

Grid.propTypes = {
  zones: PropTypes.array.isRequired
};

const zone = (zoneName, index) => {
  const zone = getZone(zoneName);
  const zoneDisplayName = getZoneDisplayName(zoneName);
  const values = _.values(zone);
  const cards = _.flat(values);

  const zoneTitle = zoneDisplayName + (zoneName === "pack" ? " " + App.state.round : "");
  const zoneHelper = App.state.didGameStart
    ? zoneName === "pack"
      ? `Pick ${App.state.pickNumber} / ${cards[0].packSize}`
      : cards.length
    : 0;

  return (
    <div className='zone' key={index}>
      <h1>
        <Spaced elements={[zoneTitle, zoneHelper]}/>
      </h1>
      {cards.map((card, i) => <Card key={i+card.name} card={card} zoneName={zoneName} />)}
    </div>
  );
};
class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.card.url,
      isFlipped: false
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    if(this.props.card.isDoubleFaced) {
      this.setState({
        url: this.props.card.flippedCardURL,
        flipped: this.props.card.layout === "flip"
      });
    }
  }

  onMouseLeave() {
    if(this.props.card.isDoubleFaced) {
      this.setState({
        url: this.props.card.url,
        flipped: false
      });
    }
  }

  render() {
    const {card, zoneName} = this.props;
    const isAutopickable = zoneName === "pack" && card.isAutopick;

    const className = `card
    ${isAutopickable ? "autopick-card " : ""}
    ${card.foil ? "foil-card " : ""}
    ${this.state.flipped ? "flipped " : ""}`;

    const title
    = isAutopickable
      ? "This card will be automatically picked if your time expires."
      : "";
    return (
      <span className={className}
        title={title}
        onClick={App._emit("click", zoneName, card.name)}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}>
        <img src={`${this.state.url}&version=${App.state.cardSize}`} alt={card.name}/>
      </span>
    );
  }
}

Card.propTypes = {
  card: PropTypes.object.isRequired,
  zoneName: PropTypes.string.isRequired
};
export default Grid;
