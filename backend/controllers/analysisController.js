const {
  extractTextFromPDF,
} = require("../services/pdfService");

const {
  analyzeResume,
} = require("../services/aiService");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    const { jobDescription } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job description is required",
      });
    }

    console.log(
      "Processing resume:",
      req.file.originalname
    );

    const { text, pages } = await extractTextFromPDF(
      req.file.buffer
    );

    if (!text || text.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract enough text from this PDF. Please upload a text-based PDF.",
      });
    }

    console.log("Resume text extracted.");
    console.log("Pages:", pages);
    console.log("Sending resume to AI...");

    const analysis = await analyzeResume(
      text,
      jobDescription
    );

    console.log("AI analysis completed.");

    res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",

      resume: {
        name: req.file.originalname,
        size: req.file.size,
        pages,
      },

      analysis,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);

    res.status(500).json({
      success: false,
      message:
        error.message || "Failed to analyze resume",
    });
  }
};

module.exports = {
  uploadResume,
};