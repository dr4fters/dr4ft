import React, {Component} from "react";
import PropTypes from "prop-types";

import _ from "NodePackages/utils/utils";
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
  constructor(props) {
    super(props);
    this.state = this.props.state;
    App.register(this);
  }
  componentWillMount() {
    App.state.players = [];
    App.send("join", this.props.id);
    App.state.chat = true;
  }

  componentWillReceiveProps({id}) {
    if (this.props.id === id)
      return;

    App.send("join", id);
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

Game.propTypes = {
  state: PropTypes.object,
  id: PropTypes.string.isRequired
};

const CardsZone = () => {
  const pack
  = Object.keys(Zones.pack).length
    ? <Grid key={"pack"} zones={["pack"]} />
    : <div key={"pack"}/>;
  const props = { zones: ["main", "side", "junk"] };
  const pool = App.state.cols ? <Cols key={"pool"} {...props}/> : <Grid key={"pool"} {...props} />;
  return [pack, pool];
};
