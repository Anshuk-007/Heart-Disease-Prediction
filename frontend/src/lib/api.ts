export type PredictionInput = {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
};

export const getPrediction = async (data: PredictionInput) => {
  // IMPORTANT: Replace the URL below with your ACTUAL Render Backend URL
  // Example: "https://heart-disease-api-xyz.onrender.com"
  const BASE_URL = "https://your-backend-service-name.onrender.com";

  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to get prediction");
  }

  const result = await response.json();
  
  // We map 'probability' from Python to 'confidence' for your React component
  return {
    prediction: result.prediction,
    confidence: result.probability, 
  };
};