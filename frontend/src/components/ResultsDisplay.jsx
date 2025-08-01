import { useState, useEffect } from "react";
import { api } from "../services/api";

const ResultsDisplay = ({
  runId,
  actorId,
  apiKey,
  selectedActor,
  onRunAgain,
}) => {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching results for runId: " + runId);
        console.log("Fetching results for actorId: " + actorId);
        // console.log("Fetching results for apiKey: " + apiKey);
        const response = await api.getRunResults(apiKey, actorId, runId);
        setResults(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (runId) {
      fetchResults();
    }
  }, [runId, actorId, apiKey]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const downloadResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedActor.name}-results.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Check if results contain error information
  const hasErrors = () => {
    if (!results || !Array.isArray(results)) return false;

    return results.some(
      (item) =>
        item &&
        typeof item === "object" &&
        (item.error || item.errorDescription || item.errorMessage)
    );
  };

  // Get error details for display
  const getErrorDetails = () => {
    if (!results || !Array.isArray(results)) return [];

    return results
      .filter(
        (item) =>
          item &&
          typeof item === "object" &&
          (item.error || item.errorDescription || item.errorMessage)
      )
      .map((item) => ({
        url: item.url || "Unknown URL",
        error: item.error || "Unknown error",
        description:
          item.errorDescription ||
          item.errorMessage ||
          "No description available",
      }));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Fetching results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="text-red-600 text-4xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Error Loading Results
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={onRunAgain}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if results contain errors
  if (hasErrors()) {
    const errorDetails = getErrorDetails();

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Execution Completed with Errors
            </h2>
            <p className="text-gray-600">
              {selectedActor.title} completed but encountered some issues
            </p>
          </div>

          {/* Error Summary */}
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-red-800">Error Summary</h3>
                <p className="text-red-700 text-sm">
                  {errorDetails.length} items had errors
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(results, null, 2))
                  }
                  className="bg-red-600 text-white py-1 px-3 rounded text-sm hover:bg-red-700"
                >
                  Copy
                </button>
                <button
                  onClick={downloadResults}
                  className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
                >
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Error Details */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Error Details</h3>
            <div className="space-y-3">
              {errorDetails.map((errorItem, index) => (
                <div
                  key={index}
                  className="bg-red-50 border border-red-200 rounded-md p-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">
                        URL: {errorItem.url}
                      </p>
                      <p className="text-sm text-red-700">
                        Error: {errorItem.error}
                      </p>
                      <p className="text-xs text-red-600">
                        {errorItem.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Results Display */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Complete Results Data
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              New Actor
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success case (no errors)
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="text-green-600 text-4xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Execution Results
          </h2>
          <p className="text-gray-600">
            {selectedActor.title} completed successfully
          </p>
        </div>

        {/* Results Summary */}
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-green-800">Results Summary</h3>
              <p className="text-green-700 text-sm">
                {Array.isArray(results)
                  ? `${results.length} items retrieved`
                  : "Results available"}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  copyToClipboard(JSON.stringify(results, null, 2))
                }
                className="bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700"
              >
                Copy
              </button>
              <button
                onClick={downloadResults}
                className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
              >
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Results Data</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            New Actor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
