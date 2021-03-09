import React, {Component} from "react";
import PropTypes from "prop-types";

import {getCardSrc, getFallbackSrc} from "../../cardimage";

import App from "../../app";
import "./CardBase.scss"

export default class CardBase extends Component {
  constructor (props) {
    super(props);

    this.getCardImage = this.getCardImage.bind(this);
    this.onImageError = this.onImageError.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.state = {
      isFlipped: this.props.reversed,
      url: this.getCardImage("front"),
      imageErrored: false
    };
  }

  getCardImage (side) {
    let front = side !== "front";
    let isBack = (!front && !this.props.reversed) || (front && this.props.reversed);

    if (isBack) {
      return getCardSrc({
        ...this.props.card,
        isBack: this.props.card.flippedIsBack,
        number: this.props.card.flippedNumber || this.props.card.number,
      });
    }

    return getCardSrc(this.props.card);
  }  

  onMouseEnter () {
    if (!this.props.card.isDoubleFaced) return;

    this.setState({
      isFlipped: !this.props.reversed,
      url: this.getCardImage("back")
    });
  }

  onMouseLeave () {
    if (!this.props.card.isDoubleFaced) return;

    this.setState({
      isFlipped: this.props.reversed,
      url: this.getCardImage("front"),
    });
  }

  onImageError () {
    const { url, isFlipped } = this.state;
    const { setCode, number, flippedNumber } = this.props.card;
    const fallbackUrl = getFallbackSrc(setCode, isFlipped && flippedNumber ? flippedNumber : number);

    if (url !== fallbackUrl) {
        this.setState({ url: fallbackUrl });
        return;
    }

    this.setState({ imageErrored: true });
  }

  render () {
    const { card } = this.props;
    // at the moment for Text view, you can't see both sides of a card on hover
    // as the same card is passed into CardBaseText regardless mouseEntered
    return (
      <div 
        className={`CardBase ${card.foil ? "-foil " : ""} ${card.layout === "flip" && this.state.isFlipped ? "-flipped " : ""}`}
        onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}
      >
        <CardBaseText {...card} />
        {
          App.state.cardSize !== "text" && !this.state.imageErrored &&
          <CardBaseImage name={card.name} src={this.state.url} onError={this.onImageError} />
        }
        {this.props.children}
      </div>
    );
  }
}

CardBase.propTypes = {
  card: PropTypes.object.isRequired,
  reversed: PropTypes.bool // whether the card should be flipped by default 
};

const CardBaseImage = ({ src, onError, name }) => (
  <div className="CardBaseImage">
    <img
      title={name}
      onError={onError}
      src={src}
    />
  </div>
);

CardBaseImage.propTypes = {
  src: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onError: PropTypes.func
};

const CardBaseText = ({ name, manaCost, type = "", rarity = "", power = "", toughness = "", text = "", loyalty= "" }) => (
  <div className="CardBaseText" >
    <div className="header">
      <div className="name">{name}</div>
      <div className="cost">{manaCost}</div>
    </div>

    <div className="sub-header">
      <div className="type">{type}</div>
      <div className="rarity">{rarity}</div>
    </div>

    <div className="body">
      {
        text &&
          <div className="text">{text}</div>
      }
    </div>

    <div className="footer">
      {
        power && toughness &&
          <div className="power-toughness">{power}/{toughness}</div>
      }
      {
        loyalty &&
          <div className="loyalty">{loyalty}</div>
      }
    </div>
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
  loyalty: PropTypes.string,
  children: PropTypes.node
};
