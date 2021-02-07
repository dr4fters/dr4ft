/*global BUILD_DATE*/
import React from "react";
import PropTypes from "prop-types";
import "./Version.scss"

const getLink = (version) => (
  (/^v\d+\.\d+\.\d+$/.test(version)) ?
    `releases/tag/${version}` :
    `commit/${version}`
);

const Version = ({version, MTGJSONVersion, boosterRulesVersion}) => {
  return (
    <div className="Version">
      <div>
        dr4ft version: {" "}
        <a href={"https://github.com/dr4fters/dr4ft/${getLink(version)}" target="_blank"} className='code'>
          <code>{version}</code>
        </a> <span className='date'>({BUILD_DATE})</span>
      </div>

      <div>
        Card data: <a href="https://www.mtgjson.com" target="_blank">MTGJSON</a> {" "}
        <a href={`https://mtgjson.com/changelog/mtgjson-v5/#_${MTGJSONVersion.version.replace(/\./g, "-")}`} className='code'>
          <code>v{MTGJSONVersion.version}</code>
        </a> <span className='date'>({MTGJSONVersion.date})</span>
      </div>

      <div>
        Booster rules: {" "}
        <a href={`https://github.com/taw/magic-sealed-data` target=`_blank`}>Magic Sealed Data</a> {" "}
        <a href={`https://github.com/taw/magic-sealed-data/commit/${boosterRulesVersion}`} className='code'>
          <code>{boosterRulesVersion.substring(0, 7)}</code>
        </a>
      </div>
    </div>
  );
};

Version.propTypes = {
  version: PropTypes.string,
  MTGJSONVersion: PropTypes.object,
  boosterRulesVersion: PropTypes.string
};

export default Version;
