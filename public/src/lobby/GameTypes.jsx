import React from "react";
import PropTypes from "prop-types";

import App from "Src/app";

const GameTypes = () => {
  const types = ["Draft", "Sealed", "Cube Draft", "Cube Sealed", "Chaos"];
  return (
    <div>
      <p>Game type:{" "}
        <span className='connected-container'>
          {types.map((type, key) =>
            <GameType type={type} key={key} isChecked={App.state.type == type}/>
          )}
        </span>
      </p>
    </div>
  );
};

const GameType = ({type, isChecked}) => (
  <label className='radio-label connected-component'>
    <input
      className="radio-input connected-component"
      name='draft-type'
      type='radio'
      value={type}
      onChange={() => {
        App.save("type", type);
      }}
      checked={isChecked}/> {type}
  </label>
);

GameType.propTypes = {
  type: PropTypes.string,
  isChecked: PropTypes.bool
};

export default GameTypes;
