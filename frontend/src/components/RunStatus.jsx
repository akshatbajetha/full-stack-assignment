import { useEffect, useState } from "react";
import { api } from "../services/api";

const RunStatus = ({ runId, actorId, apiKey, onStatusChange, onError }) => {
  const [status, setStatus] = useState("READY");
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!runId) return;

    const pollStatus = async () => {
      try {
        const response = await api.getRunStatus(apiKey, actorId, runId);
        const newStatus = response.data.data.status;
        setStatus(newStatus);
        onStatusChange(newStatus);

        // Stop polling if run is finished
        if (
          newStatus === "SUCCEEDED" ||
          newStatus === "FAILED" ||
          newStatus === "ABORTED"
        ) {
          setIsPolling(false);
        }
      } catch (error) {
        onError(error.message);
        setIsPolling(false);
      }
    };

    // Start polling
    setIsPolling(true);
    pollStatus();

    // Set up interval for polling
    const interval = setInterval(pollStatus, 3000); // Poll every 3 seconds

    // Cleanup interval on unmount or when polling stops
    return () => {
      clearInterval(interval);
    };
  }, [runId, actorId, apiKey, onStatusChange, onError]);

  const getStatusColor = () => {
    switch (status) {
      case "READY":
        return "text-blue-600";
      case "RUNNING":
        return "text-yellow-600";
      case "SUCCEEDED":
        return "text-green-600";
      case "FAILED":
      case "ABORTED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "READY":
        return "⏳";
      case "RUNNING":
        return "🔄";
      case "SUCCEEDED":
        return "✅";
      case "FAILED":
      case "ABORTED":
        return "❌";
      default:
        return "❓";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">{getStatusIcon()}</div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Actor Execution Status
          </h2>

          <div className="flex items-center justify-center mb-4">
            {status === "RUNNING" && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            )}
            <span className={`text-lg font-semibold ${getStatusColor()}`}>
              {status}
            </span>
          </div>

          <div className="text-sm text-gray-600 mb-4">Run ID: {runId}</div>

          {status === "RUNNING" && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-blue-800">
                Your actor is currently running. This may take a few minutes
                depending on the task complexity.
              </p>
            </div>
          )}

          {status === "SUCCEEDED" && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800">
                Actor execution completed successfully! Fetching results...
              </p>
            </div>
          )}

          {status === "FAILED" && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">
                Actor execution failed. Please check your inputs and try again.
              </p>
            </div>
          )}

          {status === "ABORTED" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-800">Actor execution was aborted.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RunStatus;
