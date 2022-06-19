/* eslint no-console: "off" */
"use strict";

const getVersionInfo = () => {
  if (process.env.VERSION_INFO) {
    return process.env.VERSION_INFO;
  }

  try {
    const execSync = require("child_process").execSync;
    return execSync("git describe --tags")
      .toString()
      .trim();
  } catch(err) {
    console.log(err);
    return "noVersion";
  }
};

const versionInfo = getVersionInfo();
const versionInfoParts = versionInfo.split("-");

const VERSION =
  versionInfoParts.length === 3

  // Show the number of commits past the most recent tag, and the commit hash
  // identifier. For example, `v2.0.0+3 (123abc)` indicates three commits past
  // version 2.0.0, at commit `123abc`. (In the `git-describe` output, there is
  // always a `g` before the commit hash, which stands for 'git', so we remove
  // that.)
    ? versionInfoParts[2].slice(1)

    // If there is no tag, just display the commit hash.
    : versionInfo;

module.exports = VERSION;
