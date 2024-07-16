const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Ticket Schema
const ticketSchema = new mongoose.Schema({
  name: String,
  email: String,
  contactNumber: String,
  address: String,
  city: String,
  zipCode: String,
  state: String,
  equipment: String,
  moduleSize: String,
  numberOfModules: String,
  inverterManufacturer: String,
  numberOfInverters: String,
  sizeOfInverter: String,
  systemSize: String,
  electricalService: String,
  meterLocation: String,
  mspManufacturer: String,
  mspBuzzRate: String,
  mainBreakerSize: String,
  mpu: Boolean,
  roofingInfo: String,
  batteryInfo: String,
  specialRequest: String,
  designType: String,
  priority: String,
});

const Ticket = mongoose.model("Ticket", ticketSchema);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Server email for SMTP authentication
    pass: process.env.EMAIL_PASSWORD, // Server email password (app password if 2FA is enabled)
  },
});

app.post("/submit", async (req, res) => {
  const formData = req.body;

  console.log("Received form data:", formData);

  const ticket = new Ticket(formData);

  try {
    await ticket.save();

    console.log("Form data saved to database");

    // Prepare email options
    const mailOptions = {
      from: formData.email, // User's email from the form data
      to: process.env.BUSINESS_EMAIL, // Contractor's email address
      subject: "New Ticket Submission",
      text: `A new ticket has been submitted by ${formData.name} (${
        formData.email
      }): \n\n${JSON.stringify(formData, null, 2)}`,
    };

    console.log("Sending email to:", process.env.BUSINESS_EMAIL); // Debug log

    // Send email using Nodemailer
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error submitting form");
        return;
      }
      console.log("Email sent: " + info.response);
      res.status(200).send("Form submitted successfully");
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error submitting form");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
