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

@app.route("/", methods=["GET"])
def home():
    return "API running"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    df = pd.DataFrame([data], columns=FEATURES)
    pred = int(clf.predict(df)[0])
    prob = float(clf.predict_proba(df)[0][1])

    return jsonify({
        "prediction": pred,
        "probability": prob
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
