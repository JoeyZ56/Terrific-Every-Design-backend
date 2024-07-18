const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const requestRoute = require("./routes/requestRoute");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
connectDB();

//Routes
app.use("/request", requestRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
