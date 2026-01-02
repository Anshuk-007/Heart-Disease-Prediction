// API configuration for Flask backend
// Update this URL to point to your Flask server

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface PredictionInput {
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
}

export interface PredictionResponse {
  prediction: number;
  confidence?: number;
  message?: string;
}

export async function getPrediction(input: PredictionInput): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Prediction failed: ${response.statusText}`);
  }

  return response.json();
}
