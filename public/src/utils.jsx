import React from "react";
import PropTypes from "prop-types";

import App from "./app";
import _ from "NodePackages/utils/utils";

/**
 * Utils offers a list of "connected" tools
 * through a "link" prop to connect to the app state
 */

export const Checkbox = ({link, text, side, onChange}) => (
  <div>
    {side == "right"
      ? text
      : ""}
    <input
      type="checkbox"
      onChange={onChange || function (e) {
        App.save(link, e.currentTarget.checked);
      }}
      checked={App.state[link]}/> {side == "left"
      ? text
      : ""}
  </div>
);

Checkbox.propTypes = {
  link: PropTypes.string,
  text: PropTypes.string,
  side: PropTypes.string,
  onChange: PropTypes.func
};

export const Spaced = ({elements}) => (
  elements
    .map((x, index) => <span key={index}>{x}</span>)
    .reduce((prev, curr) => [
      prev,
      <span key = {prev+curr} className = 'spacer-dot' />,
      curr
    ])
);

export const Select = ({link, opts, ...rest}) => (
  <select
    onChange={(e) => {
      App.save(link, e.currentTarget.value);
    }}
    value={App.state[link]}
    {...rest}>
    {opts.map((opt, index) =>
      <option key={index}>{opt}</option>
    )}
  </select>
);

Select.propTypes = {
  link: PropTypes.string,
  opts: PropTypes.array
};

export const Textarea = ({link, ...rest}) => (
  <textarea
    onChange=
      { (e) => { App.save("list", e.currentTarget.value); } }
    value={App.state[link]}
    {...rest} />
);

Textarea.propTypes = {
  link: PropTypes.string
};
