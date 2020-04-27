import React from "react";
import PropTypes from "prop-types";

import App from "../app";

const TextArea = ({link, ...rest}) => (
  <textarea
    style={ {"overflowY": "scroll", "height": "150px"}}
    onChange=
      { (e) => { App.save(link, e.currentTarget.value); } }
    value={App.state[link]}
    {...rest} />
);

TextArea.propTypes = {
  link: PropTypes.string
};

export default TextArea;
