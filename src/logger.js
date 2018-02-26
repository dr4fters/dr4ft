const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
const { LOGDIR } = require("../config.server");

const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    label({ label: "Dr4ft"}),
    timestamp(),
    myFormat
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: LOGDIR + "error.log", level: "error" }),
    new transports.File({ filename: LOGDIR + "combined.log" }),
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console({
    format: combine(
      label({ label: "Dr4ft"}),
      timestamp(),
      myFormat
    )
  }));
}

module.exports = logger;
