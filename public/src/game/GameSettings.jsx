import React from "react";

import App from "../app";
import {Checkbox} from "../utils";

const GameSettings = () => (
  <div className='game-settings'>
    <fieldset className='fieldset'>
      <legend className='legend game-legend'>Settings</legend>
      <span>
        <Checkbox side="left" text="Show chat" link="chat" />
        {!App.state.isSealed &&
          <Checkbox side="left" text="Enable notifications on new packs" link="beep" />
        }
        {!App.state.isSealed &&
          <Checkbox side="left"
            text={App.state.notificationBlocked ? "Web notifications blocked in browser" : "Use desktop notifications over beep"}
            link="notify"
            disabled={!App.state.beep || App.state.notificationBlocked}
            onChange={App._emit("notification")} />
        }
        {!App.state.isSealed &&
          <Checkbox side="left" text="Add picks to sideboard" link="side" />}
        {!App.state.isSealed &&
          <Checkbox side="left" text="Hide your picks" link="hidepicks" />
        }
        <Checkbox side="left" text="Use column view" link="cols" />
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
  "text": "Text-Only",
  "small": "Low",
  "normal": "Medium",
  "large": "High",
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
