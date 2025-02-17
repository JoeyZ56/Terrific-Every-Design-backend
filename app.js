const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./lib/mongoDB");
const requestRoute = require("./routes/requestRoute");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Increase request body size limit to handle large images
app.use(express.json({ limit: "25mb" })); // Allow large JSON payloads
app.use(express.urlencoded({ limit: "25mb", extended: true })); // Allow large form data

// Middleware
app.use(bodyParser.json());

//CORS Middleware
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       const allowedOrigins = [
//         "https://www.terrificeverydesign.com",
//         "http://localhost:5100",
//       ];

//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true); // Allow the request
//       } else {
//         callback(new Error("Not allowed by CORS")); // Block the request
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

//Test CORs
app.use(
  cors({
    origin: "*", // Allow all origins for testing
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
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log(`Request Headers:`, req.headers);
  console.log(`Request Size: ${req.headers["content-length"] || 0} bytes`);
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
