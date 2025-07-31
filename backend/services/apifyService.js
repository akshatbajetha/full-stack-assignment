const axios = require("axios");

async function validateApiKey(apiKey) {
  if (!apiKey) {
    throw { status: 401, message: "API key is required" };
  }
  try {
    const response = await axios.get("https://api.apify.com/v2/users/me", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw { status: 401, message: "Invalid API key" };
    }
    throw {
      status: 500,
      message: "Failed to validate API key",
      details: error.message,
    };
  }
}

module.exports = { validateApiKey };
