const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;
const { logger: config } = require("../config");

const logger = createLogger({
  level: config.level,
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss,SSSZZ" }),
    printf(info => `${info.timestamp} [${info.level.toUpperCase()}] [${info.id || "GLOBAL"}] ${info.message}`),
  ),
});

if (config.consoleEnabled) {
  logger.add(new transports.Console());
}

if (config.file.enabled) {
  logger.add(new transports.File({
    tailable: true,
    ...config.file,
  }));
}

module.exports = logger;
