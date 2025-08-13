import React, {Component} from "react";
import PropTypes from "prop-types";

import App from "../../app";
import "./CardBase.scss";

const DEFAULT = 0;
const FLIP = 1;

export default class CardBase extends Component {
  constructor (props) {
    super(props);

    // this.getCardImage = this.getCardImage.bind(this);
    // this.onImageError = this.onImageError.bind(this);

    if (props.card.isDoubleFaced) {
      this.onMouseEnter = this.onMouseEnter.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    this.state = {
      cardLang: App.state.cardLang,
      cardSize: App.state.cardSize,
      url: this.getCardImage(DEFAULT),
      isFlipped: false, // this is relative to this.props.showFlipped
      imageErrored: false
    };
  }

  getCardImage (side) {
    const { card } = this.props;
    if (side === FLIP) return card.defaultImagePath;

    return card.defaultImagePath;
  }

  onMouseEnter () {
    this.setState({ isFlipped: !this.state.isFlipped });
    this.setState({ url: this.getCardImage(FLIP) });
  }

  onMouseLeave () {
    this.setState({ isFlipped: !this.state.isFlipped });
    this.setState({ url: this.getCardImage(DEFAULT) });
  }

  onImageError () {
    this.setState({ imageErrored: true });
  }

  render () {
    if (this.state.cardSize !== App.state.cardSize || this.state.cardLang !== App.state.cardLang) {
      this.setState({
        cardLang: App.state.cardLang,
        cardSize: App.state.cardSize
      });
    }

    const { card } = this.props;
    // at the moment for Text view, you can't see both sides of a card on hover
    // as the same card is passed into CardBaseText regardless mouseEntered

    const eventListeners = card.isDoubleFaced
      ? {
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave
      }
      : {}; // don't add unecessary event listeners!

    const _class = [
      "CardBase",
      card.foil ? "-foil" : "",
      card.layout === "flip" && (
        (this.props.showFlipped || this.state.isFlipped) &&
        (this.props.showFlipped != this.state.isFlipped)
      ) ? "-rotate" : ""
    ].join(" ");

    return (
      <div className={_class} {...eventListeners} >
        <CardBaseText {...card} />
        {
          App.state.cardSize !== "text" && !this.state.imageErrored &&
            <CardBaseImage name={card.name} src={this.getCardImage(DEFAULT)} handleError={this.onImageError.bind(this)} />
        }
        {this.props.children}
      </div>
    );
  }
}

CardBase.propTypes = {
  card: PropTypes.object.isRequired,
  showFlipped: PropTypes.bool // whether the card should be flipped by default
};

const CardBaseImage = ({ src, handleError, name }) => (
  <div className="CardBaseImage">
    <img
      title={name}
      className='loading'

      onError={handleError}
      onLoad={ev => ev.target.classList.remove("loading")}

      src={src}
    />
  </div>
);

CardBaseImage.propTypes = {
  src: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleError: PropTypes.func
};

const CardBaseText = ({ cardName, title, rarity, aspects }) => {
  return (
    <div className="CardBaseText" style={{ background: backgroundStyle(aspects) }}>
      <div className="header">
        <div className="name">{cardName} {title}</div>
      </div>

      <div className="sub-header">
        <div className="rarity">{rarity}</div>
      </div>
    </div>
  );
};
function backgroundStyle (colors) {
  if (!colors || !colors.length) return "var(--colorless)";

  const output = colors.map(c => `var(--${c})`).join(", ");
  if (colors.length === 1) return output;
  else return `linear-gradient(to right, ${output})`;
}



CardBaseText.propTypes = {
  cardName: PropTypes.string.isRequired,
  title: PropTypes.string,
  rarity: PropTypes.number,
  aspects: PropTypes.array
};
