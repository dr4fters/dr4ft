import React from "react";

import _ from "utils/utils";
import App from "../app";
import { ZONE_MAIN } from "../zones";

import "./Leaders.scss";
import CardDefault from "./card/CardDefault";

const LeadersPanel = () => {
  if (App.state.didGameStart || App.state.isGameFinished) {
    return (
      <div className="Leaders">
        <LeadersList />
      </div>
    );
  }
  return null;
};

const LeadersList = () => {
  const zone = App.getSortedZone(ZONE_MAIN, "Leader");
  const values = _.values(zone);
  const cards = _.flat(values);

  return (
    <fieldset className="ExportDeckPanel fieldset">
      <legend className="legend game-legend">Picked Leaders</legend>
      <div className='Grid zone'>
        <div className={"cards -Leader"}>
          {
            cards.map((card, i) => <CardDefault key={i+"Leader"+card.name+card.foil} card={card} zoneName={ZONE_MAIN} />)
          }
        </div>
      </div>
    </fieldset>
  );
};

export default LeadersPanel;
