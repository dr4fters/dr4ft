/*global BUILD_DATE*/
import React from "react";
import PropTypes from "prop-types";

const getLink = (version) => (
  (/^v\d+\.\d+\.\d+$/.test(version)) ?
    `releases/tag/${version}` :
    `commit/${version}`
);

const Version = ({version, MTGJSONVersion, boosterRulesVersion}) => {
  return (
    <p>Running Version: {" "}
      <a href={`https://github.com/dr4fters/dr4ft/${getLink(version)}`}>
        {version}
      </a> (build {BUILD_DATE}) - Using <a href="https://www.mtgjson.com">MTGJSON</a> {" "}
      card data {" "}
      <a href={`https://mtgjson.com/changelog/#_${MTGJSONVersion.version.replace(/\./g, "-")}`}>
        v{MTGJSONVersion.version}
      </a> ({MTGJSONVersion.date}) and <a href={"https://github.com/taw/magic-sealed-data"}>Magic Sealed Data</a> {" "}
        booster rules{" "}
      commit <a href={`https://github.com/taw/magic-sealed-data/commit/${boosterRulesVersion}`}>{boosterRulesVersion}</a>
    </p>
  );
};

Version.propTypes = {
  version: PropTypes.string,
  MTGJSONVersion: PropTypes.object,
  boosterRulesVersion: PropTypes.string
};

export default Version;
