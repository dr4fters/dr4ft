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
        <CardImage imgUrl={this.state.url} {...card}/>
      </span>
    );
  }
}

Card.propTypes = {
  card: PropTypes.object.isRequired,
  zoneName: PropTypes.string.isRequired
};

const CardImage = ({ imgUrl, name, manaCost, type = "", rarity = "", power = "", toughness = "", text = "", loyalty= "" }) => (
  App.state.cardSize === "text"
    ? <div style={{display: "block"}}>
      <p>{name} {manaCost}</p>
      <p>{type} | {rarity}</p>
      {text && <p>{text}</p>}
      {power && toughness && <p>{power}/{toughness}</p>}
      {loyalty && <p>{loyalty}</p>}
    </div>
    : <img title={name}
      src={`${imgUrl}&version=${App.state.cardSize}`}
      alt={`${name} ${manaCost}
      ${type} | ${rarity} ${text}
      ${power} ${toughness} ${loyalty}`}
    />
);

CardImage.propTypes = {
  imgUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  manaCost: PropTypes.string.isRequired,
  rarity: PropTypes.string,
  power:  PropTypes.string,
  toughness:  PropTypes.string,
  text:  PropTypes.string,
  loyalty:  PropTypes.string
};

export default Grid;
