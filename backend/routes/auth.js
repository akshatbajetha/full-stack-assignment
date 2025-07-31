const express = require("express");
const router = express.Router();
const extractApiKey = require("../middleware/auth");
const ApifyService = require("../services/apifyService");

router.post("/validate", extractApiKey, async (req, res) => {
  try {
    const userInfo = await ApifyService.validateApiKey(req.apiKey);
    res.json({
      success: true,
      data: userInfo,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: {
        code: error.status === 401 ? "INVALID_API_KEY" : "VALIDATION_ERROR",
        message: error.message,
        details: error.details,
      },
    });
  }
});

module.exports = router;
