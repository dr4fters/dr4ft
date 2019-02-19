import React, {Component} from "react";

import App from "Src/app";
import {Zones} from "Src/cards";

import PlayersPanel from "./PlayersPanel";
import StartPanel from "./StartPanel";
import DeckSettings from "./DeckSettings";
import GameSettings from "./GameSettings";
import Cols from "./Cols";
import Grid from "./Grid";
import Chat from "./Chat";


export default class Game extends Component {
  componentDidMount() {
    App.register(this);
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
            <DeckSettings />
            <GameSettings/>
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
  = Object.keys(Zones.pack).length
    ? <Grid key={"pack"} zones={["pack"]} />
    : <div key={"pack"}/>;
  const props = { zones: ["main", "side", "junk"] };
  const pool = App.state.cols ? <Cols key={"pool"} {...props}/> : <Grid key={"pool"} {...props} />;
  return [pack, pool];
};
