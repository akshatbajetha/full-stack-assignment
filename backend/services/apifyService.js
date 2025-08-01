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

async function getActors(apiKey) {
  if (!apiKey) {
    throw { status: 401, message: "API key is required" };
  }
  try {
    const response = await axios.get("https://api.apify.com/v2/acts", {
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
      message: "Failed to fetch actors",
      details: error.message,
    };
  }
}

async function getActorInputSchema(apiKey, actorId) {
  if (!apiKey) {
    throw { status: 401, message: "API key is required" };
  }
  if (!actorId) {
    throw { status: 400, message: "Actor ID is required" };
  }
  try {
    const response = await axios.get(
      `https://api.apify.com/v2/acts/${actorId}/builds/default/openapi.json`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const inputSchema = response.data.components?.schemas?.inputSchema;

    if (!inputSchema) {
      throw { status: 404, message: "Input schema not found for this actor" };
    }

    return {
      inputSchema,
    };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw { status: 401, message: "Invalid API key" };
    }
    if (error.response && error.response.status === 404) {
      throw { status: 404, message: "Actor input schema not found" };
    }
    throw {
      status: 500,
      message: "Failed to fetch actor input schema",
      details: error.message,
    };
  }
}

async function executeActor(apiKey, actorId, inputs) {
  if (!apiKey) {
    throw { status: 401, message: "API key is required" };
  }
  if (!actorId) {
    throw { status: 400, message: "Actor ID is required" };
  }
  try {
    const response = await axios.post(
      `https://api.apify.com/v2/acts/${actorId}/runs`,
      inputs,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw { status: 401, message: "Invalid API key" };
    }
    if (error.response && error.response.status === 404) {
      throw { status: 404, message: "Actor not found" };
    }
    if (error.response && error.response.status === 400) {
      throw {
        status: 400,
        message: "Invalid input parameters",
        details: error.response.data,
      };
    }
    throw {
      status: 500,
      message: "Failed to execute actor",
      details: error.message,
    };
  }
}

async function getRunStatus(apiKey, runId) {
  if (!apiKey) {
    throw { status: 401, message: "API key is required" };
  }
  if (!runId) {
    throw { status: 400, message: "Run ID is required" };
  }
  try {
    const response = await axios.get(
      `https://api.apify.com/v2/actor-runs/${runId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw { status: 401, message: "Invalid API key" };
    }
    if (error.response && error.response.status === 404) {
      throw { status: 404, message: "Run not found" };
    }
    throw {
      status: 500,
      message: "Failed to fetch run status",
      details: error.message,
    };
  }
}

async function getRunResults(apiKey, runId) {
  if (!apiKey) {
    throw { status: 401, message: "API key is required" };
  }
  if (!runId) {
    throw { status: 400, message: "Run ID is required" };
  }
  try {
    const response = await axios.get(
      `https://api.apify.com/v2/actor-runs/${runId}/dataset/items`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw { status: 401, message: "Invalid API key" };
    }
    if (error.response && error.response.status === 404) {
      throw { status: 404, message: "Run results not found" };
    }
    throw {
      status: 500,
      message: "Failed to fetch run results",
      details: error.message,
    };
  }
}

module.exports = {
  validateApiKey,
  getActors,
  getActorInputSchema,
  executeActor,
  getRunStatus,
  getRunResults,
};
