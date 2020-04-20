import React, {Component} from "react";

import App from "../app";

import PlayersPanel from "./PlayersPanel";
import StartPanel from "./StartPanel";
import DeckSettings from "./DeckSettings";
import GameSettings from "./GameSettings";
import Cols from "./Cols";
import Grid from "./Grid";
import Chat from "./Chat";
import {STRINGS} from "../config";

import {vanillaToast} from "vanilla-toast";
import "vanilla-toast/vanilla-toast.css";
import {ZONE_JUNK, ZONE_MAIN, ZONE_PACK, ZONE_SIDEBOARD} from "../zones";

export default class Game extends Component {
  constructor(props) {
    super(props);
    App.register(this);
  }

  leaveGame() {
    App.send("leave");
  }

  componentDidMount() {
    // Alert to change name
    if (App.state.name === STRINGS.BRANDING.DEFAULT_USERNAME) {
      vanillaToast.warning(`Welcome, ${App.state.name}! Please update your nickname via the 'Players' widget in the upper left.`, {duration: 5000});
    }

    window.addEventListener("beforeunload", this.leaveGame);
  }

  componentWillUnmount() {
    this.leaveGame();
    window.removeEventListener("beforeunload", this.leaveGame);
  }

  render() {
    return (
      <div className='container'>
        <audio id='beep' src='/media/beep.wav'/>
        <div className='game'>
          <div className='game-controls'>
            <div className='game-status'>
              <PlayersPanel/>
              <StartPanel/>
            </div>
            <DeckSettings/>
            <GameSettings/>
          </div>
          <CardsZone/>
        </div>
        {App.state.chat && <Chat/>}
      </div>
    );
  }
}

const CardsZone = () => {
  const pack
  = !App.state.isGameFinished && App.state.didGameStart
    ? <Grid key={"pack"} zones={[ZONE_PACK]} />
    : <div key={"pack"}/>;
  const props = { zones: [ZONE_MAIN, ZONE_SIDEBOARD, ZONE_JUNK] };
  const pool = App.state.cols ? <Cols key={"pool"} {...props}/> : <Grid key={"pool"} {...props} />;
  const showPool = !App.state.hidepicks || App.state.isGameFinished;
  return showPool ? [pack, pool] : [pack];
};
