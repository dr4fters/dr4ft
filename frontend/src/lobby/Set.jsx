import React from "react";
import PropTypes from "prop-types";

import App from "../app";
import SetChoices from "./SetChoices";

const Set = ({ index, selectedSet, type }) => {
  const onSetChange = (e) => {
    const chosenSet = e.currentTarget.value;
    let sets = App.state[type];
    sets[index] = chosenSet;
    App.save(type, App.state[type]);
  };
  return (
    <div>
      {/* TODO pull down set icons */}
      <select value={selectedSet} onChange={onSetChange} key={index}>
        <SetChoices/>
      </select>
    </div>
  );
};

Set.propTypes = {
  index: PropTypes.number,
  selectedSet: PropTypes.string,
  type: PropTypes.string
};

export default Set;
