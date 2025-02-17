const Request = require("../models/request");
const transporter = require("../middleware/nodemailer");
const cloudinary = require("../middleware/cloudinary");
const convertArrayFields = require("../utils/formUtils");
require("dotenv").config();

exports.submitRequest = async (req, res) => {
  console.log("Received Request:", req.body);
  console.log("Uploaded Files:", req.files);

  // Convert string booleans ('true'/'false') back to actual booleans
  req.body.mpu = req.body.mpu === "true";
  req.body.deRate = req.body.deRate === "true";
  req.body.electricalEngineeringReport =
    req.body.electricalEngineeringReport === "true";
  req.body.structuralEngineeringReport =
    req.body.structuralEngineeringReport === "true";

  console.log("Converted Request Body:", req.body);

  try {
    const files = req.files || [];

    // Upload images to Cloudinary and get URLs
    const uploadedImages = await Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "uploaded_images" },
            (error, result) => {
              if (error) {
                console.error("Error uploading to Cloudinary:", error);
                reject(error);
              } else {
                resolve(result.secure_url); // Store Cloudinary URL
              }
            }
          );
          uploadStream.end(file.buffer); // Send file buffer to Cloudinary
        });
      })
    );

    // Add Cloudinary URLs to request body
    req.body.fileUpload = uploadedImages;

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

    // Email setup with Cloudinary URLs
    const mailOptions = {
      from: req.body.email,
      to: process.env.BUSINESS_EMAIL,
      subject: "New Solar Request",
      text: `You have received a new solar request from ${req.body.name} (${
        req.body.email
      }): \n\n${JSON.stringify(req.body, null, 2)}`,
      attachments: uploadedImages.map((url) => ({
        filename: url.split("/").pop(),
        path: url, // Attach as URL link
      })),
    };

    console.log("Sending email to:", process.env.BUSINESS_EMAIL);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        return res
          .status(500)
          .json({ message: "Server error submitting form", error });
      }
      console.log("Email sent: ", info.response);
      return res.status(200).json({ message: "Form submitted successfully" });
    });
  } catch (error) {
    console.log("Server error submitting form: ", error);
    res.status(500).json({ message: "Server error submitting form", error });
  }
};

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
