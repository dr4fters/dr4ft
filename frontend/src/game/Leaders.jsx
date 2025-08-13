import React from "react";

import App from "../app";
import {ZONE_JUNK, ZONE_MAIN, ZONE_PACK, ZONE_SIDEBOARD} from "../zones";

import "./Leaders.scss";

const LeadersPanel = () => {
  if (App.state.didGameStart || App.state.isGameFinished) {
    return (
      <div className='Leaders'>
        <LeadersList />


      </div>
    );
  }
  return null;
};

const LeadersList = () => {
  console.log(App.state);
  console.log("--------")

  return (
    <fieldset className='ExportDeckPanel fieldset'>
      <legend className='legend game-legend'>Picked Leaders</legend>
      <Grid key={"pool"} zones={[ZONE_MAIN]} />
     </fieldset>
  );
};

export default LeadersPanel;
