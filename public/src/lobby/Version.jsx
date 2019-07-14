import React from "react";
import PropTypes from "prop-types";

const getLink = (version) => (
  (/^v\d+\.\d+\.\d+$/.test(version)) ?
    `releases/tag/${version}` :
    `commit/${version}`
);

const Version = ({version, MTGJSONVersion}) => {
  return (
    <p>Running Version: {" "}
      <a href={`https://github.com/dr4fters/dr4ft/${getLink(version)}`}>
        {version}
      </a> (build {BUILD_DATE}) - Using <a href="https://www.mtgjson.com">MTGJSON</a> card data version: v{MTGJSONVersion.version} ({MTGJSONVersion.date})
    </p>
  );
};

Version.propTypes = {
  version: PropTypes.string,
  MTGJSONVersion: PropTypes.object
};

export default Version;
