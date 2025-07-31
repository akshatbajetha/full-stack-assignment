import { useState, useEffect } from "react";
import { api } from "../services/api";

const ActorSelector = ({ apiKey, onActorSelect }) => {
  const [actors, setActors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedActorId, setSelectedActorId] = useState("");

  useEffect(() => {
    const fetchActors = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.getActors(apiKey);

        if (response.success) {
          // Extract actors from the nested structure
          const actorsList = response.data.data.items || [];
          setActors(actorsList);
        } else {
          setError("Failed to fetch actors");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch actors");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActors();
  }, [apiKey]);

  const handleActorSelect = (actorId) => {
    setSelectedActorId(actorId);
    const selectedActor = actors.find((actor) => actor.id === actorId);
    if (selectedActor) {
      onActorSelect(selectedActor);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-gray-600">Loading actors...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center py-8">
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (actors.length === 0) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Actors Found
          </h3>
          <p className="text-gray-600">
            You don't have any actors available. Create an actor in your Apify
            account first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Select an Actor
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="actorSelect"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Choose an actor to execute:
          </label>
          <select
            id="actorSelect"
            value={selectedActorId}
            onChange={(e) => handleActorSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select an actor...</option>
            {actors.map((actor) => (
              <option key={actor.id} value={actor.id}>
                {actor.title} ({actor.username})
              </option>
            ))}
          </select>
        </div>

        {selectedActorId && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="font-semibold text-blue-800 mb-2">
              Selected Actor:
            </h3>
            <p className="text-blue-700">
              {actors.find((actor) => actor.id === selectedActorId)?.title}
            </p>
            <p className="text-sm text-blue-600 mt-1">ID: {selectedActorId}</p>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          <p>
            Found {actors.length} actor{actors.length !== 1 ? "s" : ""} in your
            account
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActorSelector;
