import React from "react";
import PropTypes from "prop-types";

import App from "../app";

import "./Switch.scss";

const Switch = ({
  appProperty,
  checked = {},
  unchecked = {}
}) => {
  const isChecked = Boolean(App.state[appProperty])
  const tooltip = (isChecked ? checked : unchecked).tooltip

  return (
    <label className="Switch" data-tip={tooltip}>
      <span className='label'>Private</span>
      <span className="vhidden">({tooltip})</span>

      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => App.save(appProperty, !isChecked) }
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
