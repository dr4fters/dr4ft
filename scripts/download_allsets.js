const fs = require("fs");
const path = require("path");
const https = require("https");
const unzip = require("unzipper");
const semver = require("semver");
const updateDatabase = require("./update_database");
const downloadBoosterRules = require("./download_booster_rules");
const logger = require("../backend/logger");
const { refresh: refreshVersion } = require("../backend/mtgjson");
const {getDataDir} = require("../backend/data");

const mtgJsonURL = "https://www.mtgjson.com/files/AllSetFiles.zip";
const versionURL = "https://www.mtgjson.com/files/version.json";
const setsVersion = path.join(getDataDir(), "version.json");

const isVersionNewer = ({ version: remoteVer }, { version: currentVer }) => (
  semver.compareBuild(remoteVer, currentVer) > -1
);

const isVersionUpToDate = () => (
  new Promise((resolve, reject) => {
    https.get(versionURL, res => {
      let json = "";
      res.on("data", chunk => { json += chunk; });
      res.on("end", function () {
        try {
          const remoteVersion = JSON.parse(json);

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
        .pipe(unzip.Parse())
        .on("entry", (entry) => {
          const setsDataDir = path.join(getDataDir(), "sets");
          if (!fs.existsSync(setsDataDir)) {
            fs.mkdirSync(setsDataDir);
          }
          const file = fs.createWriteStream(path.join(setsDataDir, `${entry.path}`));
          entry.pipe(file)
            .on("finish", file.close);
        })
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
    await downloadBoosterRules();
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
