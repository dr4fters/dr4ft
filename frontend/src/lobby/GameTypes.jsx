import React from "react";
import PropTypes from "prop-types";

import App from "../app";

const GameTypes = () => {
  const types = ["draft", "sealed", "glimpse"];
  const subtypes = ["regular", "cube", "chaos"];
  return (
    <div>
      <p>Game type:{" "}
        <span className='connected-container'>
          {types.map((type, key) =>
            <GameType name={"type"}
              type={type}
              key={key}
              isChecked={App.state.gametype === type}
              onChange={() => App.save("gametype", type)}/>
          )}
        </span>
      </p>
      <p>Game mode:{" "}
        <span className='connected-container'>
          {subtypes.map((type, key) =>
            <GameType name={"subtype"}
              type={type}
              key={key}
              isChecked={App.state.gamesubtype === type}
              onChange={() => App.save("gamesubtype", type)}/>
          )}
        </span>
      </p>
    </div>
  );
};

const GameType = ({ name, type, isChecked, onChange}) => (
  <label className='radio-label connected-component'>
    <input
      className="radio-input connected-component"
      name={name}
      type='radio'
      value={type}
      onChange={onChange}
      checked={isChecked}/> {type.toLowerCase().split(" ").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" ")}
  </label>
);

GameType.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  isChecked: PropTypes.bool,
  onChange: PropTypes.func
};

export default GameTypes;
