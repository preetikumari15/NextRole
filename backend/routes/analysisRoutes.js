const express = require("express");

const {
  uploadResume,
  getAnalysisById,
} = require("../controllers/analysisController");

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

router.get(
  "/:id",
  protect,
  getAnalysisById
);

module.exports = router;