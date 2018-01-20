import React from "react"

import App from "Src/app"

const GameTypes = () => {
  const types = ['draft', 'sealed', 'cube draft', 'cube sealed', 'chaos']
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
