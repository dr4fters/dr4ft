import React, { Component } from "react";
import PropTypes from "prop-types";

import App from "../../app";
import "./CardBase.scss";
import SelectionState from "./SelectionState.jsx";
import { ZONE_PACK } from "../../zones";

const DEFAULT = 0;
const FLIP = 1;

export default class CardBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardLang: App.state.cardLang,
      cardSize: App.state.cardSize,
      url: this.getCardImage(DEFAULT),
      isFlipped: false, // this is relative to this.props.showFlipped
      imageErrored: false,
    };
  }

  getCardImage(side) {
    const { card } = this.props;
    if (side === FLIP && card.type === "Leader")
      return card.backImagePath || card.defaultImagePath;

    return card.defaultImagePath;
  }

  flip(event) {
    event.stopPropagation();
    this.setState({ isFlipped: !this.state.isFlipped });
    this.setState({ url: this.getCardImage(this.state.isFlipped? FLIP : DEFAULT) });
  }

  onImageError() {
    this.setState({ imageErrored: true });
  }

  handleCardSelection(card, swuCardId) {
    if (card.type === "Leader") {
      App.updateSelectedLeader(swuCardId);
    }

    if (card.type === "Base") {
      App.updateSelectedBase(swuCardId);
    }
  }

  render() {
    if (
      this.state.cardSize !== App.state.cardSize ||
      this.state.cardLang !== App.state.cardLang
    ) {
      this.setState({
        cardLang: App.state.cardLang,
        cardSize: App.state.cardSize,
      });
    }

    const { card } = this.props;

    const _class = [
      "CardBase",
      card.foil ? "-foil" : "",
      card.layout === "flip" &&
      (card.type === "Leader" || this.state.isFlipped) &&
      (card.type === "Leader") != this.state.isFlipped
        ? "-rotate"
        : "",
      card.type === "Base"? "-base":""
    ].join(" ");

    const rotated = (card.type === "Leader" && !this.state.isFlipped) || card.type === "Base";
    const base = card.type === "Base";
    const isPick = this.props.zoneName === ZONE_PACK && App.state.gameState.isPick(card.cardId);
    const swuCardId = `${card.defaultExpansionAbbreviation}_${card.defaultCardNumber}`;
    const isLeaderSelected = card.type === "Leader" && swuCardId === App.state.selectedLeader;
    const isBaseSelected = card.type === "Base" && swuCardId === App.state.selectedBase;

    return (
      <div className={_class} onClick={() => this.handleCardSelection(card, swuCardId)}>
        <CardBaseText {...card} rotated={rotated} base={base}/>
        {App.state.cardSize !== "text" && !this.state.imageErrored && (
          <CardBaseImage
            name={card.name}
            src={this.getCardImage(this.state.isFlipped ? FLIP : DEFAULT)}
            handleError={this.onImageError.bind(this)}
            rotated={rotated}
            base={base}
          />
        )}
        {this.props.children}

        {card.type==="Leader" &&
        <div className="flip-button">
          <button onClick={(e) => this.flip(e)}>
            <i className="icon ion-android-refresh" />
          </button>
        </div>
        }
        <SelectionState selection isPick={isLeaderSelected} card={card} isRotated={this.state.isFlipped}/>
        <SelectionState selection isPick={isBaseSelected} card={card} isRotated={this.state.isFlipped} base={base}/>
        <SelectionState isPick={isPick} card={card} isRotated={this.state.isFlipped}/>
      </div>
    );
  }
}

CardBase.propTypes = {
  card: PropTypes.object.isRequired,
  zoneName: PropTypes.string,
  showFlipped: PropTypes.bool, // whether the card should be flipped by default
};

const CardBaseImage = ({ src, handleError, name, rotated, base }) => (
  <div className={`CardBaseImage ${rotated ? "-rotated" : ""} ${base? "-base":""}`}>
    <img
      title={name}
      className="loading"
      onError={handleError}
      onLoad={(ev) => ev.target.classList.remove("loading")}
      src={src}
    />
  </div>
);

CardBaseImage.propTypes = {
  src: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleError: PropTypes.func,
  rotated: PropTypes.bool,
  base: PropTypes.bool
};

const CardBaseText = ({ cardName, title, rarity, aspects, rotated, base }) => {
  return (
    <div
      className={`CardBaseText ${rotated ? "-rotated" : ""} ${base? "-base":""}`}
      style={{ background: backgroundStyle(aspects) }}
    >
      <div className="header">
        <div className="name">
          {cardName} {title}
        </div>
      </div>

      <div className="sub-header">
        <div className="rarity">{rarity}</div>
      </div>
    </div>
  );
};
function backgroundStyle(colors) {
  if (!colors || !colors.length) return "var(--colorless)";

  const output = colors.map((c) => `var(--${c})`).join(", ");
  if (colors.length === 1) return output;
  else return `linear-gradient(to right, ${output})`;
}

CardBaseText.propTypes = {
  cardName: PropTypes.string.isRequired,
  title: PropTypes.string,
  rarity: PropTypes.number,
  aspects: PropTypes.array,
  rotated: PropTypes.bool,
  base: PropTypes.bool
};
