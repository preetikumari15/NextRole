const express = require("express");

const {
  uploadResume,
  getAnalysisById,
  getMyAnalyses,
  deleteAnalysis,
} = require("../controllers/analysisController");

const {
  analysisLimiter,
} = require("../middleware/rateLimitMiddleware");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Create analysis
router.post(
  "/upload",
  protect,
  analysisLimiter,
  upload.single("resume"),
  uploadResume
);

// Get current user's analyses
router.get(
  "/my",
  protect,
  getMyAnalyses
);

// Get one analysis
router.get(
  "/:id",
  protect,
  getAnalysisById
);

// Delete one analysis
router.delete(
  "/:id",
  protect,
  deleteAnalysis
);

module.exports = router;