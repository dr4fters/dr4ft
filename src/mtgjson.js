const fs = require('fs');
const VERSION_FILE = 'data/version.json';
const logger = require('./logger');
let version;

const getVersion = () => {
  if(!version) {
    refresh();
  }
  return version || { version: "N/A", date: "N/A" };
}

const refresh = () => {
  if (fs.existsSync(VERSION_FILE)) {
    try {
      version = JSON.parse(fs.readFileSync(VERSION_FILE));
    } catch(error) {
      logger.error("could not parse mtgjson version file " + error);
    }
  }
}

module.exports = {
  getVersion,
  refresh
}
