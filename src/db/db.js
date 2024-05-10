const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

module.exports = async () => {
  const Db = process.env.REMOTE_DATABASE || process.env.LOCAL_DATABASE;
  await mongoose
    .connect(Db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((err) => {
      console.error("Error connecting to database", err);
    });
};
