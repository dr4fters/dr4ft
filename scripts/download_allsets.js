const fs = require("fs");
const path = require("path");
const https = require("https");
const unzip = require("unzipper");
const semver = require("semver");
const updateDatabase = require("./update_database");
const logger = require("../backend/logger");
const { refresh: refreshVersion } = require("../backend/mtgjson");
const {getDataDir} = require("../backend/data");

const mtgJsonURL = "https://www.mtgjson.com/api/v5/AllSetFiles.zip";
const versionURL = "https://www.mtgjson.com/api/v5/Meta.json";
const setsVersion = path.join(getDataDir(), "version.json");

const setsDataDir = path.join(getDataDir(), "sets");

const isVersionNewer = ({ version: remoteVer }, { version: currentVer }) => (
  semver.compareBuild(remoteVer, currentVer) > 0
);

const isVersionUpToDate = () => (
  new Promise((resolve, reject) => {
    https.get(versionURL, res => {
      let json = "";
      res.on("data", chunk => { json += chunk; });
      res.on("end", function () {
        try {
          const remoteVersion = JSON.parse(json).data;

          if (fs.existsSync(setsVersion)) {
            const version = JSON.parse(fs.readFileSync(setsVersion, "UTF-8"));
            if (!isVersionNewer(remoteVersion, version)) {
              return resolve([true, null]);
            }
          }

          const version = JSON.stringify(remoteVersion);
          logger.info(`Found a new version ${version}`);
          return resolve([false, version]);
        } catch(err) {
          logger.error(`Error while fetching version to ${versionURL}: ${err.stack}`);
          reject();
        }
      });
    })
      .on("error", reject);
  })
);

const fetchZip = () => (
  new Promise((resolve, reject) => {
    https.get(mtgJsonURL, response => {
      logger.info("Updating AllSets.json");
      response
        .pipe(unzip.Extract({ path: setsDataDir, concurrency: 4 }))
        .on("finish", resolve)
        .on("error", reject);
    });
  }));

const download = async () => {
  logger.info("Checking if AllSets.json is up to date");
  const [isUpToDate, version] = await isVersionUpToDate();
  if (!isUpToDate) {
    await fetchZip();
    logger.info("Fetch AllSets.json finished. Updating the cards and sets data");
    updateDatabase();
    logger.info("Update DB finished");
    fs.writeFileSync(setsVersion, version);
    refreshVersion();
  } else {
    logger.info("AllSets.json is up to date");
  }
};

module.exports = {
  download
};

//Allow this script to be called directly from commandline.
if (!module.parent) {
  download();
}
