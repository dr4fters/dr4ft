import React from "react";

import _ from "utils/utils";
import App from "../app";
import { ZONE_MAIN } from "../zones";

import "./Bases.scss";
import CardDefault from "./card/CardDefault";

const BasesPanel = () => {
  if (App.state.didGameStart || App.state.isGameFinished) {
    return (
      <div className="Bases">
        <BasesList />
      </div>
    );
  }
  return null;
};

const BasesList = () => {
  const zone = App.getSortedZone(ZONE_MAIN, "Base");
  const values = _.values(zone);
  const cards = _.flat(values);

  return (
    <fieldset className="ExportDeckPanel fieldset">
      <legend className="legend game-legend">Available Bases</legend>
      <div className='Grid zone'>
        <div className={"cards -Base"}>
          {
            cards.map((card, i) => <CardDefault key={i+"Base"+card.name+card.foil} card={card} zoneName={ZONE_MAIN} />)
          }
        </div>
      </div>
    </fieldset>
  );
};

export default BasesPanel;
