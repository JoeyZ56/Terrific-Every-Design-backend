const express = require("express");
const upload = require("../middleware/multer");
const {
  submitRequest,
  getRequests,
} = require("../controllers/requestController");

const router = express.Router();

router.post("/submit-request", upload.array("fileUpload", 20), submitRequest);
router.get("/get-requests", getRequests);

module.exports = router;
