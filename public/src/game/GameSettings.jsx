import React from "react";

import _ from "NodePackages/utils/utils";
import App from "Src/app";
import {Checkbox} from "Src/utils";

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
        <SortCards />
        <CardsImage />
      </span>
    </fieldset>
  </div>
);

const SortCards = () => (
  <div className="settings-sort-cards">
    Sort cards by:
    <div className= 'connected-container' >
      {["cmc", "color", "type", "rarity"].map((sort, index) =>
        <label key={index} className='radio-label connected-component'>
          <input checked= {sort === App.state.sort}
            className='radio-input'
            name= 'sort-order'
            onChange= {e => App.save("sort", e.currentTarget.value)}
            type='radio'
            value={sort}/>
          {sort}
        </label>
      )}
    </div>
  </div>
);

const CardsImage = () => (
  <div className="settings-card-size">
          Set cards image:
    <div className='connected-container'>
      {["small", "normal", "large"].map((size, index) => <label key={index} className='radio-label connected-component'>
        <input checked={size === App.state.cardSize} className='radio-input' name='card-size' onChange={e => App.save("cardSize", e.currentTarget.value)} type='radio' value={size} />
        {size}
      </label>)}
    </div>
  </div>
);

export default GameSettings;
