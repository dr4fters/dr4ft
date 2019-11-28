import React from "react";

import App from "../app";
import {Checkbox} from "../utils";

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
              App.save("side", e.target.checked);
              App.emit("side");
            }}/>
        </div>
        <div>
          <Checkbox side="left" text="Beep on new packs" link="beep" />
        </div>
        <div>
          <Checkbox side="left" text="Column view" link="cols" />
        </div>
        <div>
          <Checkbox side="left" text="Hide your picks" link="hidepicks" />
        </div>
        <SortCards />
        <CardsImageQuality />
      </span>
    </fieldset>
  </div>
);

const SortCards = () => (
  <div className="settings-sort-cards">
    Sort cards by:
    <div className= 'connected-container' >
      {["CMC", "Color", "Type", "Rarity"].map((sort, index) =>
        <label key={index} className='radio-label connected-component'>
          <input checked= {sort.toLowerCase() === App.state.sort}
            className='radio-input'
            name= 'sort-order'
            onChange= {e => App.save("sort", e.currentTarget.value)}
            type='radio'
            value={sort.toLowerCase()}/>
          {sort}
        </label>
      )}
    </div>
  </div>
);

const sizeDisplay = {
  "Small": "Low",
  "Normal": "Medium",
  "Large": "High",
};

const CardsImageQuality = () => (
  <div className="settings-cards-size">
    Card image quality:
    <div className='connected-container'>
      {Object.keys(sizeDisplay).map((size, index) => 
        <label key={index} className='radio-label connected-component'>
          <input checked={size.toLowerCase() === App.state.cardSize} 
            className='radio-input' 
            name='card-size' 
            onChange={e => App.save("cardSize", e.currentTarget.value)} 
            type='radio' 
            value={size.toLowerCase()} />
          {sizeDisplay[size]}
        </label>)}
    </div>
  </div>
);

export default GameSettings;
