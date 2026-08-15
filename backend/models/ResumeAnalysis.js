const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeName: {
      type: String,
      required: true,
    },

    resumeText: {
      type: String,
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    keywordCoverage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    skills: {
      type: [String],
      default: [],
    },

    matchedKeywords: {
      type: [String],
      default: [],
    },

    missingKeywords: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },

    summary: {
      type: String,
      default: "",
    },

    sections: {
      contact: {
        score: {
          type: Number,
          default: 0,
        },
        feedback: {
          type: String,
          default: "",
        },
      },

      summary: {
        score: {
          type: Number,
          default: 0,
        },
        feedback: {
          type: String,
          default: "",
        },
      },

      experience: {
        score: {
          type: Number,
          default: 0,
        },
        feedback: {
          type: String,
          default: "",
        },
      },

      projects: {
        score: {
          type: Number,
          default: 0,
        },
        feedback: {
          type: String,
          default: "",
        },
      },

      education: {
        score: {
          type: Number,
          default: 0,
        },
        feedback: {
          type: String,
          default: "",
        },
      },

      skills: {
        score: {
          type: Number,
          default: 0,
        },
        feedback: {
          type: String,
          default: "",
        },
      },
    },

    atsChecks: {
      contactInformation: {
        type: Boolean,
        default: false,
      },

      clearSections: {
        type: Boolean,
        default: false,
      },

      measurableAchievements: {
        type: Boolean,
        default: false,
      },

      keywordOptimization: {
        type: Boolean,
        default: false,
      },

      readableStructure: {
        type: Boolean,
        default: false,
      },

      noObviousFormattingIssues: {
        type: Boolean,
        default: false,
      },
    },

    experienceRelevance: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    projectRelevance: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    educationRelevance: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    bulletPointIssues: {
      type: [String],
      default: [],
    },

    improvedBullets: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ResumeAnalysis",
  resumeAnalysisSchema
);