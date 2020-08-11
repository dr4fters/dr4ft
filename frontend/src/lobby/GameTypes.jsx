import React, {Fragment} from "react";
import PropTypes from "prop-types";

import RadioOptions from "../components/RadioOptions";
import { toTitleCase } from "../utils";
import App from "../app";

const gameDescriptions = {
  regular: "Conventional 15 card booster packs",
  cube: "A user curated draft set",
  chaos: "Randomized booster packs",
  decadent: "Packs are discarded after first pick"
};

const GameTypes = () => {
  const gameOptions = {
    draft: ["regular", "cube", "chaos", "decadent"],
    sealed: ["regular", "cube", "chaos"]
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
