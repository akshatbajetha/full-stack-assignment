import { useState, useEffect } from "react";
import ApiKeyForm from "./components/ApiKeyForm";
import ActorSelector from "./components/ActorSelector";

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

  const handleActorSelect = (actor) => {
    setSelectedActor(actor);
    setCurrentStep("form");
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
                Authenticated with Apify as {userName}
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

          {/* Dynamic Form - Show when actor is selected */}
          {currentStep === "form" && selectedActor && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Configure {selectedActor.title}
                </h2>
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Selected: {selectedActor.title}
                  </p>
                  <p className="text-gray-600">
                    Loading form... (Next step to implement)
                  </p>
                </div>
              </div>
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
}

export default App;
