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
        
        # Convert incoming JSON to DataFrame
        df = pd.DataFrame([data], columns=FEATURES)
        
        # Get prediction (0 or 1)
        pred = int(clf.predict(df)[0])
        
        # Get probability (confidence)
        # predict_proba returns a list of lists: [[prob_0, prob_1]]
        # We take prob_1 (the chance of having heart disease)
        prob = float(clf.predict_proba(df)[0][1])

        return jsonify({
            "prediction": pred,
            "probability": prob  # We will map this to 'confidence' in the frontend
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)