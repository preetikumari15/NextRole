const rateLimit = require("express-rate-limit");

const analysisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many resume analyses. Please try again later.",
  },
});

module.exports = {
  analysisLimiter,
};