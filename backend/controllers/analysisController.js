const { extractTextFromPDF } = require("../services/pdfService");

const { analyzeResume } = require("../services/aiService");

const ResumeAnalysis = require("../models/ResumeAnalysis");

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

    const { text, pages } = await extractTextFromPDF(req.file.buffer);

    if (!text || text.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Could not extract enough text from this PDF.",
      });
    }

    console.log("Resume text extracted.");
    console.log("Sending resume to Gemini...");

    const analysis = await analyzeResume(text, jobDescription);

    console.log("Gemini analysis completed.");

    // Save analysis to MongoDB
    const savedAnalysis = await ResumeAnalysis.create({
      userId: req.user._id,

      resumeName: req.file.originalname,

      resumeText: text,

      jobDescription,

      atsScore: analysis.atsScore,

      matchScore: analysis.matchScore,

      skills: analysis.skills,

      matchedKeywords: analysis.matchedKeywords,

      missingKeywords: analysis.missingKeywords,

      missingSkills: analysis.missingSkills,

      strengths: analysis.strengths,

      weaknesses: analysis.weaknesses,

      recommendations: analysis.recommendations,

      summary: analysis.summary,

      keywordCoverage: analysis.keywordCoverage,

      sections: analysis.sections,

      atsChecks: analysis.atsChecks,

      experienceRelevance: analysis.experienceRelevance,

      projectRelevance: analysis.projectRelevance,

      educationRelevance: analysis.educationRelevance,

      bulletPointIssues: analysis.bulletPointIssues,

      improvedBullets: analysis.improvedBullets,
    });

    console.log("Analysis saved:", savedAnalysis._id.toString());

    res.status(201).json({
      success: true,

      message: "Resume analyzed successfully",

      analysisId: savedAnalysis._id,

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
      message: error.message || "Failed to analyze resume",
    });
  }
};

const getAnalysisById = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Get analysis error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get analysis",
    });
  }
};

const getMyAnalyses = async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({
      userId: req.user._id,
    })
      .select("resumeName atsScore matchScore summary createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: analyses.length,
      analyses,
    });
  } catch (error) {
    console.error("Get analyses error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analyses",
    });
  }
};

const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Analysis deleted successfully",
    });
  } catch (error) {
    console.error("Delete analysis error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete analysis",
    });
  }
};

module.exports = {
  uploadResume,
  getAnalysisById,
  getMyAnalyses,
  deleteAnalysis,
};
