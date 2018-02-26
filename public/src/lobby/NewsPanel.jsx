import React from "react";
import PropTypes from "prop-types";

const NewsPanel = ({motd}) => (
  <fieldset className='fieldset'>
    <legend className='legend'>News</legend>
    {motd}
  </fieldset>
);

NewsPanel.propTypes = {
  motd: PropTypes.object
};

export default NewsPanel;
