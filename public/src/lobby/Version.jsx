import React from "react";
import PropTypes from "prop-types";

const Version = ({version, MTGJSONVersion}) => {
  return (
    <p>Running Version: v{VERSION} (build {BUILD_DATE}) commit {" "}
      <a href={`https://github.com/dr4fters/dr4ft/commit/${version}`}>
        {version}
      </a>. Using cards from <a href="https://www.mtgjson.com">MTGJSON</a> version: v{MTGJSONVersion.version} ({MTGJSONVersion.date})
    </p>
  );
};

Version.propTypes = {
  version: PropTypes.string,
  MTGJSONVersion: PropTypes.object
};

export default Version;
