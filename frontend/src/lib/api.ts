export type PredictionInput = {
  age: number; sex: number; cp: number; trestbps: number; 
  chol: number; fbs: number; restecg: number; thalach: number; 
  exang: number; oldpeak: number; slope: number; ca: number; thal: number;
};

export const getPrediction = async (data: PredictionInput) => {
  // Use your actual backend URL from the screenshot
  const BASE_URL = "https://heart-disease-prediction-backend-1ggb.onrender.com";

  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST", // This is the 'Method' the browser was missing
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
  
  // Map 'probability' from Python to 'confidence' for your UI
  return {
    prediction: result.prediction,
    confidence: result.probability, 
  };
};