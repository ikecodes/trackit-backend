"use strict";
const app = require("./src/app");
const db = require("./src/db/db");
const dotenv = require("dotenv");
const logger = require("./src/services/logger");

dotenv.config();

process.on("uncaughtException", (err) => {
  logger.error(err.name, err.message);
  logger.error("UNCAUGHT EXCEPTION 😁");
  logger.error("Stack trace:", err.stack);
  process.exit(1);
});

// Ports
const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`App running on port ${port}...`);
  // connect to database
  db();
});

process.on("unhandledRejection", (err) => {
  logger.error(err.name, err.message);
  logger.error("UNHANDLED REJECTION 😁");
  app.close(() => {
    process.exit(1);
  });
});
