# Request controller

## Function: submitRequest(req, res)

#### Overview

This function handles the form submission process:

1. Receives data from the frontend.
2. Uploads images to Cloudinary and retrieves their URLs.
3. Saves the request to MongoDB.
4. Sends an email containing form details and uploaded image URLs.

#### 1. Convert String Booleans to Actual Boolean Values

    req.body.mpu = req.body.mpu === "true";

    req.body.deRate = req.body.deRate === "true";

    req.body.electricalEngineeringReport =
    req.body.electricalEngineeringReport === "true";

    req.body.structuralEngineeringReport =
    req.body.structuralEngineeringReport === "true";

• Why? The frontend sends boolean values as strings ("true" or "false"), but the database requires actual booleans (true or false).

• This ensures correct data formatting before saving to MongoDB.

#### 2. Handle File Uploads Using Cloudinary

    const files = req.files || [];

• If no files are uploaded, _req.files_ will be undefined. This prevents errors by defaulting to an empty array.

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

**What’s Happening Here?**

• We iterate over each uploaded file and process it asynchronously using _Promise.all()_.

**Each file is:**

- 1. Sent to Cloudinary for storage.

- 2. Uploaded into the uploaded_images folder in your Cloudinary account.

- 3. If successful, Cloudinary returns a secure URL (_result.secure_url_) for that image.

- 4. If an error occurs, it logs the error and rejects the promise.

Why Use _.upload_stream()_?

• Multer stores files as buffers in memory instead of disk storage.

• _upload_stream()_ is needed to handle buffer-based file uploads.

• We manually send the file’s buffer to Cloudinary using:

    uploadStream.end(file.buffer);

• **_This ensures seamless image uploads without writing to disk._**

#### 3. Store Uploaded Image URLs in the Request

    req.body.fileUpload = uploadedImages;

• Instead of storing raw image files, we store Cloudinary URLs.

• These URLs can be used to display images later in the frontend or email.

#### 4. Convert Arrays to Strings

    const arrayFields = [
    "roofingInfo",
    "specialRequest",
    "designType",
    "priority",
    ];
    convertArrayFields(req.body, arrayFields);

• Why? MongoDB does not accept direct array inputs in certain cases.

• We use a utility function (_convertArrayFields_) to convert arrays into comma-separated strings.

#### 5. Save Data to MongoDB

    const request = new Request(req.body);
    await request.save();
    console.log("Request saved to database");

• A new request document is created using Request(_req.body_).

• MongoDB saves the form data along with uploaded Cloudinary URLs.

#### 6. Send Email with Form Data & Image URLs

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

**The email contains:**

• Form details in JSON format.

• Image URLs as attachments (Cloudinary links).

• The recipient (contractor) will see the images in the email or click on the links.

#### 7. Send the Email

    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Error sending email: ", error);
        return res.status(500).json({ message: "Server error submitting form",  error });
    }
    console.log("Email sent: ", info.response);
    return res.status(200).json({ message: "Form submitted successfully" });
    });

• Uses Nodemailer to send an email.

• If sending fails, it logs the error and returns a 500 response.

• If successful, it sends a confirmation response.

## Function: getRequests

### Purpose of the Function

    exports.getRequests = async (req, res) => {
        try {
            const requests = await Request.find().sort({ createdAt: -1 });
            res.status(200).json(requests);
        } catch (error) {
            res.status(500).json({
            message: "Server error fetching requests for graph", error });
        }
            };

• This function fetches all submitted form requests stored in the database.

• The results are sorted in descending order based on the createdAt timestamp, meaning the most recent requests appear first.

• It is typically used to display all requests on a dashboard or in analytics.

#### Database Query (Request.find())

    const requests = await Request.find();

• This retrieves all the documents from the Request collection in MongoDB.

#### Sorting Data (sort({ createdAt: -1 }))

    .sort({ createdAt: -1 })

• The sort() method ensures that results are ordered by createdAt.

• -1 means descending order (newest requests first).

• 1 would mean ascending order (oldest first).
