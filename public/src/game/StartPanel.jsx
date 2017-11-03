import React from "react"

import _ from "Lib/utils"
import App from 'Src/app'
import {Select, Checkbox} from "Src/utils"

const StartPanel = () => (
  (App.state.isHost && !App.state.didGameStart)
  ? <fieldset className='start-controls fieldset'>
      <legend className='legend game-legend'>Start game</legend>
      <StartControls/>
    </fieldset>
  : <div/>
)

const StartControls = () => {
    const {players, type, format, useTimer, timerLength} = App.state
    const isDraft = type !== 'sealed' && type !== 'cube sealed'

    // TODO : a virer si on ne garde pas l'information sur Ready to start ! let
    // numNotReady = players     .filter(x => !x.isReadyToStart)     .length let
    // readyToStart = (numNotReady === 0) let startButton = readyToStart     ?
    // <button onClick={App._emit('start')}>Start game</button>     : <button
    // disabled="true" title={READY_TITLE_TEXT}>Start game</button> let
    // readyReminderText = '' if (!readyToStart) {     let players = (numNotReady
    // === 1         ? 'player'         : 'players')     readyReminderText = <span
    // style={{         marginLeft: '5px'     }}>         Waiting for {numNotReady}
    //        {players}         to become ready...     </span> }

    return (
        <div>
            <div>Format: {format}</div>
            {isDraft
                ? <Options/>
                : <div/>}
            <div>
                <button onClick={App._emit('start')}>Start game</button>
                {/*readyReminderText*/}
            </div>
        </div>
    )
}

const Options = () => {
    const {useTimer} = App.state
    const timers = ['Fast', 'Moderate', 'Slow', 'Leisurely']
    return (
        <span>
            <Checkbox side="left" link="addBots" text=" bots"/>
            <div>
                <Checkbox side="left" link="useTimer" text=" timer: "/>
                <Select link="timerLength" opts={timers} disabled={!useTimer}/>
            </div>
        </span>
    )
}

export default StartPanel