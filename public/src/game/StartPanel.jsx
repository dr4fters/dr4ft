import React from "react"

import App from '../app'
import _ from "../../lib/utils"
import {Select, Checkbox} from "../utils"

const StartPanel = () => {
    const {didGameStart, isHost} = App.state

    if (didGameStart || !isHost) 
        return <div/>

    return (
        <fieldset className='start-controls fieldset'>
            <legend className='legend game-legend'>Start game</legend>
            <span><StartControls/></span>
        </fieldset>
    )
}

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