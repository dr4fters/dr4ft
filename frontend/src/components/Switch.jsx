import React from "react";
import PropTypes from "prop-types";

import App from "../app";

import "./Switch.scss";

const Switch = ({
  appProperty,
  checked,
  unchecked
}) => {
  const isChecked = Boolean(App.state[appProperty])
  const { label, tooltip } = isChecked ? checked : unchecked


  return (
    <label className="Switch">
      <span className='label'>{label}</span>
      <span className="vhidden">({tooltip})</span>

      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => {
          App.save(appProperty, !isChecked);
        }}
      />
      <span className="slider-nob round"></span>
      <span className="slider round"></span>
    </label>
  );
};

Switch.propTypes = {
  appProperty: PropTypes.string,
  checked: PropTypes.object,
  unchecked: PropTypes.object,
  tooltip: PropTypes.string
};

export default Switch;
