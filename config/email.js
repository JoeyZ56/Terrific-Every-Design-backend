const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SERVER_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = transporter;
