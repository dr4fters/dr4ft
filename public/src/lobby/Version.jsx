import React from "react";
import PropTypes from "prop-types";

const Version = ({version}) => {
  return (
    <p>Running Version{" "}
      <a href={`https://github.com/dr4fters/dr4ft/commit/${version}`}>
        {version}
      </a>
    </p>
  );
};

Version.propTypes = {
  version: PropTypes.string
};

export default Version;
