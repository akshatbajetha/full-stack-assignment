import { useState } from "react";

const FieldBox = ({ field, onChange }) => {
  const [value, setValue] = useState(field.default || "");

  const handleChange = (newValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  // Check if this is an array of objects with URL properties
  const isUrlObjectArray = () => {
    return (
      field.type === "array" &&
      field.items &&
      field.items.type === "object" &&
      field.items.properties &&
      field.items.properties.url
    );
  };

  const renderInput = () => {
    switch (field.type) {
      case "string":
        if (field.enum) {
          return (
            <select
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select an option...</option>
              {field.enum.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        }
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.default || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case "integer":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(parseInt(e.target.value) || 0)}
            min={field.minimum}
            max={field.maximum}
            placeholder={field.default?.toString() || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case "boolean":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleChange(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-600">Enable this option</span>
          </div>
        );

      case "array":
        // Special handling for arrays of objects with URL properties
        if (isUrlObjectArray()) {
          const urlArray = Array.isArray(value) ? value : [];
          const urlStrings = urlArray.map((item) => item.url || "").join("\n");

          return (
            <div>
              <textarea
                value={urlStrings}
                onChange={(e) => {
                  const urls = e.target.value
                    .split("\n")
                    .map((url) => url.trim())
                    .filter((url) => url)
                    .map((url) => ({ url }));
                  handleChange(urls);
                }}
                placeholder="Enter URLs (one per line)&#10;Example:&#10;https://example.com/page1&#10;https://example.com/page2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">
                Each URL will be converted to: {"{url: 'your-url'}"}
              </p>
            </div>
          );
        }

        // Regular array handling (strings, numbers, etc.)
        return (
          <textarea
            value={Array.isArray(value) ? value.join(", ") : value}
            onChange={(e) => {
              const arrayValue = e.target.value
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item);
              handleChange(arrayValue);
            }}
            placeholder="Enter values separated by commas"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.default || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-800">
          {field.title}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </h3>
      </div>

      <p
        className="text-sm text-gray-600 mb-3"
        dangerouslySetInnerHTML={{ __html: field.description }}
      />

      {renderInput()}

      {field.default !== undefined && (
        <p className="text-xs text-gray-500 mt-2">
          Default: {JSON.stringify(field.default)}
        </p>
      )}

      {field.minimum !== undefined && field.maximum !== undefined && (
        <p className="text-xs text-gray-500 mt-1">
          Range: {field.minimum} - {field.maximum}
        </p>
      )}
    </div>
  );
};

export default FieldBox;
