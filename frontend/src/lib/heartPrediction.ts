// Heart Disease Risk Assessment
// Based on UCI Heart Disease Dataset features (Cleveland)
// Features in EXACT order as the dataset:
// age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal

export interface HeartDiseaseInput {
  age: number;           // Age in years
  sex: number;           // Sex (1 = male; 0 = female)
  cp: number;            // Chest pain type (1=typical angina, 2=atypical angina, 3=non-anginal, 4=asymptomatic)
  trestbps: number;      // Resting blood pressure (mm Hg on admission)
  chol: number;          // Serum cholesterol (mg/dl)
  fbs: number;           // Fasting blood sugar > 120 mg/dl (1 = true; 0 = false)
  restecg: number;       // Resting ECG (0=normal, 1=ST-T abnormality, 2=LV hypertrophy)
  thalach: number;       // Maximum heart rate achieved
  exang: number;         // Exercise induced angina (1 = yes; 0 = no)
  oldpeak: number;       // ST depression induced by exercise relative to rest
  slope: number;         // Slope of peak exercise ST segment (1=upsloping, 2=flat, 3=downsloping)
  ca: number;            // Number of major vessels (0-3) colored by fluoroscopy
  thal: number;          // Thalassemia (3=normal, 6=fixed defect, 7=reversible defect)
}

export interface PredictionResult {
  prediction: 0 | 1;
  probability: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  riskFactors: string[];
}

// Risk assessment algorithm based on clinical knowledge and feature importance
export function predictHeartDisease(input: HeartDiseaseInput): PredictionResult {
  let riskScore = 0;
  const riskFactors: string[] = [];

  // Age factor (older = higher risk)
  if (input.age > 60) {
    riskScore += 15;
    riskFactors.push('Age over 60 years');
  } else if (input.age > 50) {
    riskScore += 10;
    riskFactors.push('Age over 50 years');
  } else if (input.age > 40) {
    riskScore += 5;
  }

  // Sex factor (male = slightly higher risk statistically)
  if (input.sex === 1) {
    riskScore += 5;
    if (input.age > 45) riskFactors.push('Male over 45');
  }

  // Chest pain type (cp): 1=typical angina, 2=atypical, 3=non-anginal, 4=asymptomatic
  if (input.cp === 1) {
    riskScore += 20;
    riskFactors.push('Typical angina chest pain');
  } else if (input.cp === 2) {
    riskScore += 15;
    riskFactors.push('Atypical angina');
  } else if (input.cp === 3) {
    riskScore += 10;
    riskFactors.push('Non-anginal pain');
  }
  // cp=4 (asymptomatic) adds minimal risk

  // Resting blood pressure (trestbps)
  if (input.trestbps >= 140) {
    riskScore += 15;
    riskFactors.push('High resting blood pressure (≥140 mm Hg)');
  } else if (input.trestbps >= 120) {
    riskScore += 8;
  }

  // Cholesterol (chol)
  if (input.chol >= 240) {
    riskScore += 15;
    riskFactors.push('High serum cholesterol (≥240 mg/dl)');
  } else if (input.chol >= 200) {
    riskScore += 8;
    riskFactors.push('Borderline high cholesterol');
  }

  // Fasting blood sugar (fbs)
  if (input.fbs === 1) {
    riskScore += 10;
    riskFactors.push('Fasting blood sugar > 120 mg/dl');
  }

  // Resting ECG (restecg): 0=normal, 1=ST-T abnormality, 2=LV hypertrophy
  if (input.restecg === 2) {
    riskScore += 15;
    riskFactors.push('Left ventricular hypertrophy on ECG');
  } else if (input.restecg === 1) {
    riskScore += 10;
    riskFactors.push('ST-T wave abnormality on ECG');
  }

  // Maximum heart rate achieved (thalach) - lower = higher risk
  const expectedMaxHR = 220 - input.age;
  const hrPercentage = (input.thalach / expectedMaxHR) * 100;
  if (hrPercentage < 70) {
    riskScore += 15;
    riskFactors.push('Low maximum heart rate achieved');
  } else if (hrPercentage < 85) {
    riskScore += 8;
  }

  // Exercise induced angina (exang)
  if (input.exang === 1) {
    riskScore += 18;
    riskFactors.push('Exercise-induced angina');
  }

  // ST depression (oldpeak)
  if (input.oldpeak >= 2) {
    riskScore += 18;
    riskFactors.push('Significant ST depression (≥2.0)');
  } else if (input.oldpeak >= 1) {
    riskScore += 10;
    riskFactors.push('Moderate ST depression');
  }

  // Slope of peak exercise ST segment: 1=upsloping, 2=flat, 3=downsloping
  if (input.slope === 3) {
    riskScore += 15;
    riskFactors.push('Downsloping ST segment');
  } else if (input.slope === 2) {
    riskScore += 8;
    riskFactors.push('Flat ST segment');
  }
  // slope=1 (upsloping) is normal

  // Number of major vessels (ca) - very important feature
  if (input.ca >= 3) {
    riskScore += 25;
    riskFactors.push('3 major vessels colored by fluoroscopy');
  } else if (input.ca === 2) {
    riskScore += 18;
    riskFactors.push('2 major vessels colored by fluoroscopy');
  } else if (input.ca === 1) {
    riskScore += 10;
    riskFactors.push('1 major vessel colored by fluoroscopy');
  }

  // Thalassemia (thal): 3=normal, 6=fixed defect, 7=reversible defect
  if (input.thal === 7) {
    riskScore += 20;
    riskFactors.push('Reversible thalassemia defect');
  } else if (input.thal === 6) {
    riskScore += 12;
    riskFactors.push('Fixed thalassemia defect');
  }
  // thal=3 (normal) adds no risk

  // Normalize score to probability (0-100)
  const maxPossibleScore = 200;
  const probability = Math.min(Math.round((riskScore / maxPossibleScore) * 100), 99);

  // Determine risk level and prediction
  let riskLevel: PredictionResult['riskLevel'];
  let prediction: 0 | 1;

  if (probability >= 60) {
    riskLevel = 'Very High';
    prediction = 1;
  } else if (probability >= 40) {
    riskLevel = 'High';
    prediction = 1;
  } else if (probability >= 25) {
    riskLevel = 'Moderate';
    prediction = 0;
  } else {
    riskLevel = 'Low';
    prediction = 0;
  }

  return {
    prediction,
    probability,
    riskLevel,
    riskFactors: riskFactors.slice(0, 5),
  };
}
