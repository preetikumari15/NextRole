const { GoogleGenAI, Type } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is missing. Check backend/.env"
  );
}

const ai = new GoogleGenAI({
  apiKey,
});

const analyzeResume = async (
  resumeText,
  jobDescription
) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: `
Analyze this resume against the job description.

====================
RESUME
====================

${resumeText}

====================
JOB DESCRIPTION
====================

${jobDescription}

====================
TASK
====================

Perform a detailed ATS and job-match analysis.

Do not invent candidate information.

Evaluate:

1. ATS compatibility
2. Job match
3. Keyword coverage
4. Skills
5. Resume sections
6. Experience relevance
7. Project relevance
8. Education relevance
9. ATS formatting/readability
10. Bullet point quality
11. Strengths
12. Weaknesses
13. Recommendations

For improvedBullets, rewrite weak resume bullets into stronger achievement-oriented bullets.

Only rewrite bullets when there is enough information in the resume.

Do not invent numbers or achievements.
`,

    config: {
      systemInstruction: `
You are an expert ATS resume analyzer, recruiter and career coach.

Be objective and specific.

ATS SCORE:
Evaluate formatting, structure, readability, keywords,
section organization and ATS compatibility.

MATCH SCORE:
Evaluate how closely the candidate's actual resume
matches the job description.

KEYWORD COVERAGE:
Estimate the percentage of important job-description
keywords that are represented meaningfully in the resume.

SECTION SCORES:
Each section score must be between 0 and 100.

ATS CHECKS:
Return true only when the resume clearly satisfies
the condition.

IMPORTANT:
Never invent experience, technologies, achievements,
education or numbers.

If something is not present, identify it as missing.

Return only JSON.
`,

      responseMimeType: "application/json",

      responseSchema: {
        type: Type.OBJECT,

        properties: {
          atsScore: {
            type: Type.NUMBER,
          },

          matchScore: {
            type: Type.NUMBER,
          },

          keywordCoverage: {
            type: Type.NUMBER,
          },

          summary: {
            type: Type.STRING,
          },

          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },

          matchedKeywords: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },

          missingKeywords: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },

          missingSkills: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },

          strengths: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },

          weaknesses: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },

          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },

          sections: {
            type: Type.OBJECT,

            properties: {
              contact: {
                type: Type.OBJECT,
                properties: {
                  score: {
                    type: Type.NUMBER,
                  },
                  feedback: {
                    type: Type.STRING,
                  },
                },
                required: ["score", "feedback"],
              },

              summary: {
                type: Type.OBJECT,
                properties: {
                  score: {
                    type: Type.NUMBER,
                  },
                  feedback: {
                    type: Type.STRING,
                  },
                },
                required: ["score", "feedback"],
              },

              experience: {
                type: Type.OBJECT,
                properties: {
                  score: {
                    type: Type.NUMBER,
                  },
                  feedback: {
                    type: Type.STRING,
                  },
                },
                required: ["score", "feedback"],
              },

              projects: {
                type: Type.OBJECT,
                properties: {
                  score: {
                    type: Type.NUMBER,
                  },
                  feedback: {
                    type: Type.STRING,
                  },
                },
                required: ["score", "feedback"],
              },

              education: {
                type: Type.OBJECT,
                properties: {
                  score: {
                    type: Type.NUMBER,
                  },
                  feedback: {
                    type: Type.STRING,
                  },
                },
                required: ["score", "feedback"],
              },

              skills: {
                type: Type.OBJECT,
                properties: {
                  score: {
                    type: Type.NUMBER,
                  },
                  feedback: {
                    type: Type.STRING,
                  },
                },
                required: ["score", "feedback"],
              },
            },

            required: [
              "contact",
              "summary",
              "experience",
              "projects",
              "education",
              "skills",
            ],
          },

          atsChecks: {
            type: Type.OBJECT,

            properties: {
              contactInformation: {
                type: Type.BOOLEAN,
              },

              clearSections: {
                type: Type.BOOLEAN,
              },

              measurableAchievements: {
                type: Type.BOOLEAN,
              },

              keywordOptimization: {
                type: Type.BOOLEAN,
              },

              readableStructure: {
                type: Type.BOOLEAN,
              },

              noObviousFormattingIssues: {
                type: Type.BOOLEAN,
              },
            },

            required: [
              "contactInformation",
              "clearSections",
              "measurableAchievements",
              "keywordOptimization",
              "readableStructure",
              "noObviousFormattingIssues",
            ],
          },

          experienceRelevance: {
            type: Type.NUMBER,
          },

          projectRelevance: {
            type: Type.NUMBER,
          },

          educationRelevance: {
            type: Type.NUMBER,
          },

          bulletPointIssues: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },

          improvedBullets: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },

        required: [
          "atsScore",
          "matchScore",
          "keywordCoverage",
          "summary",
          "skills",
          "matchedKeywords",
          "missingKeywords",
          "missingSkills",
          "strengths",
          "weaknesses",
          "recommendations",
          "sections",
          "atsChecks",
          "experienceRelevance",
          "projectRelevance",
          "educationRelevance",
          "bulletPointIssues",
          "improvedBullets",
        ],
      },
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini response:", response.text);

    throw new Error(
      "Gemini returned invalid JSON"
    );
  }
};

module.exports = {
  analyzeResume,
};