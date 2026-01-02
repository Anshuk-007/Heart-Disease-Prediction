from flask import Flask, render_template, request
import joblib
import pandas as pd

app = Flask(__name__)

# Load trained model
clf = joblib.load("heart_disease_model.joblib")

# Feature order MUST match training
FEATURES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak",
    "slope", "ca", "thal"
]

def predict_heart_disease(input_data):
    input_df = pd.DataFrame([input_data], columns=FEATURES)
    prediction = clf.predict(input_df)[0]
    probability = clf.predict_proba(input_df)[0][1]
    return prediction, probability

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = {
        "age": int(request.form["age"]),
        "sex": int(request.form["sex"]),
        "cp": int(request.form["cp"]),
        "trestbps": int(request.form["trestbps"]),
        "chol": int(request.form["chol"]),
        "fbs": int(request.form["fbs"]),
        "restecg": int(request.form["restecg"]),
        "thalach": int(request.form["thalach"]),
        "exang": int(request.form["exang"]),
        "oldpeak": float(request.form["oldpeak"]),
        "slope": int(request.form["slope"]),
        "ca": int(request.form["ca"]),
        "thal": int(request.form["thal"])
    }

    prediction, probability = predict_heart_disease(data)

    if prediction == 1:
        result = "Heart Disease Detected"
        color = "red"
    else:
        result = "No Heart Disease Detected"
        color = "green"

    confidence = f"{probability * 100:.0f}%"

    return render_template(
        "index.html",
        result=result,
        confidence=confidence,
        color=color
    )

if __name__ == "__main__":
    app.run(debug=True)
