import React from "react";
import PropTypes from "prop-types";

import App from "Src/app";

const GameTypes = () => {
  const types = ["draft", "sealed", "cube draft", "cube sealed", "chaos draft", "chaos sealed"];
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
      checked={isChecked}/> {type.toLowerCase().split(" ").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" ")}
  </label>
);

GameType.propTypes = {
  type: PropTypes.string,
  isChecked: PropTypes.bool
};

export default GameTypes;
