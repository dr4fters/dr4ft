import React from "react";
import PropTypes from "prop-types";

import _ from "NodePackages/utils/utils";
import App from "Src/app";
import sets from "Src/sets";

const Set = ({index, selectedSet}) => {
  const onSetChange = (e) => {
    App.state.sets[index] = e.currentTarget.value;
    App.save("sets", App.state.sets);
  };
  let groups = [];
  for (let setType in sets) {
    const allSets = sets[setType];
    let options = [];
    for (let name in allSets) {
      let code = allSets[name];
      options.push(
        <option value={code} key={name}>{name}</option>
      );
    }
    groups.push(
      <optgroup label={setType} key={setType}>{options}</optgroup>
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
  selectedSet: PropTypes.string
};

export default Set;
