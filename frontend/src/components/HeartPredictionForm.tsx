import { useState } from 'react';
import { Heart, Activity, Droplets, Zap, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HeartDiseaseInput, PredictionResult, predictHeartDisease } from '@/lib/heartPrediction';
import PredictionResultCard from './PredictionResultCard';

const HeartPredictionForm = () => {
  const [formData, setFormData] = useState<HeartDiseaseInput>({
    age: 50,
    sex: 1,
    cp: 4,           // Default: asymptomatic
    trestbps: 120,
    chol: 200,
    fbs: 0,
    restecg: 0,
    thalach: 150,
    exang: 0,
    oldpeak: 0,
    slope: 1,        // Default: upsloping (normal)
    ca: 0,
    thal: 3,         // Default: normal
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof HeartDiseaseInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const prediction = predictHeartDisease(formData);
    setResult(prediction);
    setIsLoading(false);
  };

  const handleReset = () => {
    setResult(null);
    setFormData({
      age: 50,
      sex: 1,
      cp: 4,
      trestbps: 120,
      chol: 200,
      fbs: 0,
      restecg: 0,
      thalach: 150,
      exang: 0,
      oldpeak: 0,
      slope: 1,
      ca: 0,
      thal: 3,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {result ? (
        <PredictionResultCard result={result} onReset={handleReset} />
      ) : (
        <Card className="border-0 shadow-2xl bg-card">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
              Heart Disease Risk Assessment
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground max-w-xl mx-auto">
              Enter your health parameters below. All 13 clinical features from the UCI Heart Disease dataset are analyzed.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <Activity className="w-5 h-5" />
                  <h3>Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-foreground font-medium">Age (years)</Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="bg-background border-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sex" className="text-foreground font-medium">Sex</Label>
                    <Select
                      value={formData.sex.toString()}
                      onValueChange={(value) => handleInputChange('sex', parseInt(value))}
                    >
                      <SelectTrigger className="bg-background border-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="0">Female (0)</SelectItem>
                        <SelectItem value="1">Male (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <AlertCircle className="w-5 h-5" />
                  <h3>Chest Pain & Angina</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cp" className="text-foreground font-medium">Chest Pain Type (cp)</Label>
                    <Select
                      value={formData.cp.toString()}
                      onValueChange={(value) => handleInputChange('cp', parseInt(value))}
                    >
                      <SelectTrigger className="bg-background border-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="1">1 - Typical Angina</SelectItem>
                        <SelectItem value="2">2 - Atypical Angina</SelectItem>
                        <SelectItem value="3">3 - Non-anginal Pain</SelectItem>
                        <SelectItem value="4">4 - Asymptomatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exang" className="text-foreground font-medium">Exercise Induced Angina (exang)</Label>
                    <Select
                      value={formData.exang.toString()}
                      onValueChange={(value) => handleInputChange('exang', parseInt(value))}
                    >
                      <SelectTrigger className="bg-background border-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="0">0 - No</SelectItem>
                        <SelectItem value="1">1 - Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <Droplets className="w-5 h-5" />
                  <h3>Blood Pressure, Cholesterol & Blood Sugar</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trestbps" className="text-foreground font-medium">Resting Blood Pressure (trestbps) - mm Hg</Label>
                    <Input
                      id="trestbps"
                      type="number"
                      min="80"
                      max="220"
                      value={formData.trestbps}
                      onChange={(e) => handleInputChange('trestbps', e.target.value)}
                      className="bg-background border-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chol" className="text-foreground font-medium">Serum Cholesterol (chol) - mg/dl</Label>
                    <Input
                      id="chol"
                      type="number"
                      min="100"
                      max="600"
                      value={formData.chol}
                      onChange={(e) => handleInputChange('chol', e.target.value)}
                      className="bg-background border-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fbs" className="text-foreground font-medium">Fasting Blood Sugar &gt; 120 mg/dl (fbs)</Label>
                    <Select
                      value={formData.fbs.toString()}
                      onValueChange={(value) => handleInputChange('fbs', parseInt(value))}
                    >
                      <SelectTrigger className="bg-background border-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="0">0 - False (≤120 mg/dl)</SelectItem>
                        <SelectItem value="1">1 - True (&gt;120 mg/dl)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* ECG & Heart Rate */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <Zap className="w-5 h-5" />
                  <h3>ECG Results & Heart Rate</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="restecg" className="text-foreground font-medium">Resting ECG Results (restecg)</Label>
                    <Select
                      value={formData.restecg.toString()}
                      onValueChange={(value) => handleInputChange('restecg', parseInt(value))}
                    >
                      <SelectTrigger className="bg-background border-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="0">0 - Normal</SelectItem>
                        <SelectItem value="1">1 - ST-T Wave Abnormality</SelectItem>
                        <SelectItem value="2">2 - Left Ventricular Hypertrophy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thalach" className="text-foreground font-medium">Maximum Heart Rate Achieved (thalach)</Label>
                    <Input
                      id="thalach"
                      type="number"
                      min="60"
                      max="220"
                      value={formData.thalach}
                      onChange={(e) => handleInputChange('thalach', e.target.value)}
                      className="bg-background border-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oldpeak" className="text-foreground font-medium">ST Depression (oldpeak)</Label>
                    <Input
                      id="oldpeak"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={formData.oldpeak}
                      onChange={(e) => handleInputChange('oldpeak', e.target.value)}
                      className="bg-background border-input"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Cardiac Indicators */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <Heart className="w-5 h-5" />
                  <h3>ST Segment, Vessels & Thalassemia</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slope" className="text-foreground font-medium">Slope of Peak Exercise ST Segment (slope)</Label>
                    <Select
                      value={formData.slope.toString()}
                      onValueChange={(value) => handleInputChange('slope', parseInt(value))}
                    >
                      <SelectTrigger className="bg-background border-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="1">1 - Upsloping</SelectItem>
                        <SelectItem value="2">2 - Flat</SelectItem>
                        <SelectItem value="3">3 - Downsloping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ca" className="text-foreground font-medium">Number of Major Vessels (ca) - Fluoroscopy</Label>
                    <Select
                      value={formData.ca.toString()}
                      onValueChange={(value) => handleInputChange('ca', parseInt(value))}
                    >
                      <SelectTrigger className="bg-background border-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="0">0 vessels</SelectItem>
                        <SelectItem value="1">1 vessel</SelectItem>
                        <SelectItem value="2">2 vessels</SelectItem>
                        <SelectItem value="3">3 vessels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thal" className="text-foreground font-medium">Thalassemia (thal)</Label>
                    <Select
                      value={formData.thal.toString()}
                      onValueChange={(value) => handleInputChange('thal', parseInt(value))}
                    >
                      <SelectTrigger className="bg-background border-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="3">3 - Normal</SelectItem>
                        <SelectItem value="6">6 - Fixed Defect</SelectItem>
                        <SelectItem value="7">7 - Reversible Defect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Predict Heart Disease Risk
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HeartPredictionForm;
