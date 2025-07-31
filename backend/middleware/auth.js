function extractApiKey(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: {
        code: "NO_API_KEY",
        message: "Authorization header with Bearer token required",
      },
    });
  }
  req.apiKey = authHeader.replace("Bearer ", "").trim();
  next();
}

module.exports = extractApiKey;
