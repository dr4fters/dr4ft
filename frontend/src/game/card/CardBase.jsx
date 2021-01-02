import React, {Component} from "react";
import PropTypes from "prop-types";

import {getCardSrc, getFallbackSrc} from "../../cardimage";

import App from "../../app";
import {ZONE_PACK} from "../../zones";
import "./CardBase.scss"

export default class CardBase extends Component {
  constructor (props) {
    super(props);

    this.state = {
      mouseEntered: false,
      isFlipped: false,
      url: getCardSrc(this.props.card),
    };

    if (this.props.card.isDoubleFaced) {
      this.onMouseEnter = this.onMouseEnter.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);
    }
  }

  onMouseEnter () {
    this.setState({
      mouseEntered: true,
      isFlipped: this.props.card.layout === "flip",
      url: getCardSrc({
        ...this.props.card,
        isBack: this.props.card.flippedIsBack,
        number: this.props.card.flippedNumber,
      })
    });
  }

  onMouseLeave () {
    this.setState({
      mouseEntered: false,
      isFlipped: false,
      url: getCardSrc(this.props.card),
    });
  }

  render () {
    const { card } = this.props;

    if (!this.props.card.isDoubleFacedz) return (
      <div className={`CardBase ${card.foil ? "-foil " : ""}`}>
        <CardBaseText {...card}/>
        {
          App.state.cardSize !== "text" &&
            <CardBaseImage mouseEntered={this.state.mouseEntered} imgUrl={this.state.url} {...card}/>
        }
      </div>
    )

    return (
      <div className={`CardBase ${card.foil ? "-foil " : ""} ${this.state.isFlipped ? "-flipped " : ""}`}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <CardBaseText {...card}/>
        {
          App.state.cardSize !== "text" &&
            <CardBaseImage mouseEntered={this.state.mouseEntered} imgUrl={this.state.url} {...card}/>
        }
      </div>
    );
  }
}

CardBase.propTypes = {
  card: PropTypes.object.isRequired,
};

const CardBaseImage = ({ mouseEntered, url, flippedIsBack, flippedNumber, identifiers, name, manaCost, type = "", rarity = "", power = "", toughness = "", text = "", loyalty= "", setCode = "", number = "" }) => (
  <div className="CardBaseImage">
    <img
      title={name}
      onError={getFallbackSrc({ setCode, number })}
      src={
        !mouseEntered
          ? getCardSrc({ identifiers, setCode, url, number })
          : getCardSrc({ identifiers, setCode, url, number: flippedNumber, isBack: flippedIsBack })
      }
    />
  </div>
);

CardBaseImage.propTypes = {
  imgUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  manaCost: PropTypes.string.isRequired,
  rarity: PropTypes.string,
  power: PropTypes.string,
  toughness: PropTypes.string,
  text: PropTypes.string,
  loyalty: PropTypes.string,
  setCode: PropTypes.string,
  number: PropTypes.string,
  identifiers: PropTypes.object,
  mouseEntered: PropTypes.bool,
  url: PropTypes.string,
  flippedIsBack: PropTypes.bool,
  flippedNumber: PropTypes.string
};

// mixmix: come back and style
const CardBaseText = ({ name, manaCost, type = "", rarity = "", power = "", toughness = "", text = "", loyalty= "" }) => (
  <div className="CardBaseText" style={{display: "block"}}>
    <p><strong>{name}</strong> {manaCost}</p>
    <p>{type} | {rarity}</p>
    {text && <p>{text}</p>}
    {power && toughness && <p>{power}/{toughness}</p>}
    {loyalty && <p>{loyalty}</p>}
  </div>
);

CardBaseText.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  manaCost: PropTypes.string.isRequired,
  rarity: PropTypes.string,
  power: PropTypes.string,
  toughness: PropTypes.string,
  text: PropTypes.string,
  loyalty: PropTypes.string
};
