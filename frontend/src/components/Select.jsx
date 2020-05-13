import React from "react";
import PropTypes from "prop-types";

import App from "../app";

const Select = ({
  link,
  opts,
  onChange = (e) => { App.save(link, e.currentTarget.value); },
  value = App.state[link],
  ...rest}) => (
  <select
    onChange={onChange}
    value={value}
    {...rest}>
    {opts.map((opt, index) =>
      <option key={index}>{opt}</option>
    )}
  </select>
);

Select.propTypes = {
  link: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any,
  opts: PropTypes.array
};

export default Select;
