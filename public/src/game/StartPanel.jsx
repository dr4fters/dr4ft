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

  return (
    <div>
      <div>Format: {format}</div>
      {isDraft
        ? <Options/>
        : <div/>}
      <div>
        <button onClick={App._emit('start')}>Start game</button>
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
        <Checkbox side="left" link="shufflePlayers" text=" Random Seating"/>
      </div>
    </span>
  )
}

export default StartPanel
