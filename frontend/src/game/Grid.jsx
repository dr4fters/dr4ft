import React from "react";
import PropTypes from "prop-types";

import _ from "utils/utils";
import App from "../app";
import Spaced from "../components/Spaced";
import {ZONE_PACK, getZoneDisplayName} from "../zones";
import CardDefault from "./card/CardDefault.jsx"
import CardGlimpse from "./card/CardGlimpse.jsx"
import "./Grid.scss"

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
  const elementsContent = isPackZone ? [zoneTitle, zoneDetails, selectUpTo, burnUpTo] : [zoneTitle, zoneDetails];

  return (
    <div className='Grid zone' key={index}>
      <h1>
        <Spaced elements={elementsContent} />
      </h1>

      <div className="cards">
        {cards.map((card, i) =>
          isPackZone && App.state.game.burnsPerPack > 0
            ? <CardGlimpse key={i+zoneName+card.name+card.foil} card={card} zoneName={zoneName} />
            : <CardDefault key={i+zoneName+card.name+card.foil} card={card} zoneName={zoneName} />
        )}
      </div>

      {cards.length === 0 && zoneName === ZONE_PACK &&
        <h2 className='waiting'>Waiting for the next pack...</h2>
      }
    </div>
  );
};

export default Grid;
