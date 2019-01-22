const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;
const { LOGDIR } = require("../config.server");
const fs = require( "fs" );

if ( !fs.existsSync( LOGDIR ) ) {
  fs.mkdirSync( LOGDIR );
}

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss,SSSZZ" }),
    printf(info => `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}`),
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

// If we're not in production then log to the `console`
if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console());
}

module.exports = logger;
