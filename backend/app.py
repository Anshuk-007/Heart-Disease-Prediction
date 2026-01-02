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
    prediction = int(clf.predict(df)[0])
    probability = float(clf.predict_proba(df)[0][1])
    return prediction, probability


@app.route("/")
def home():
    return jsonify({"status": "API running"})


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json   # <-- JSON input, not form

    prediction, probability = predict_heart_disease(data)

    return jsonify({
        "prediction": prediction,
        "result": "Heart Disease Detected" if prediction == 1 else "No Heart Disease Detected",
        "confidence": round(probability * 100, 2)
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
