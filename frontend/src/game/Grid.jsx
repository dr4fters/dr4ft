import React, {Component} from "react";
import PropTypes from "prop-types";

import _ from "utils/utils";
import App from "../app";
import {getCardSrc, getFallbackSrc} from "../cardimage";
import Spaced from "../components/Spaced";
import {ZONE_PACK, getZoneDisplayName} from "../zones";

const Grid = ({zones}) => (
  <div>
    {zones.map(zone)}
  </div>
);

Grid.propTypes = {
  zones: PropTypes.array.isRequired
};

const getZoneDetails = (appState, zoneName, cards) => {
  if (!appState.didGameStart) {
    return 0;
  }

  if (zoneName === ZONE_PACK) {
    if (appState.isDecadentDraft) {
      // Only 1 pick in decadent draft.
      return `Pick 1 / 1`;
    } else {
      let turns = Math.ceil(appState.packSize / appState.picksPerPack  );
      return `Pick ${appState.pickNumber} / ${turns}`
    }
  } else {
    return cards.length;
  }
}

const zone = (zoneName, index) => {
  const zone = App.getSortedZone(zoneName);
  const zoneDisplayName = getZoneDisplayName(zoneName);
  const values = _.values(zone);
  const cards = _.flat(values);
  const isPackZone = zoneName === ZONE_PACK;

  const zoneTitle = zoneDisplayName + (isPackZone ? " " + App.state.round : "");
  const zoneDetails = getZoneDetails(App.state, zoneName, cards);
  const remainingCardsToSelect = Math.min(App.state.picksPerPack, cards.length);
  const remainingCardsToBurn = Math.min(App.state.game.burnsPerPack, cards.length);
  const selectUpTo = 'select ' + remainingCardsToSelect + (remainingCardsToSelect>1? ' cards': ' card');
  const burnUpTo = 'burn ' + remainingCardsToBurn + (remainingCardsToBurn>1? ' cards': ' card');
  const elementsContent = isPackZone ? [zoneTitle, zoneDetails, selectUpTo, burnUpTo]:[zoneTitle, zoneDetails];
  return (
    <div className='zone' key={index}>
      <h1>
        <Spaced elements={elementsContent}/>
      </h1>
      {cards.map((card, i) =>
        isPackZone && App.state.game.burnsPerPack > 0
        ? <PackCardContextualMenuDecorator key={i+zoneName+card.name+card.foil} card={card} zoneName={zoneName} />
        : <Card key={i+zoneName+card.name+card.foil} card={card} zoneName={zoneName} />
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
    const isAutopickable = zoneName === ZONE_PACK && App.state.gameState.isAutopick(card.cardId);
    const isAutoremovableAutopick = App.state.gameState.isAutoremovableAutopick(card.cardId, App.state.picksPerPack);
    const className = `card
    ${card.foil ? "foil-card " : ""}
    ${isAutopickable ? "autopick-card " : ""}
    ${isAutoremovableAutopick ? "autoremovable-pick " : ""}
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


// TODO: find better name, move to own file mb
class PackCardContextualMenuDecorator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false,
    };
    this.onClick = this.onClick.bind(this);
    this.onClickPickCard = this.onClickPickCard.bind(this);
    this.onClickBurnCard = this.onClickBurnCard.bind(this);
  }

  onClick(e) {
    if (!this.state.isClicked) {
      e.stopPropagation(); //TOOD: Use specific Card with no onClick and change opacity of the card on click
      this.setState({
        isClicked: true,
      });
    }
  }

  onClickPickCard(e) {
    e.stopPropagation();
    App.emit("click", this.props.zoneName, this.props.card);
    this.setState({
      isClicked: false,
    });
  }

  onClickBurnCard(e) {
    e.stopPropagation();
    App.emit("burn", this.props.card);
    this.setState({
      isClicked: false,
    });
  }
  

  render() {
    const {zoneName, card} = this.props;
    return (
      <span style={{ position:"relative", height:"340px", width: "240px", display:"inline-flex" }} onClickCapture={this.onClick}>
        <Card card={card} zoneName={zoneName} />
        {this.state.isClicked && 
        <span style={{position:"absolute" }} >
          <div
            style={{ textAlign:"center", alignContent:"center", fontSize: 20, height:170, width:240, backgroundColor: "green" }} 
            id="pick"
            onClick={this.onClickPickCard}
          >
            Pick
          </div>
          <div
            onClick={this.onClickBurnCard}
            style={{textAlign: "center", fontSize: 20, alignContent:"center", fontSize: 20, height:170, width:240, backgroundColor: "red"}} 
            id="burn">
              Burn
          </div>
        </span>}
      </span>
    );
  }
}

PackCardContextualMenuDecorator.propTypes = {
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
