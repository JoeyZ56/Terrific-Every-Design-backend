const Request = require("../models/request");
const transporter = require("../config/email");
require("dotenv").config();

//multer packages
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array("fileUpload");

// Utility function to convert array fields to comma-separated strings
const convertArrayFields = (formData, fields) => {
  fields.forEach((field) => {
    if (Array.isArray(formData[field])) {
      formData[field] = formData[field].join(",");
    }
  });
};

exports.submitRequest = async (req, res) => {
  const files = req.files || [];
  let attachments = files.map((file) => ({
    filename: file.originalname,
    content: file.buffer,
    encoding: "base64",
    contentType: file.mimetype,
  }));

  const formData = req.body;
  console.log("Received request: ", formData);

  // Convert array fields to comma-separated strings
  const arrayFields = [
    "roofingInfo",
    "specialRequest",
    "designType",
    "priority",
  ];
  convertArrayFields(formData, arrayFields);

  //Include file upload if it exists
  // const file = req.file;
  // let attachments = [];
  // if (file) {
  //   attachments = [
  //     {
  //       filename: file.originalname,
  //       content: file.buffer, //.toString("base64")
  //       encoding: "base64",
  //       contentType: file.mimetype,
  //     },
  //   ];
  // }

  const request = new Request(formData);

  try {
    await request.save();
    console.log("Request saved to database");

    const mailOptions = {
      from: formData.email,
      to: process.env.BUSINESS_EMAIL,
      subject: "New Solar Request",
      text: `You have received a new solar request from ${formData.name}. (${
        formData.email
      }): \n\n${JSON.stringify(formData, null, 2)}`,
      attachments: attachments,
    };

    console.log("Sending email to:", process.env.BUSINESS_EMAIL);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        return res
          .status(500)
          .json({ message: "Server error submitting form" });
      }
      console.log("Email sent: ", info.response);
      return res.status(200).json({ message: "Form submitted successfully" });
    });
  } catch (error) {
    console.log("Server error submitting form: ", error);
    res.status(500).json({ message: "Server error submitting form" });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error fetching requests for graph" });
  }
};

exports.upload = upload;
