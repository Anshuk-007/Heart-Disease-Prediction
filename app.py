from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os

app = Flask(__name__)

model = joblib.load("heart_disease_model.joblib")

FEATURES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak",
    "slope", "ca", "thal"
]

@app.route("/", methods=["GET"])
def home():
    return "Heart Disease Prediction API is running"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    df = pd.DataFrame([data], columns=FEATURES)
    prediction = int(model.predict(df)[0])
    probability = float(model.predict_proba(df)[0][1])

    return jsonify({
        "prediction": prediction,
        "probability": probability
    })
@app.route("/routes")
def routes():
    return str(app.url_map)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
