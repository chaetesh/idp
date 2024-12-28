import { useState } from "react";

const symptoms = [
  "COUGH",
  "MUSCLE_ACHES",
  "TIREDNESS",
  "SORE_THROAT",
  "RUNNY_NOSE",
  "STUFFY_NOSE",
  "FEVER",
  "NAUSEA",
  "VOMITING",
  "DIARRHEA",
  "SHORTNESS_OF_BREATH",
  "DIFFICULTY_BREATHING",
  "LOSS_OF_TASTE",
  "LOSS_OF_SMELL",
  "ITCHY_NOSE",
  "ITCHY_EYES",
  "ITCHY_MOUTH",
  "ITCHY_INNER_EAR",
  "SNEEZING",
  "PINK_EYE",
];

function App() {
  const [formData, setFormData] = useState(
    symptoms.reduce((acc, symptom) => ({ ...acc, [symptom]: 0 }), {})
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when prediction is triggered
    try {
      const response = await fetch("http://localhost:3000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    } finally {
      setLoading(false); // Set loading to false once the prediction is done
    }
  };

  const handleOptionChange = (symptom, value) => {
    setFormData({ ...formData, [symptom]: value });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">
        Disease Predictor
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl"
      >
        <p className="text-lg font-semibold text-gray-700 mb-4">
          Select "Yes" or "No" for each symptom:
        </p>
        {symptoms.map((symptom) => (
          <div key={symptom} className="flex items-center justify-between mb-4">
            <span className="text-gray-800">{symptom.replace("_", " ")}</span>
            <div className="flex gap-4">
              <button
                type="button"
                className={`px-4 py-2 rounded ${
                  formData[symptom] === 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => handleOptionChange(symptom, 1)}
              >
                Yes
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded ${
                  formData[symptom] === 0
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => handleOptionChange(symptom, 0)}
              >
                No
              </button>
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="mt-4 w-full bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600 disabled:opacity-50"
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin border-t-4 border-blue-600 border-solid rounded-full w-6 h-6 mr-2"></div>
              Loading...
            </div>
          ) : (
            "Predict"
          )}
        </button>
      </form>

      {/* Display result if available */}
      {result && (
        <div className="bg-white shadow-lg rounded-lg p-6 mt-6 w-full max-w-2xl">
          <h2 className="text-lg font-bold text-green-600 mb-4">
            Prediction Results:
          </h2>
          <p>
            <strong>Type:</strong> {result.TYPE}
          </p>
          <p>
            <strong>Season:</strong> {result.Seasons}
          </p>
          <p>
            <strong>Precautions:</strong> {result.Precautions}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
