import { useState, useEffect } from "react";
import ApiKeyForm from "./components/ApiKeyForm";
import ActorSelector from "./components/ActorSelector";
import DynamicForm from "./components/DynamicForm";
import RunStatus from "./components/RunStatus";
import ResultsDisplay from "./components/ResultsDisplay";
import { api } from "./services/api";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState("auth"); // auth, actors, form, results

  // Actor selection state
  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorsError, setActorsError] = useState("");
  const [userName, setUserName] = useState(
    sessionStorage.getItem("apifyUserName") || ""
  );

  // Schema state
  const [inputSchema, setInputSchema] = useState(null);
  const [isLoadingSchema, setIsLoadingSchema] = useState(false);

  // Execution state
  const [isExecuting, setIsExecuting] = useState(false);
  const [runId, setRunId] = useState(null);
  // const [actorId, setActorId] = useState(null);
  const [runStatus, setRunStatus] = useState(null);
  const [runResults, setRunResults] = useState(null);
  const [executionError, setExecutionError] = useState(null);

  // Check if API key exists in sessionStorage on component mount
  useEffect(() => {
    const storedApiKey = sessionStorage.getItem("apifyApiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsAuthenticated(true);
      setCurrentStep("actors");
    }
  }, []);

  const handleAuthSuccess = (newApiKey, userData, userName) => {
    setApiKey(newApiKey);
    setIsAuthenticated(true);
    setError("");
    setCurrentStep("actors");
    setUserName(userName);
  };

  const handleActorSelect = async (actor) => {
    setSelectedActor(actor);
    setIsLoadingSchema(true);
    setError("");

    try {
      const response = await api.getActorInputSchema(apiKey, actor.id);
      setInputSchema(response.data.inputSchema);
      setCurrentStep("form");
    } catch (err) {
      setError("Failed to load actor schema: " + err.message);
    } finally {
      setIsLoadingSchema(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsExecuting(true);
      setExecutionError(null);
      setRunId(null);
      setRunStatus(null);
      setRunResults(null);

      // Execute the actor
      const response = await api.executeActor(
        apiKey,
        selectedActor.id,
        formData
      );
      const newRunId = response.data.data.id;

      setRunId(newRunId);
      setCurrentStep("results");
    } catch (err) {
      setExecutionError("Failed to execute actor: " + err.message);
      setIsExecuting(false);
    }
  };

  const handleStatusChange = (status) => {
    setRunStatus(status);

    if (status === "SUCCEEDED") {
      setIsExecuting(false);
    } else if (status === "FAILED" || status === "ABORTED") {
      setIsExecuting(false);
      setExecutionError("Actor execution failed");
    }
  };

  const handleExecutionError = (error) => {
    setExecutionError(error);
    setIsExecuting(false);
  };

  const handleRunAgain = () => {
    setCurrentStep("form");
    setRunId(null);
    setRunStatus(null);
    setRunResults(null);
    setExecutionError(null);
    setIsExecuting(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("apifyApiKey");
    setApiKey("");
    setIsAuthenticated(false);
    setUserName("");
    setCurrentStep("auth");
    setError("");
    setSelectedActor(null);
    setActors([]);
    setInputSchema(null);
    setRunId(null);
    setRunStatus(null);
    setRunResults(null);
    setExecutionError(null);
    setIsExecuting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Apify Integration
          </h1>
          <p className="text-gray-600">
            Execute Apify actors with dynamic input schemas
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {currentStep === "auth" && (
            <ApiKeyForm onSuccess={handleAuthSuccess} />
          )}

          {isAuthenticated && (
            <div className="text-center">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Authenticated with Apify as{" "}
                <span className="font-bold underline ml-1">{userName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Logout
              </button>
            </div>
          )}

          {/* Actor Selection - Always show when authenticated */}
          {(currentStep === "actors" || currentStep === "form") && (
            <ActorSelector apiKey={apiKey} onActorSelect={handleActorSelect} />
          )}

          {/* Loading Schema */}
          {isLoadingSchema && (
            <div className="text-center py-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-600">
                  Loading actor configuration...
                </span>
              </div>
            </div>
          )}

          {/* Dynamic Form - Show when actor is selected and schema is loaded */}
          {currentStep === "form" &&
            selectedActor &&
            inputSchema &&
            !isLoadingSchema && (
              <DynamicForm
                schema={inputSchema}
                selectedActor={selectedActor}
                onSubmit={handleFormSubmit}
              />
            )}

          {/* Run Status - Show when execution is in progress */}
          {currentStep === "results" && runId && isExecuting && (
            <RunStatus
              runId={runId}
              actorId={selectedActor.id}
              apiKey={apiKey}
              onStatusChange={handleStatusChange}
              onError={handleExecutionError}
            />
          )}

          {/* Results Display - Show when execution is complete */}
          {currentStep === "results" &&
            runId &&
            !isExecuting &&
            runStatus === "SUCCEEDED" && (
              <ResultsDisplay
                runId={runId}
                actorId={selectedActor.id}
                apiKey={apiKey}
                selectedActor={selectedActor}
                onRunAgain={handleRunAgain}
              />
            )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {actorsError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{actorsError}</p>
            </div>
          )}

          {executionError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{executionError}</p>
              <button
                onClick={handleRunAgain}
                className="mt-2 bg-blue-600 text-white py-1 px-4 rounded text-sm hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
