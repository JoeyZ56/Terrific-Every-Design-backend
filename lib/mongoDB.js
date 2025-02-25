const mongoose = require("mongoose");
require("dotenv").config();

const conncectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI );
    console.log("Connected to Mongo Database");
  } catch (error) {
    console.error("Error connecting to Mongo Database: ", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = conncectDB;
