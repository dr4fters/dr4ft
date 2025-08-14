import React from "react";
import PropTypes from "prop-types";

import _ from "utils/utils";
import { uniq } from "lodash";
import App from "../app";
import Spaced from "../components/Spaced";
import {ZONE_PACK, getZoneDisplayName} from "../zones";
import CardDefault from "./card/CardDefault.jsx";
import CardGlimpse from "./card/CardGlimpse.jsx";
import CardPlaceholder from "./card/CardPlaceholder.jsx";
import "./Grid.scss";

const Grid = ({zones, filter}) => (
  <div>
    {zones.map((name, i) => <Zone name={name} key={name + i} filter={filter} />)}
  </div>
);

Grid.propTypes = {
  zones: PropTypes.array.isRequired,
  filter: PropTypes.string
};

const getZoneDetails = (appState, zoneName, cards) => {
  if (!appState.didGameStart) {
    return 0;
  }

  if (zoneName === ZONE_PACK) {
    if (appState.isDecadentDraft) {
      // Only 1 pick in decadent draft.
      return "Pick 1 / 1";
    } else {
      let turns = Math.ceil(appState.packSize / appState.picksPerPack );
      return `Pick ${appState.pickNumber} / ${turns}`;
    }
  } else {
    return cards.length;
  }
};

const Zone = ({ name: zoneName, filter }) => {
  const zone = App.getSortedZone(zoneName, filter);
  const values = _.values(zone);
  const cards = _.flat(values);
  const cardTypes = uniq(cards, function(card) {
    return card.type;
  });

  const isPackZone = zoneName === ZONE_PACK;

  const { round, picksPerPack, gameState, packSize, pickNumber, game } = App.state;

  const remainingCardsToSelect = Math.min(picksPerPack, cards.length);
  const remainingCardsToBurn = Math.min(game.burnsPerPack, cards.length);
  const canConfirm = gameState.isSelectionReady(remainingCardsToSelect, remainingCardsToBurn);
  const cardsInNextPack = packSize - (pickNumber * (picksPerPack + game.burnsPerPack)) % packSize;
  const showPicksDetail = game.picksPerPack > 1 || game.burnsPerPack > 0;
  const showBurnsDetail = game.burnsPerPack > 0;
  return (
    <div className='Grid zone'>
      <div className='header'>
        <h1>
          <Spaced elements={[
            getZoneDisplayName(zoneName) + (isPackZone ? " " + round : ""),
            getZoneDetails(App.state, zoneName, cards)
          ]} />
        </h1>

        {
          (showPicksDetail || showBurnsDetail) &&
          <div className='pick-burn-detail'>
            {
              showPicksDetail &&
              <div className="picks">{`Pick ${remainingCardsToSelect}`}</div>
            }
            {
              showBurnsDetail &&
              <div className="burns">{`Burn ${remainingCardsToBurn}`}</div>
            }
          </div>
        }

        {
          cards.length > 0 && zoneName === ZONE_PACK &&
            <button
              className="confirm-btn"
              disabled={!canConfirm}
              onClick={() => App.emit("confirmSelection")}
            >
              Confirm
            </button>
        }
      </div>

      <div className={`cards -${cardTypes.map(({type}) => type).join(" -")} -${filter}`}>
        {
          cards.map((card, i) => isPackZone && game.burnsPerPack > 0
            ? <CardGlimpse key={i+zoneName+card.name+card.foil} card={card} zoneName={zoneName} />
            : <CardDefault key={i+zoneName+card.name+card.foil} card={card} zoneName={zoneName} />
          )
        }

        {
          cards.length === 0 && isPackZone && // TODO game is not over!
          ([
            <h2 className='waiting' key='other'>Waiting for the next pack...</h2>,
            Array(cardsInNextPack).fill(0)
              .map((_, i) => <CardPlaceholder key={i} />)
          ])
        }
      </div>
    </div>
  );
};

export default Grid;
