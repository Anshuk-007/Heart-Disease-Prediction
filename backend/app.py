from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load the model
model = joblib.load('heart_disease_model.joblib')

# These are the 13 exact features from your notebook in order
FEATURE_COLUMNS = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 
    'restecg', 'thalach', 'exang', 'oldpeak', 
    'slope', 'ca', 'thal'
]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Convert incoming JSON into a DataFrame with correct column names
        # This prevents the "mismatch" error
        input_df = pd.DataFrame([data], columns=FEATURE_COLUMNS)
        
        # Ensure numeric types (floats/ints)
        for col in FEATURE_COLUMNS:
            input_df[col] = pd.to_numeric(input_df[col])

        # Logic from your notebook's predict_heart_disease function
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1] # Prob of positive class

        # Formatting response to match your notebook's output
        result = "Heart disease predicted" if prediction == 1 else "No heart disease predicted"
        confidence = f"{probability*100:.0f}% confidence"
        
        return jsonify({
            'prediction': int(prediction),
            'result': result,
            'confidence': confidence,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)