from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load the model
# NOTE: If you used a scaler in your notebook, you MUST load it here too.
# Example: scaler = joblib.load("scaler.joblib")
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
        
        # 1. Prepare Data
        numeric_data = {k: float(v) for k, v in data.items()}
        df = pd.DataFrame([numeric_data])[FEATURES]
        
        # CRITICAL: If your notebook used scaling, uncomment the lines below:
        # df_scaled = scaler.transform(df)
        # prediction_input = df_scaled
        # ELSE (if no scaling was used):
        prediction_input = df

        # 2. Get Prediction and Probability
        pred = int(clf.predict(prediction_input)[0])
        proba = clf.predict_proba(prediction_input)[0] # Get array like [0.1, 0.9]

        # 3. FIX FOR CONFIDENCE SCORE
        # Instead of always taking index 1, we take the max value (the winner)
        confidence_score = float(np.max(proba)) 

        return jsonify({
            "prediction": pred,
            # Return percentage (e.g., 88.5 instead of 0.885)
            "confidence": round(confidence_score * 100, 2) 
        })

    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)