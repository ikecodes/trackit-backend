const { createLogger, format, transports } = require("winston");
require("dotenv").config();

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.File({
      filename: "./logs/all-logs.log",
      json: false,
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new transports.Console({
      level: "debug",
    }),
  ],
});

module.exports = logger;
