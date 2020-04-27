import React from "react";
import PropTypes from "prop-types";

import App from "../app";
import { toTitleCase } from "../utils";

const Set = ({ index, selectedSet, type }) => {
  const onSetChange = (e) => {
    const chosenSet = e.currentTarget.value;
    let sets = App.state[type];
    sets[index] = chosenSet;
    App.save(type, App.state[type]);
  };
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
  return (
    <select value={selectedSet} onChange={onSetChange} key={index}>
      {groups}
    </select>
  );
};

Set.propTypes = {
  index: PropTypes.number,
  selectedSet: PropTypes.string,
  type: PropTypes.string,
  useForAllSets: PropTypes.bool
};

export default Set;
