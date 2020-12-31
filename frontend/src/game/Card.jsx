import React, {Component} from "react";
import PropTypes from "prop-types";

import _ from "utils/utils";
import App from "../app";
import {getCardSrc, getFallbackSrc} from "../cardimage";
import {ZONE_PACK} from "../zones";
import "./Card.scss"

export default class Card extends Component {
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
    const isAutopickable = zoneName === ZONE_PACK && App.state.gameState.isAutopick(card.cardId);
    const isAutoremovableAutopick = App.state.gameState.isAutoremovableAutopick(card.cardId, App.state.picksPerPack);
    const className = `Card
    ${card.foil ? "-foil " : ""}
    ${isAutopickable ? "-autopick" : ""}
    ${isAutoremovableAutopick ? "-autoremovable-pick " : ""}
    ${this.state.flipped ? "-flipped " : ""}`;

    const title = isAutopickable
      ? "This card will be automatically picked if your time expires."
      : "";
    return (
      <span className={className}
        title={title}
        onClick={App._emit("click", zoneName, card)}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}>

        {
          App.state.cardSize === "text"
            ? <CardText mouseEntered={this.state.mouseEntered} imgUrl={this.state.url} {...card}/>
            : <CardImage mouseEntered={this.state.mouseEntered} imgUrl={this.state.url} {...card}/>
        }
      </span>
    );
  }
}

Card.propTypes = {
  card: PropTypes.object.isRequired,
  zoneName: PropTypes.string.isRequired
};


const CardText = ({ name, manaCost, type = "", rarity = "", power = "", toughness = "", text = "", loyalty= "" }) => (
  <div style={{display: "block"}}>
    <p><strong>{name}</strong> {manaCost}</p>
    <p>{type} | {rarity}</p>
    {text && <p>{text}</p>}
    {power && toughness && <p>{power}/{toughness}</p>}
    {loyalty && <p>{loyalty}</p>}
  </div>
);

CardText.propTypes = {
  imgUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  manaCost: PropTypes.string.isRequired,
  rarity: PropTypes.string,
  power:  PropTypes.string,
  toughness:  PropTypes.string,
  text:  PropTypes.string,
  loyalty:  PropTypes.string,
};

const CardImage = ({ mouseEntered, url, flippedIsBack, flippedNumber, identifiers, name, manaCost, type = "", rarity = "", power = "", toughness = "", text = "", loyalty= "", setCode = "", number = "" }) => (
  App.state.cardSize === "text"
    ? <div style={{display: "block"}}>
      <p><strong>{name}</strong> {manaCost}</p>
      <p>{type} | {rarity}</p>
      {text && <p>{text}</p>}
      {power && toughness && <p>{power}/{toughness}</p>}
      {loyalty && <p>{loyalty}</p>}
    </div>
    : <img title={name}
      onError= {getFallbackSrc({ setCode, number })}
      src={!mouseEntered
        ? getCardSrc({ identifiers, setCode, url, number })
        : getCardSrc({ identifiers, setCode, url, number: flippedNumber, isBack: flippedIsBack })
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
  identifiers: PropTypes.object,
  mouseEntered: PropTypes.bool,
  url: PropTypes.string,
  flippedIsBack: PropTypes.bool,
  flippedNumber: PropTypes.string,
};
