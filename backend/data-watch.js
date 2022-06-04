const fs = require("fs");
const {reloadData} = require("./core/data");
const logger = require("./core/logger");

/**
 * Add a watch on fs to get updated even from external process
 */
fs.watch("data", (eventType, filename) => {
  logger.debug(`filewatch - ${eventType} on ${filename}`);
  reloadData(filename);
});
