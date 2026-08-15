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

const analyzeResume = async (resumeText, jobDescription) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: `
Analyze the following resume against the provided job description.

You are an expert ATS resume analyzer and technical recruiter.

Do not invent any information about the candidate.

RESUME:

${resumeText}

JOB DESCRIPTION:

${jobDescription}
`,

    config: {
      systemInstruction: `
You are an expert ATS resume analyzer.

Evaluate the resume against the job description.

Return accurate, objective and actionable results.

Rules:
- atsScore must be 0-100.
- matchScore must be 0-100.
- Only identify skills actually supported by the resume.
- matchedKeywords must be relevant keywords appearing in both the resume and job description.
- missingKeywords should contain important job-description keywords absent or weakly represented in the resume.
- missingSkills should contain important job requirements not demonstrated by the resume.
- Strengths must be specific.
- Weaknesses must be actionable.
- Recommendations must be practical.
- Never invent experience.
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
        },

        required: [
          "atsScore",
          "matchScore",
          "summary",
          "skills",
          "matchedKeywords",
          "missingKeywords",
          "missingSkills",
          "strengths",
          "weaknesses",
          "recommendations",
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
    console.error("Gemini returned:", response.text);
    throw new Error("Gemini returned invalid JSON");
  }
};

module.exports = {
  analyzeResume,
};