import React from "react";
import PropTypes from "prop-types";

import App from "../app";

const RadioOption = ({
  label,
  name,
  value,
  tooltip,
  onChange,
  isChecked
}) => {
  const id = `radio-button-${name}-${value}`;

  return (
    <label htmlFor={id} className='radio-label connected-component' data-tip={tooltip || ""}>
      {label} <span className="vhidden">({tooltip})</span>
      <input
        id={id}
        className="radio-input connected-component"
        name={name}
        type='radio'
        value={value}
        onChange={onChange}
        checked={isChecked}/>
      <span className="radio-button-replacement"></span>
    </label>
  );
};

RadioOption.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  name: PropTypes.string,
  tooltip: PropTypes.string,
  isChecked: PropTypes.bool,
  onChange: PropTypes.func
};

const RadioOptions = ({name, description, appProperty, options, onChange}) => {
  return (
    <fieldset>
      <legend className="vhidden">{description}</legend>
      {options.map((option, key) =>
        <RadioOption
          name={name}
          key={key}
          label={option.label}
          value={option.value}
          tooltip={option.tooltip}
          isChecked={App.state[appProperty] === option.value}
          onChange={() => {
            App.save(appProperty, option.value);

            if (onChange) {
              onChange();
            }
          }}
        ></RadioOption>
      )}
    </fieldset>
  );
};

RadioOptions.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  appProperty: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func
};

export default RadioOptions;
