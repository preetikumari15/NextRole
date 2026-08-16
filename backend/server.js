const dotenv = require("dotenv");

// IMPORTANT: Load .env BEFORE importing routes/services
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const helmet = require("helmet");


const app = express();

// Connect MongoDB
connectDB();

app.use(helmet());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },
    credentials: true,
  })
);

app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ResumeAI API is running",
  });
});

// Health
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ResumeAI backend is healthy",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);

app.use(
  (err, req, res, next) => {
    console.error(
      "Unhandled server error:",
      err
    );

    res.status(
      err.statusCode || 500
    ).json({
      success: false,
      message:
        err.message ||
        "Internal server error",
    });
  }
);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});