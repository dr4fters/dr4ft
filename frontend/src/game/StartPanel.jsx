import React from "react";

import App from "../app";
import Checkbox from "../components/Checkbox";
import Select from "../components/Select";
import { toTitleCase } from "../utils";

const StartPanel = () => {
  const gameType = toTitleCase(App.state.game.type);

  return (
    <fieldset className='start-controls fieldset'>
      <legend className='legend game-legend'>Game</legend>
      <span>
        <div>Type: {gameType}</div>
        <div>Info: {App.state.game.packsInfo}</div>
        {(App.state.isHost && !App.state.didGameStart)
          ? <StartControls/>
          : <div />}
      </span>
    </fieldset>
  );
};

const StartControls = () => {
  const {gametype} = App.state;
  const isDraft = /draft/.test(gametype);

  return (
    <div>
      {isDraft
        ? <Options/>
        : <div/>}
      <div>
        <button onClick={App._emit("start")}>Start Game</button>
      </div>
    </div>
  );
};

const Options = () => {
  const {useTimer} = App.state;
  const timers = ["Fast", "Moderate", "Slow", "Leisurely"];
  return (
    <span>
      {showAddBotsCheckbox()
        ? <Checkbox side="left" link="addBots" text="Fill empty seats with Bots"/>
        : null
      }
      {showShufflePlayersCheckbox()
        ? <Checkbox side="left" link="shufflePlayers" text="Random seating"/>
        : null
      }
      <div>
        <Checkbox side="left" link="useTimer" text="Timer: "/>
        <Select link="timerLength" opts={timers} disabled={!useTimer}/>
      </div>
    </span>
  );
};

const showAddBotsCheckbox = () => {
  // No need for bots in decadent draft since there's no passing.
  return !App.state.isDecadentDraft;
}

const showShufflePlayersCheckbox = () => {
  // No need to shuffle players in decadent draft because there's no passing.
  return !App.state.isDecadentDraft;
}

export default StartPanel;
