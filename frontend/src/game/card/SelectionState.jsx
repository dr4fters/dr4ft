import React from "react";
import PropTypes from "prop-types";
import "./SelectionState.scss";

function SelectionState ({ isPick, isBurn }) {
  return (
    <div className="SelectionState">
      {isPick && <i className="bookmark pick icon ion-android-bookmark" />}
      {isBurn && <i className="bookmark burn icon ion-android-bookmark" />}

      {isPick && <i className="icon ion-android-checkbox" />}
      {isBurn && <i className="icon ion-flame" />}
    </div>
  )
}

SelectionState.propTypes = {
  isPick: PropTypes.bool,
  isBurn: PropTypes.bool
};

export default SelectionState;
