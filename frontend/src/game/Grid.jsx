import React, {Component} from "react";
import PropTypes from "prop-types";

import _ from "utils/utils";
import App from "../app";
import Spaced from "../components/Spaced";
import {ZONE_PACK, getZoneDisplayName} from "../zones";
import Card from "./Card.jsx"

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

export default Grid;
