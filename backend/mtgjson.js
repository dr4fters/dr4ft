const fs = require("fs");
const path = require("path");
const {getDataDir} = require("../backend/data");
const VERSION_FILE = path.join(getDataDir(), "version.json");
const logger = require("./logger");
const semver = require("semver");
let version;

const getVersion = () => {
  if(!version) {
    refresh();
  }
  return version || { version: "N/A", date: "N/A" };
};

const refresh = () => {
  if (fs.existsSync(VERSION_FILE)) {
    try {
      version = JSON.parse(fs.readFileSync(VERSION_FILE));

      // #692: clean version from build metadata to appear nicely in changelog
      version.version = semver.clean(version.version);
    } catch(error) {
      logger.error("could not parse mtgjson version file " + error);
      version = null;
    }
  }
};

module.exports = {
  getVersion,
  refresh
};
