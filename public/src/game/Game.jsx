import React, {Component} from "react";

import App from "../app";
import {Zones} from "../cards";

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
    if (App.state.name == STRINGS.BRANDING.DEFAULT_USERNAME) {
      vanillaToast.warning(`Welcome, ${App.state.name}! Please update your nickname via the 'Players' widget in the upper left.`, {duration: 5000});
    }

    window.addEventListener("beforeunload", this.leaveGame);
  }

  componentWillUnmount() {
    this.leaveGame();
    window.removeEventListener("beforeunload", this.leaveGame);
  }

  render() {
    const { gametype, gamesubtype } = App.state;
    const moveSettings = App.state.isGameFinished && ["regular sealed", "cube draft", "cube sealed"].includes(`${gamesubtype} ${gametype}`);
    return (
      <div className='container'>
        <audio id='beep' src='/media/beep.wav'/>
        <div className='game'>
          <div className='game-controls'>
            <div className='game-status'>
              <PlayersPanel/>
              <StartPanel/>
              {moveSettings && <GameSettings />}
            </div>
            <DeckSettings />
            {!moveSettings && <GameSettings/>}
          </div>
          <CardsZone />
        </div>
        <Chat />
      </div>
    );
  }
}

const CardsZone = () => {
  const pack
  = !App.state.isGameFinished && Object.keys(Zones.pack).length
    ? <Grid key={"pack"} zones={["pack"]} />
    : <div key={"pack"}/>;
  const props = { zones: ["main", "side", "junk"] };
  const pool = App.state.cols ? <Cols key={"pool"} {...props}/> : <Grid key={"pool"} {...props} />;
  const showPool = !App.state.hidepicks || App.state.isGameFinished;
  return showPool ? [pack, pool] : [pack];
};
