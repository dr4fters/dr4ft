import React from "react";

import _ from "utils/utils";
import App from "../app";
import Checkbox from "../components/Checkbox";

import GameTypes from "./GameTypes";
import GameOptions from "./GameOptions";

const CreatePanel = () => {
  const {title, seats} = App.state;

  return (
    <fieldset className='fieldset'>
      <legend className='legend'>
        Create a Room
      </legend>
      <div>
        <label>
          Game title:{" "}
          <input type='text'
            value={title}
            onChange={(e) => {App.save("title", e.currentTarget.value);}}
          />
        </label>
      </div>
      <div>
        Number of players:{" "}
        <select value={seats} onChange={(e) => {App.save("seats", e.currentTarget.value);}}>
          {_.seq(100, 1).map((x, i) =>
            <option key={i}>{x}</option>)}
        </select>
      </div>
      <div>
        <Checkbox link='isPrivate' text='Make room private: ' side='right'/>
      </div>
      <GameTypes/>
      <GameOptions/>
      <p>
        <button onClick={App._emit("create")}>
          Create room
        </button>
      </p>
    </fieldset>
  );
};

export default CreatePanel;
