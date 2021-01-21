import React from "react";
import PropTypes from "prop-types";

import App from "../app";

const Select = props => {
  const {
    link,
    opts,
    value = App.state[link],
    onChange = (e) => App.save(link, e.currentTarget.value),
    printOpt = opt => opt,
    ...rest
  } = props

  return (
    <select
      onChange={onChange}
      value={value}
      {...rest}
    >
      {opts.map((opt, index) =>
        <option value={opt} key={index}>{printOpt(opt)}</option>
      )}
    </select>
  );
}

Select.propTypes = {
  link: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any,
  opts: PropTypes.array
};

export default Select;
