import React from "react";

import App from "../app";
import { Select, Checkbox, toTitleCase } from "../utils";


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
        <button onClick={App._emit("start")}>Start game</button>
      </div>
    </div>
  );
};

const Options = () => {
  const {useTimer} = App.state;
  const timers = ["Fast", "Moderate", "Slow", "Leisurely"];
  return (
    <span>
      <Checkbox side="left" link="addBots" text=" Bots"/>
      <div>
        <Checkbox side="left" link="useTimer" text=" Timer: "/>
        <Select link="timerLength" opts={timers} disabled={!useTimer}/>
        <Checkbox side="left" link="shufflePlayers" text=" Random seating"/>
      </div>
    </span>
  );
};

export default StartPanel;
