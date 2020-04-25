import React from "react";
import PropTypes from "prop-types";

import App from "./app";

/**
 * Utils offers a list of "connected" tools
 * through a "link" prop to connect to the app state
 */

export const Textarea = ({link, ...rest}) => (
  <textarea
    style={ {"overflowY": "scroll", "height": "150px"}}
    onChange=
      { (e) => { App.save("list", e.currentTarget.value); } }
    value={App.state[link]}
    {...rest} />
);

Textarea.propTypes = {
  link: PropTypes.string
};

//TODO: check if lodash can do it
export const toTitleCase = (string="", separator=" ") =>
  string.split(separator)
    .reduce((result, word) => `${result} ${word.charAt(0).toUpperCase()+word.slice(1).toLowerCase()}`, "");
