import React, {Component} from "react";
import PropTypes from "prop-types";

import _ from "utils/utils";
import App from "../app";
import {getSortedZone, getZoneDisplayName, getCardSrc, getFallbackSrc} from "../cards";
import {Spaced} from "../utils";
import {ZONE_PACK} from "../gamestate";

const Grid = ({zones}) => (
  <div>
    {zones.map(zone)}
  </div>
);

Grid.propTypes = {
  zones: PropTypes.array.isRequired
};

const zone = (zoneName, index) => {
  const zone = getSortedZone(zoneName);
  const zoneDisplayName = getZoneDisplayName(zoneName);
  const values = _.values(zone);
  const cards = _.flat(values);

  const zoneTitle = zoneDisplayName + (zoneName === ZONE_PACK ? " " + App.state.round : "");
  const zoneHelper = App.state.didGameStart
    ? zoneName === ZONE_PACK
      ? `Pick ${App.state.pickNumber} / ${App.state.packSize}`
      : cards.length
    : 0;

  return (
    <div className='zone' key={index}>
      <h1>
        <Spaced elements={[zoneTitle, zoneHelper]}/>
      </h1>
      {cards.map((card, i) =>
        <Card key={i+zoneName+card.name+card.foil} card={card} zoneName={zoneName} />
      )}
      {cards.length === 0 && zoneName === ZONE_PACK &&
        <h2 className='waiting'>Waiting for the next pack...</h2>
      }
    </div>
  );
};
class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDoubleFaced: false,
      url: getCardSrc(this.props.card),
      isFlipped: false
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    if (this.props.card.isDoubleFaced) {
      this.setState({
        mouseEntered: true,
        url: getCardSrc({
          ...this.props.card,
          isBack: this.props.card.flippedIsBack,
          number: this.props.card.flippedNumber,
        }),
        flipped: this.props.card.layout === "flip"
      });
    }
  }

  onMouseLeave() {
    if (this.props.card.isDoubleFaced) {
      this.setState({
        url: getCardSrc(this.props.card),
        flipped: false,
        mouseEntered: false
      });
    }
  }

  render() {
    const {card, zoneName} = this.props;
    const isAutopickable = zoneName === ZONE_PACK && card.isAutopick;

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
        onClick={App._emit("click", zoneName, card)}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}>
        <CardImage mouseEntered={this.state.mouseEntered} imgUrl={this.state.url} {...card}/>
      </span>
    );
  }
}

Card.propTypes = {
  card: PropTypes.object.isRequired,
  zoneName: PropTypes.string.isRequired
};

const CardImage = ({ mouseEntered, url, flippedIsBack, flippedNumber, imgUrl, scryfallId = "", name, manaCost, type = "", rarity = "", power = "", toughness = "", text = "", loyalty= "", setCode = "", number = "" }) => (
  App.state.cardSize === "text"
    ? <div style={{display: "block"}}>
      <p><strong>{name}</strong> {manaCost}</p>
      <p>{type} | {rarity}</p>
      {text && <p>{text}</p>}
      {power && toughness && <p>{power}/{toughness}</p>}
      {loyalty && <p>{loyalty}</p>}
    </div>
    : <img title={name}
      onError= {getFallbackSrc({url: imgUrl, scryfallId, setCode, number})}
      src={!mouseEntered
        ? getCardSrc({ scryfallId, setCode, url, number })
        : getCardSrc({ scryfallId, setCode, url, number: flippedNumber, isBack: flippedIsBack })
      }
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
  loyalty:  PropTypes.string,
  setCode: PropTypes.string,
  number: PropTypes.string,
  scryfallId: PropTypes.string,
  mouseEntered: PropTypes.bool,
  url: PropTypes.string,
  flippedIsBack: PropTypes.bool,
  flippedNumber: PropTypes.string,
};

export default Grid;
