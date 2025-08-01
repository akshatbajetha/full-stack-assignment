import { useState } from "react";
import FieldBox from "./FieldBox";

const DynamicForm = ({ schema, selectedActor, onSubmit }) => {
  const [formData, setFormData] = useState({});

  // Parse schema fields
  const fields = Object.entries(schema.properties).map(([key, field]) => ({
    name: key,
    ...field,
    required: schema.required?.includes(key),
  }));

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Configure {selectedActor.title}
        </h2>

        <div className="space-y-4 mb-6">
          {fields.map((field) => (
            <FieldBox
              key={field.name}
              field={field}
              onChange={(value) => handleFieldChange(field.name, value)}
            />
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Execute Actor
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
