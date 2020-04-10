const fs = require("fs");
const {reloadData} = require("./data");
const logger = require("./logger");

/**
 * Add a watch on fs to get updated even from external process
 */
fs.watch("data", (eventType, filename) => {
  logger.debug(`filewatch - ${eventType} on ${filename}`);
  reloadData(filename);
});
