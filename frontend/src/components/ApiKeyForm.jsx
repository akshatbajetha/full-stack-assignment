import { useState } from "react";
import { api } from "../services/api";

const ApiKeyForm = ({ onSuccess }) => {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      setError("Please enter your Apify API key");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await api.validateApiKey(apiKey);

      if (response.success) {
        sessionStorage.setItem("apifyApiKey", apiKey);
        sessionStorage.setItem("apifyUserName", response.data.data.username);
        onSuccess(apiKey, response.data, response.data.data.username);
      } else {
        setError(response.error?.message || "Validation failed");
      }
    } catch (err) {
      setError(err.message || "Failed to validate API key");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Apify Integration
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="apiKey"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Apify API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Apify API key"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !apiKey.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Validating...
            </div>
          ) : (
            "Validate API Key"
          )}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Don't have an API key? Get one from your Apify account settings.</p>
      </div>
    </div>
  );
};

export default ApiKeyForm;
