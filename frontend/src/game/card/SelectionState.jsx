import React from "react";
import PropTypes from "prop-types";
import "./SelectionState.scss";

function SelectionState ({ isPick, isBurn }) {
  if (isPick && isBurn) throw new Error("Cannot pick and burn same card")

  if (!isPick && !isBurn) return <div className="SelectionState" />

  if (isPick) {
    return (
      <div className="SelectionState -pick">
        <i className="action icon ion-android-checkbox" />
      </div>
    )
  }

  if (isBurn) {
    return (
      <div className="SelectionState -burn">
        <i className="action icon ion-flame" />
      </div>
    )
  }
}

SelectionState.propTypes = {
  isPick: PropTypes.bool,
  isBurn: PropTypes.bool
};

export default SelectionState;

// <i className="frame icon ion-arrow-up-b" />
