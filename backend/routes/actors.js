const express = require("express");
const router = express.Router();
const extractApiKey = require("../middleware/auth");
const {
  getActors,
  getActorInputSchema,
  executeActor,
  getRunStatus,
  getRunResults,
} = require("../services/apifyService");

router.get("/", extractApiKey, async (req, res) => {
  try {
    const actors = await getActors(req.apiKey);
    res.json({
      success: true,
      data: actors,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: {
        code: error.status === 401 ? "INVALID_API_KEY" : "FETCH_ACTORS_ERROR",
        message: error.message,
        details: error.details,
      },
    });
  }
});

router.get("/:actorId/input-schema", extractApiKey, async (req, res) => {
  try {
    const actorId = req.params.actorId;
    const inputSchema = await getActorInputSchema(req.apiKey, actorId);
    res.json({
      success: true,
      data: inputSchema,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: {
        code:
          error.status === 401
            ? "INVALID_API_KEY"
            : error.status === 404
            ? "INPUT_SCHEMA_NOT_FOUND"
            : "FETCH_INPUT_SCHEMA_ERROR",
        message: error.message,
        details: error.details,
      },
    });
  }
});

router.post("/:actorId/run", extractApiKey, async (req, res) => {
  try {
    const actorId = req.params.actorId;
    const inputs = req.body;

    const runData = await executeActor(req.apiKey, actorId, inputs);

    res.json({
      success: true,
      data: runData,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: {
        code:
          error.status === 401
            ? "INVALID_API_KEY"
            : error.status === 404
            ? "ACTOR_NOT_FOUND"
            : error.status === 400
            ? "INVALID_INPUTS"
            : "EXECUTION_ERROR",
        message: error.message,
        details: error.details,
      },
    });
  }
});

router.get("/:actorId/runs/:runId/status", extractApiKey, async (req, res) => {
  try {
    const { runId } = req.params;
    const runStatus = await getRunStatus(req.apiKey, runId);
    res.json({
      success: true,
      data: runStatus,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: {
        code:
          error.status === 401
            ? "INVALID_API_KEY"
            : error.status === 404
            ? "RUN_NOT_FOUND"
            : "FETCH_RUN_STATUS_ERROR",
        message: error.message,
        details: error.details,
      },
    });
  }
});

router.get("/:actorId/runs/:runId/results", extractApiKey, async (req, res) => {
  try {
    const { runId } = req.params;
    const results = await getRunResults(req.apiKey, runId);
    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: {
        code:
          error.status === 401
            ? "INVALID_API_KEY"
            : error.status === 404
            ? "RUN_RESULTS_NOT_FOUND"
            : "FETCH_RUN_RESULTS_ERROR",
        message: error.message,
        details: error.details,
      },
    });
  }
});

module.exports = router;
