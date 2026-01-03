from flask import Flask, request, jsonify
from flask_cors import CORS  # Required for React to talk to Flask
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # This enables Cross-Origin Resource Sharing

# Load the model
clf = joblib.load("heart_disease_model.joblib")

FEATURES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak",
    "slope", "ca", "thal"
]

@app.route("/", methods=["GET"])
def home():
    return "Heart Disease Prediction API is Live"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        
        # 1. Ensure all values are converted to float/int to match notebook precision
        # This prevents string-to-number errors that change confidence scores
        numeric_data = {k: float(v) for k, v in data.items()}
        
        # 2. Force the DataFrame to use the EXACT column order from your notebook
        # Using [FEATURES] at the end ensures the data aligns with the model's expectations
        df = pd.DataFrame([numeric_data])[FEATURES]
        
        # 3. Get prediction and probability
        pred = int(clf.predict(df)[0])
        prob = float(clf.predict_proba(df)[0][1])

        return jsonify({
            "prediction": pred,
            "probability": prob
        })
    except Exception as e:
        print(f"Prediction Error: {e}") # Log the error to your terminal
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)