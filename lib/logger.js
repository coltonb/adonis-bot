require("dotenv").config();
const winston = require("winston");
const config = require("./config.js");

module.exports = winston.createLogger({
  level: config.settings.LOGGING_LEVEL,
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
