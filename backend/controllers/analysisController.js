const {
  extractTextFromPDF,
} = require("../services/pdfService");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    console.log("Resume received:", req.file.originalname);
    console.log("File size:", req.file.size);

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

    res.status(200).json({
      success: true,
      message: "Resume uploaded and text extracted successfully",
      resume: {
        name: req.file.originalname,
        size: req.file.size,
        pages,
        text,
      },
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process resume",
    });
  }
};

module.exports = {
  uploadResume,
};