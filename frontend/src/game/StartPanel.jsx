import React from "react";
import { useDispatch, useSelector } from "react-redux";

import App from "../app";
import Checkbox from "../components/Checkbox";
import Select from "../components/Select";
import { selectAddBots, selectShufflePlayers, selectUseTimer, toggleBots, toggleUseTimer, toggleShufflePlayers, selectTimerLength, setTimerLength, timers } from "../state/start-controls";
import { toTitleCase } from "../utils";

const StartPanel = () => {
  const gameType = toTitleCase(App.state.game.type);

  return (
    <fieldset className='start-controls fieldset'>
      <legend className='legend game-legend'>Game</legend>
      <span>
        <div>Type: {gameType}</div>
        <div>Info: {App.state.game.packsInfo}</div>
        <div>Picks per pack: {" " + App.state.picksPerPack }</div>
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
  const dispatch = useDispatch();
  const addBots = useSelector(selectAddBots);
  const shufflePlayers = useSelector(selectShufflePlayers);
  const useTimer = useSelector(selectUseTimer);
  const timerLength = useSelector(selectTimerLength);

  return (
    <span>
      {showAddBotsCheckbox()
        ? <Checkbox
          side="left"
          text="Fill empty seats with Bots"
          value={addBots}
          onChange={()=> dispatch(toggleBots())} />
        : null
      }
      {showShufflePlayersCheckbox()
        ? <Checkbox
          side="left"
          text="Random seating"
          value={shufflePlayers}
          onChange={()=> dispatch(toggleShufflePlayers())} />
        : null
      }
      <div>
        <Checkbox
          side="left"
          text="Timer: "
          value={useTimer}
          onChange={()=> dispatch(toggleUseTimer())} />
        <Select
          value={timerLength}
          onChange={(e) => dispatch(setTimerLength(e.target.value))}
          opts={timers}
          disabled={!useTimer} />
      </div>
    </span>
  );
};

const showAddBotsCheckbox = () => {
  // No need for bots in decadent draft since there's no passing.
  return !App.state.isDecadentDraft;
};

const showShufflePlayersCheckbox = () => {
  // No need to shuffle players in decadent draft because there's no passing.
  return !App.state.isDecadentDraft;
};

export default StartPanel;
