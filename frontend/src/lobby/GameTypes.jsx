import React, {Fragment} from "react";
import PropTypes from "prop-types";

import RadioOptions from "../components/RadioOptions";
import { toTitleCase } from "../utils";
import App from "../app";

const gameDescriptions = {
  regular: "Conventional 16 card booster packs"
};

const GameTypes = () => {
  const gameOptions = {
    draft: ["regular"],
    sealed: ["regular"]
  };

  const getAvailableTypes = () => Object.keys(gameOptions);
  const getAvailableSubTypes = (gameType) => gameOptions[gameType];
  return (
    <div>
      <span className='connected-container'>
        <RadioOptions
          name="subtype"
          description="Game subtype"
          appProperty="gamesubtype"
          options={
            getAvailableSubTypes(App.state.gametype).map(type => {
              return {
                label: toTitleCase(type),
                value: type,
                tooltip: gameDescriptions[type]
              };
            })
          }
        />
      </span>
    </div>
  );
};

export default GameTypes;
