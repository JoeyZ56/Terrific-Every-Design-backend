const express = require("express");
const router = express.Router();
const {
  submitRequest,
  getRequests,
  upload,
} = require("../controllers/requestController");

router.post("/submit-request", upload, submitRequest);
router.get("/get-requests", getRequests);

module.exports = router;
