import React from "react";
import PropTypes from "prop-types";

import App from "../app";
import SetChoices from "./SetChoices";

const SetReplicated = ({ selectedSet, type }) => {
  // A single dropdown which is used to fill an entire array
  // of sets with the same selection.
  const onSetChange = (e) => {
    const chosenSet = e.currentTarget.value;
    let sets = App.state[type];
    for (let i = 0; i < sets.length; i++) {
      sets[i] = chosenSet;
    }
    App.save(type, App.state[type]);
  };
  return (
    <select value={selectedSet} onChange={onSetChange} key={0}>
      <SetChoices/>
    </select>
  );
};

SetReplicated.propTypes = {
  selectedSet: PropTypes.string,
  type: PropTypes.string
};

export default SetReplicated;
