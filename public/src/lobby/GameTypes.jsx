import React from "react"

import App from "../app"

//TODO: déplacer les types dans une CONF ?
const types = ['draft', 'sealed', 'cube draft', 'cube sealed', 'chaos']

const GameTypes = () => {
  return (
    <div>
      <p>Game type:{' '}
        <span className='connected-container'>
          {types.map((type, key) =>
            <GameType type={type} key={key} isChecked={App.state.type == type}/>
          )}
        </span>
      </p>
    </div>
  )
}

const GameType = ({type, isChecked}) => (
  <label className='radio-label connected-component'>
    <input
      className="radio-input connected-component"
      name='draft-type'
      type='radio'
      value={type}
      onChange={() => {
      App.save("type", type)
    }}
      checked={isChecked}/> {type}
  </label>
)
export default GameTypes
