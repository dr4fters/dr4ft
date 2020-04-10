const joi = require("@hapi/joi");

const envVarsSchema = joi.object({
  LOGGER_LEVEL: joi.string()
    .allow("error", "warn", "info", "verbose", "debug", "silly")
    .default("debug"),
  LOGGER_FILE_ENABLED: joi.boolean()
    .truthy("TRUE")
    .truthy("true")
    .falsy("FALSE")
    .falsy("false")
    .default(true),
  LOGGER_FILE_PATH: joi.string()
    .default("./data/log/app.log"),
  LOGGER_FILE_MAX_SIZE: joi.number()
    .default(100000000), // 100 MB
  LOGGER_FILE_MAX_FILES: joi.number()
    .default(20),
  LOGGER_CONSOLE_ENABLED: joi.boolean()
    .truthy("TRUE")
    .truthy("true")
    .falsy("FALSE")
    .falsy("false")
    .default(true),
}).unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  level: envVars.LOGGER_LEVEL,
  file: {
    enabled: envVars.LOGGER_FILE_ENABLED,
    filename: envVars.LOGGER_FILE_PATH,
    maxsize: envVars.LOGGER_FILE_MAX_SIZE,
    maxFiles: envVars.LOGGER_FILE_MAX_FILES,
  },
  consoleEnabled: envVars.LOGGER_CONSOLE_ENABLED,
};

module.exports = config;
