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

//CORS Middleware
app.use(
  cors({
    origin: "https://terrific-every-design-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use((req, res, next) => {
  console.log(`Incoming requests: ${req.method} ${req.url}`);
  next();
});

//Debugging logs
app.use((req, res, next) => {
  console.log(`Request Headers:`, req.headers);
  next();
});

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`Response Headers:`, res.getHeaders());
  });
  next();
});

// MongoDB Connection
connectDB();

//Routes
app.use("/requests", requestRoute);

app.get("/", (req, res) => {
  res.status(200).send("Backend is running!");
});

//Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
