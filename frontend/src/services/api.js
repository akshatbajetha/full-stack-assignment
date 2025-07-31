const API_BASE_URL = "http://localhost:5000/api";

export const api = {
  validateApiKey: async (apiKey) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Validation failed");
      }

      return data;
    } catch (error) {
      throw new Error(error.message || "Failed to validate API key");
    }
  },

  getActors: async (apiKey) => {
    try {
      const response = await fetch(`${API_BASE_URL}/actors`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to fetch actors");
      }

      return data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch actors");
    }
  },

  getActorInputSchema: async (apiKey, actorId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/actors/${actorId}/input-schema`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to fetch input schema");
      }

      return data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch input schema");
    }
  },

  executeActor: async (apiKey, actorId, inputs) => {
    try {
      const response = await fetch(`${API_BASE_URL}/actors/${actorId}/run`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to execute actor");
      }

      return data;
    } catch (error) {
      throw new Error(error.message || "Failed to execute actor");
    }
  },

  getRunStatus: async (apiKey, runId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/actors/runs/${runId}/status`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to fetch run status");
      }

      return data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch run status");
    }
  },

  getRunResults: async (apiKey, runId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/actors/runs/${runId}/results`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to fetch run results");
      }

      return data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch run results");
    }
  },
};
