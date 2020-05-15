import React from "react";

import App from "../app";
import { toTitleCase } from "../utils";


const SetChoices = () => {
  let groups = [];
  for (let setType in App.state.availableSets) {
    const allSets = App.state.availableSets[setType];
    let options = [];
    allSets.forEach(({ code, name }) => {
      options.push(
        <option value={code} key={code}>{name}</option>
      );
    });
    groups.push(
      <optgroup label={toTitleCase(setType, "_")} key={setType}>{options}</optgroup>
    );
  }
  return groups;
}

export default SetChoices;
