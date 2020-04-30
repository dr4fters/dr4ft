import React from "react";
import PropTypes from "prop-types";

import App from "../app";

import { toTitleCase } from "../utils";

const GameTypes = () => {
  const gameOptions = {
    draft: ["regular", "cube", "chaos", "decadent"],
    sealed: ["regular", "cube", "chaos"]
  }

  const getAvailableTypes = () => Object.keys(gameOptions);
  const getAvailableSubTypes = (gameType) => gameOptions[gameType];
  return (
    <div>
      <p>Game type:{" "}
        <span className='connected-container'>
          {getAvailableTypes().map((gameType, key) =>
            <GameType name={"type"}
              type={gameType}
              key={key}
              isChecked={App.state.gametype === gameType}
              onChange={() => {
                App.save("gametype", gameType)
                const availableSubtypes = getAvailableSubTypes(gameType)
                if (!availableSubtypes.includes(App.state.gamesubtype)) {
                  // Reset to first available subtype if the currently-selected
                  // subtype is not available for the newly-selected type.
                  App.save("gamesubtype", availableSubtypes[0])
                }
              }}
            />
          )}
        </span>
      </p>
      <p>Game mode:{" "}
        <span className='connected-container'>
          {getAvailableSubTypes(App.state.gametype).map((type, key) =>
            <GameType name={"subtype"}
              type={type}
              key={key}
              isChecked={App.state.gamesubtype === type}
              onChange={() => App.save("gamesubtype", type)}
            />
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
