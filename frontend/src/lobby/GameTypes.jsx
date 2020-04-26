import React from "react";
import PropTypes from "prop-types";

import App from "../app";

import { toTitleCase } from "../utils";

const GameTypes = () => {
  const types = ["draft", "sealed"];
  const subtypes = ["regular", "cube", "chaos", "decadent"];
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
              onChange={() => {
                App.save("gamesubtype", type)
                if (type === "decadent") {
                  App.state.setsDraft.length = 36;
                  App._emit("changeSetsNumber", "setsDraft", true)
                }
              }
              }/>
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
      checked={isChecked}/> {toTitleCase(type)}
  </label>
);

GameType.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  isChecked: PropTypes.bool,
  onChange: PropTypes.func
};

export default GameTypes;
