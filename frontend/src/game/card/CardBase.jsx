import React, {Component} from "react";
import PropTypes from "prop-types";

import {getCardSrc, getFallbackSrc} from "../../cardimage";

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
    const { showFlipped, card } = this.props
    // if initial view is "unflipped" + we want default view (relative to that)
    if (!showFlipped && side === DEFAULT) return getCardSrc(card);

    // if initial view is "flipped" + we want the flipped view (relative to that)
    if (showFlipped && side === FLIP) return getCardSrc(card);

    // WARNING - this doesn't do anything for kamigawa "flip" cards
    // the image change there is handled by the class "-rotate"
    return getCardSrc({
      ...card,
      isBack: card.flippedIsBack,
      number: card.flippedNumber || card.number,
    });
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
    const { url, isFlipped } = this.state;
    const { setCode, number, flippedNumber } = this.props.card;

    const num = (this.props.showFlipped === isFlipped) ? number : flippedNumber;
    const fallbackUrl = getFallbackSrc(setCode, num);

    if (url === fallbackUrl || fallbackUrl === null) {
      this.setState({ imageErrored: true });
      return;
    }

    this.setState({ url: fallbackUrl });
  }

  render () {
    if (this.state.cardSize !== App.state.cardSize || this.state.cardLang !== App.state.cardLang) {
      this.setState({
        cardLang: App.state.cardLang,
        cardSize: App.state.cardSize,
        url: this.getCardImage(DEFAULT)
      })
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
            <CardBaseImage name={card.name} src={this.state.url} handleError={this.onImageError.bind(this)} />
        }
        {this.props.children}
      </div>
    )
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

const CardBaseText = ({ name, manaCost, type, rarity, power, toughness, text, loyalty, colors }) => {
  return (
    <div className="CardBaseText" style={{ background: backgroundStyle(colors) }}>
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
          text && (
            <div className="text">
              { 
                text
                  .split('\n')
                  .map((line, i) => {
                    const bracketSection = line.match(/\([^\)]+\)/g)
                    if (!bracketSection) return line

                    const [before, after] = line.split(bracketSection[0])
                    return [
                      before,
                      <span className='bracket' key={i}>{bracketSection[0]}</span>,
                      after
                    ]
                  })
                  .map((line, i) => <div className='line' key={i}>{line}</div>)
              }
            </div>
          )
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
}
function backgroundStyle (colors) {
  if (!colors || !colors.length) return 'var(--colorless)'

  const output = colors.map(c => `var(--${c})`).join(', ')
  if (colors.length === 1) return output
  else return `linear-gradient(to right, ${output})`
}



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
