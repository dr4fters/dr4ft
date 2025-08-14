import React from "react";
import PropTypes from "prop-types";
import "./SelectionState.scss";

function SelectionState ({ isPick, card, isRotated, selection, base}) {
  if (!isPick) return null;

  if (isPick) {
    return (
      <div className={`SelectionState -pick ${(card.type === "Leader" && !isRotated) || card.type === "Base" ? "-rotated": ""} ${selection? "-selection": ""} ${base? "-base":""}`}>
        <i className="action icon ion-android-checkbox" />
      </div>
    );
  }
}

SelectionState.propTypes = {
  isPick: PropTypes.bool,
  card: PropTypes.object,
  isRotated: PropTypes.bool,
  selection: PropTypes.bool,
  base: PropTypes.bool
};

export default SelectionState;

// <i className="frame icon ion-arrow-up-b" />
