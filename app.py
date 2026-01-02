from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os

app = Flask(__name__)

clf = joblib.load("heart_disease_model.joblib")

FEATURES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak",
    "slope", "ca", "thal"
]

def predict_heart_disease(input_data):
    df = pd.DataFrame([input_data], columns=FEATURES)
    pred = clf.predict(df)[0]
    prob = clf.predict_proba(df)[0][1]
    return int(pred), float(prob)

@app.route("/")
def home():
    return "API running"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    prediction, probability = predict_heart_disease(data)

    return jsonify({
        "prediction": prediction,
        "probability": probability
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
