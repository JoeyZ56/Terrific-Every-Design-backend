# Middleware

## Cloudinary (cloudinary.js)

### 1. Importing Cloudinary’s SDK:

    const cloudinary = require("cloudinary").v2;

### 2. Loading Environment Variables:

    require("dotenv").config();

• This loads environment variables from a .env file into process.env, ensuring that sensitive information (like API keys) isn’t hardcoded.

### 3. Configuring Cloudinary:

    cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    });

• This initializes Cloudinary with your credentials stored in the .env file.

• cloud_name: Identifies your Cloudinary account.

• api_key: Used for authentication.

• api_secret: Ensures secure API requests.

### 4. Exporting Cloudinary:

    module.exports = cloudinary;

• This makes the configured Cloudinary instance available for use in other parts of your application.

## Setup

### 1. Install Cloudinary’s Node SDK if not already installed:

    npm install cloudinary dotenv

### 2. Create a .env file in the root of your project and add:

    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

### 3. Use the configured Cloudinary instance by importing it:

    const cloudinary = require("../middleware/cloudinary");

#### Usage Example

Upload an image:

    const result = await cloudinary.uploader.upload("path/to/image.jpg", {
    folder: "uploads",
    });
    console.log(result.secure_url);

---

## Multer + Cloudinary (multer.js)

### 1. Importing Dependencies

    const multer = require("multer");
    const { CloudinaryStorage } = require("multer-storage-cloudinary");
    const cloudinary = require("./cloudinary");

• multer: Middleware for handling file uploads in Node.js.

• CloudinaryStorage: A special storage engine that allows Multer to upload files directly to Cloudinary.

• cloudinary: Importing the previously configured Cloudinary instance.

### 2. Setting Up Cloudinary Storage

    const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploaded_images",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    },
    });

• This creates a new storage instance for Multer that automatically uploads files to Cloudinary.

• folder: "uploaded_images" → All uploaded files are stored in a Cloudinary folder named uploaded_images.

• allowed_formats → Restricts uploads to specific image types (JPG, JPEG, PNG, GIF, WEBP).

### 3. Creating Multer Upload Middleware

    const upload = multer({ storage });

• This initializes Multer with CloudinaryStorage, meaning any file uploaded using upload will be directly sent to Cloudinary instead of being stored locally.

### 4. Exporting the Middleware

    module.exports = upload;

• This allows the middleware to be used wherever file uploads are needed.

## Setup

### 1. Install required packages:

    npm install multer multer-storage-cloudinary

2. Ensure Cloudinary is configured in cloudinary.js (see Cloudinary README).

3. Use the upload middleware in your routes.

## Usage

### Single Image Upload

    router.post("/upload", upload.single("image"), (req, res) => {
    res.json({ imageUrl: req.file.path });
    });

• upload.single("image") → Uploads one image.

### Multiple Image Upload

    router.post("/uploads", upload.array("images", 5), (req, res) => {
    const imageUrls = req.files.map(file => file.path);
    res.json({ imageUrls });
    });

• upload.array("images", 5) → Allows uploading up to 5 images.

#### Notes

• Uploaded images are stored in Cloudinary under the "uploaded_images"folder.

• Allowed formats: JPG, JPEG, PNG, GIF, WEBP.

• req.file.path (for single uploads) or req.files[i].path (for multiple
uploads) contains the Cloudinary image URL.

---

## Nodemailer

### 1. Importing Dependencies

    const nodemailer = require("nodemailer");
    require("dotenv").config();

• nodemailer → A Node.js package for sending emails.

• dotenv.config() → Loads environment variables from a .env file.

### 2. Creating the Transporter

    const transporter = nodemailer.createTransport({
     service: "gmail",
     auth: {
        user: process.env.SERVER_EMAIL,
     pass: process.env.EMAIL_PASSWORD,
    },
    });

• service: "gmail" → Uses Gmail as the email provider.

• auth → Reads the email credentials from environment variables:

• process.env.SERVER_EMAIL → The email that will send messages.

• process.env.EMAIL_PASSWORD → The email account’s App Password (not the regular password, for security reasons).

🔹 _Important: If using Gmail, you need to enable App Passwords_

### 3. Exporting the Transporter

    module.exports = transporter;

• This makes the configured Nodemailer transporter available throughout your app.

## Usage

Send an Email:

    const transporter = require("../middleware/nodemailer");

    const mailOptions = {
    from: process.env.SERVER_EMAIL,
    to: "recipient@example.com",
    subject: "Test Email",
    text: "Hello! This is a test email from Nodemailer.",
    };

    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Error sending email:", error);
    } else {
        console.log("Email sent:", info.response);
    }
    });

#### Notes

• Emails are sent via Gmail.

• The sender’s email credentials should be stored in environment variables for security.

• For Gmail accounts, an App Password may be required instead of the regular password.

• Use HTML templates instead of plain text for rich email formatting.
