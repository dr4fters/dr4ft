import React, {Component} from "react";
import PropTypes from "prop-types";

import {getCardSrc, getFallbackSrc} from "../../cardimage";

import App from "../../app";
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
    // at the moment for Text view, you can't see both sides of a card on hover
    // as the same card is passed into CardBaseText regardless mouseEntered

    if (!this.props.card.isDoubleFaced) return (
      <div className={`CardBase ${card.foil ? "-foil " : ""}`}>
        <CardBaseText {...card}/>
        {
          App.state.cardSize !== "text" &&
            <CardBaseImage mouseEntered={this.state.mouseEntered} imgUrl={this.state.url} {...card}/>
        }

        {this.props.children}
      </div>
    )

    return (
      <div 
        className={`CardBase ${card.foil ? "-foil " : ""} ${this.state.isFlipped ? "-flipped " : ""}`}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <CardBaseText {...card} />
        {
          App.state.cardSize !== "text" &&
            <CardBaseImage mouseEntered={this.state.mouseEntered} imgUrl={this.state.url} {...card}/>
        }
        {this.props.children}
      </div>
    );
  }
}

CardBase.propTypes = {
  card: PropTypes.object.isRequired,
};

const CardBaseImage = ({ mouseEntered, url, foil, flippedIsBack, flippedNumber, identifiers, name, setCode = "", number = "" }) => (
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
