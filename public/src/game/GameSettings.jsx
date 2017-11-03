import React from "react"

import _ from "Lib/utils"
import App from 'Src/app'
import {Checkbox} from "Src/utils"

const GameSettings = () => (
    <div className='game-settings'>
      <fieldset className='fieldset'>
        <legend className='legend game-legend'>Settings</legend>
        <span>
          <div>
            <Checkbox side="left" text="Show chat" link="chat" />
          </div>
          <div>
            <Checkbox side="left" text="Add picks to sideboard" 
                      link="side" 
                      onChange={(e) => {
                        App.save('side', e.target.checked)
                        App.emit('side')
                      }}/>
          </div>
          <div>
            <Checkbox side="left" text="Beep on new packs" link="beep" />
          </div>
          <div>
            <Checkbox side="left" text="Column view" link="cols" />
          </div>
          <Sort />
        </span>
      </fieldset>
    </div>
)

const Sort = () => (
  <div>
    Sort cards by:
    <div className= 'connected-container' >
      {['cmc', 'color', 'type', 'rarity'].map(sort =>
        <label key={_.uid()} className='radio-label connected-component'>
          <input checked= {sort === App.state.sort}
                 className='radio-input'
                 name= 'sort-order'
                 onChange= {e => App.save('sort', e.currentTarget.value)}
                 type='radio'
                 value={sort}/>
          {sort}  
        </label>
      )}
    </div>
  </div>
)

export default GameSettings