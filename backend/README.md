❤️ Heart Disease Prediction

An end-to-end machine learning web application that predicts the presence of heart disease based on patient health parameters.  
The project includes a trained ML model served via a Flask API and a modern React-based frontend.



✨ Features
- Predicts whether a person has heart disease (binary classification)
- Returns prediction along with confidence score
- Clean separation of backend (ML + API) and frontend (UI)
- Model trained and evaluated using real-world dataset



🧠 Tech Stack

🤖 Machine Learning
- Logistic Regression (scikit-learn)
- NumPy, Pandas
- Model persistence using joblib

🧪 Backend
- Python
- Flask
- Flask-CORS (for frontend-backend communication)

🎨 Frontend
- React
- Vite
- Tailwind CSS
- Generated and customized using Lovable AI



🗂️ Project Structure

Heart-Disease-Prediction/
├── backend/ # Flask API + trained ML model
│ ├── app.py
│ └── heart_disease_model.joblib
│
├── frontend/ # React + Vite frontend
│ ├── src/
│ ├── public/
│ ├── index.html
│ ├── package.json
│ └── vite.config.ts
│
├── notebooks/ # Jupyter notebook for training & evaluation
│ └── Heart_Disease_Prediction.ipynb
│
├── data/ # Dataset
│ └── heart-disease.csv
│
├── requirements.txt # Backend dependencies
├── README.md
└── .gitignore




⚙️ How the System Works

1. User enters health parameters in the frontend UI
2. Frontend sends a POST request to the Flask backend
3. Backend loads the trained ML model
4. Model predicts:
   - Presence of heart disease (0 or 1)
   - Confidence score
5. Result is returned and displayed to the user



▶️ How to Run Locally

### Prerequisites
- Python 3.9+
- Node.js (LTS)
- npm



🐍 Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
