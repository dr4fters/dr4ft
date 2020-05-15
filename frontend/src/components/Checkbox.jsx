import React from "react";
import PropTypes from "prop-types";

import App from "../app";

const Checkbox = ({link, text, side, onChange, ...rest}) => (
  <div>
    {side === "right" ? text : ""}
    <input
      {...rest}
      type="checkbox"
      onChange={onChange || function (e) {
        App.save(link, e.currentTarget.checked);
      }}
      checked={App.state[link]}/>
    {side === "left" ? text : ""}
  </div>
);

Checkbox.propTypes = {
  link: PropTypes.string,
  text: PropTypes.string,
  side: PropTypes.string,
  onChange: PropTypes.func
};

export default Checkbox;
