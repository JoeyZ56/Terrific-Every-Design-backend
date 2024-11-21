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
app.use((req, res, next) => {
  console.log(`Incoming requests: ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
connectDB();

//Routes
app.use("/requests", requestRoute);

app.get("/", (req, res) => {
  res.status(200).send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
