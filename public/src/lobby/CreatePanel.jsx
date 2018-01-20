import React from "react"

import _ from "Lib/utils"
import App from "Src/app"
import {Checkbox} from "Src/utils"

import GameTypes from "./GameTypes"
import GameOptions from "./GameOptions"

const CreatePanel = () => {
  const {title, seats} = App.state

  return (
    <fieldset className='fieldset'>
      <legend className='legend'>
        Create a room
      </legend>
      <div>
        <label>
          Game title:{' '}
          <input type='text'
                 value={title}
                 onChange={(e) => {App.save("title", e.currentTarget.value)}}
                 />
        </label>
      </div>
      <div>
        Number of players:{' '}
        <select value={seats} onChange={(e) => {App.save("seats", e.currentTarget.value)}}>
          {_.seq(100, 2).map((x, key) =>
            <option key={_.uid()}>{x}</option>)}
        </select>
      </div>
      <div>
        <Checkbox link='isPrivate' text='Make room private: ' side='right'/>
      </div>
      <GameTypes/>
      <GameOptions/>
      <p>
        <button onClick={App._emit('create')}>
          Create room
        </button>
      </p>
    </fieldset>
  )
}

export default CreatePanel
