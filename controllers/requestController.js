const Request = require("../models/request");
const transporter = require("../middleware/nodemailer");
const cloudinary = require("../middleware/cloudinary");
const convertArrayFields = require("../utils/formUtils");
require("dotenv").config();

// submitting request function
exports.submitRequest = async (req, res) => {
  // Convert string booleans ('true'/'false') back to actual booleans
  req.body.mpu = req.body.mpu === "true";
  req.body.deRate = req.body.deRate === "true";
  req.body.electricalEngineeringReport =
    req.body.electricalEngineeringReport === "true";
  req.body.structuralEngineeringReport =
    req.body.structuralEngineeringReport === "true";

  try {
    // Extract uploaded image URLs directly from request body
    let uploadedImages = [];
    try {
      uploadedImages = req.body.fileUpload ? JSON.parse(req.body.fileUpload) : [];
    } catch (error) {
      console.error("Error parsing fileUpload:", error);
    }

    console.log("Raw uploaded images:", uploadedImages);

    // Ensure `req.body.fileUpload` is stored as an array
    req.body.fileUpload = uploadedImages;

    console.log("Final Processed fileUpload in Backend:", req.body.fileUpload);

    // Convert array fields to comma-separated strings
    const arrayFields = [
      "roofingInfo",
      "specialRequest",
      "designType",
      "priority",
    ];
    convertArrayFields(req.body, arrayFields);

    // Save request to MongoDB
    const request = new Request(req.body);
    await request.save();
    console.log("Request saved to database");

    const emailBody = `
    <h2>New Solar Request</h2>
    <p>You have received a new request from <strong>${
      req.body.name
    }</strong> (<a href="mailto:${req.body.email}">${req.body.email}</a>)</p>
  
    <h3>Uploaded Files:</h3>
    ${uploadedImages.length > 0 ? `<ul>` + 
      uploadedImages.map(url => `<li><a href="${url}" target="_blank">${url}</a></li>`).join("") + `</ul>`
      : "<p>No files uploaded.</p>"}
  
    <h3>Request Details:</h3>
    <pre>${JSON.stringify(req.body, null, 2)}</pre>
  `;

    // Email setup with Cloudinary URLs
    const mailOptions = {
      from: req.body.email,
      to: process.env.BUSINESS_EMAIL,
      subject: "New Solar Request",
      html: emailBody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        return res
          .status(500)
          .json({ message: "Server error submitting form", error });
      }
      return res.status(200).json({ message: "Form submitted successfully" });
    });
  } catch (error) {
    console.log("Server error submitting form: ", error);
    res.status(500).json({ message: "Server error submitting form", error });
  }
};


// Sending requests numbers to graph
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error fetching requests for graph", error });
  }
};
