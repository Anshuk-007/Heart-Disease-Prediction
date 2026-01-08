import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FormTooltip from "@/components/prediction/FormTooltip";
import PredictionResult from "@/components/prediction/PredictionResult";
import { getPrediction, type PredictionInput } from "@/lib/api";

const predictionSchema = z.object({
  age: z.coerce.number().min(1, "Age is required").max(120, "Please enter a valid age"),
  sex: z.coerce.number().min(0).max(1),
  cp: z.coerce.number().min(0).max(3),
  trestbps: z.coerce.number().min(50, "Blood pressure too low").max(250, "Blood pressure too high"),
  chol: z.coerce.number().min(100, "Cholesterol too low").max(600, "Cholesterol too high"),
  fbs: z.coerce.number().min(0).max(1),
  restecg: z.coerce.number().min(0).max(2),
  thalach: z.coerce.number().min(50, "Heart rate too low").max(250, "Heart rate too high"),
  exang: z.coerce.number().min(0).max(1),
  oldpeak: z.coerce.number().min(0, "Value must be positive").max(10, "Value too high"),
  slope: z.coerce.number().min(0).max(2),
  ca: z.coerce.number().min(0).max(4),
  thal: z.coerce.number().refine(v => [3, 6, 7].includes(v), {
    message: "Invalid thal value",
  }),
});

type PredictionFormData = z.infer<typeof predictionSchema>;

const Predict = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ prediction: number; confidence?: number } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PredictionFormData>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      age: undefined,
      sex: 0,
      cp: 0,
      trestbps: undefined,
      chol: undefined,
      fbs: 0,
      restecg: 0,
      thalach: undefined,
      exang: 0,
      oldpeak: 0,
      slope: 0,
      ca: 0,
      thal: 3,
    },
  });

  const onSubmit = async (data: PredictionFormData) => {
    setIsLoading(true);
    try {
      const response = await getPrediction(data as PredictionInput);
      setResult({
        prediction: response.prediction,
        confidence: response.confidence,
      });
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Could not connect to the prediction server. Please ensure your Flask backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    reset();
  };

  if (result) {
    return (
      <div className="min-h-screen gradient-soft py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <PredictionResult
            prediction={result.prediction}
            confidence={result.confidence}
            onReset={handleReset}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-soft py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                Heart Disease Prediction
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your health parameters below
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Details */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-heading">Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center">
                  Age
                  <FormTooltip content="Your age in years" />
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 45"
                  {...register("age")}
                  className={errors.age ? "border-destructive" : ""}
                />
                {errors.age && (
                  <p className="text-xs text-destructive">{errors.age.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sex" className="flex items-center">
                  Sex
                  <FormTooltip content="Biological sex at birth" />
                </Label>
                <Select
                  defaultValue="0"
                  onValueChange={(value) => setValue("sex", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Female</SelectItem>
                    <SelectItem value="1">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Cardiac Symptoms */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-heading">Cardiac Symptoms</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cp" className="flex items-center">
                  Chest Pain Type
                  <FormTooltip content="0: Typical angina, 1: Atypical angina, 2: Non-anginal pain, 3: Asymptomatic" />
                </Label>
                <Select
                  defaultValue="0"
                  onValueChange={(value) => setValue("cp", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Typical Angina</SelectItem>
                    <SelectItem value="1">Atypical Angina</SelectItem>
                    <SelectItem value="2">Non-anginal Pain</SelectItem>
                    <SelectItem value="3">Asymptomatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trestbps" className="flex items-center">
                  Resting Blood Pressure
                  <FormTooltip content="Resting blood pressure in mm Hg on admission" />
                </Label>
                <Input
                  id="trestbps"
                  type="number"
                  placeholder="e.g., 120"
                  {...register("trestbps")}
                  className={errors.trestbps ? "border-destructive" : ""}
                />
                {errors.trestbps && (
                  <p className="text-xs text-destructive">{errors.trestbps.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="chol" className="flex items-center">
                  Serum Cholesterol
                  <FormTooltip content="Serum cholesterol level in mg/dl" />
                </Label>
                <Input
                  id="chol"
                  type="number"
                  placeholder="e.g., 200"
                  {...register("chol")}
                  className={errors.chol ? "border-destructive" : ""}
                />
                {errors.chol && (
                  <p className="text-xs text-destructive">{errors.chol.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Blood Sugar & ECG */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-heading">Blood Sugar & ECG</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fbs" className="flex items-center">
                  Fasting Blood Sugar &gt; 120 mg/dl
                  <FormTooltip content="Is fasting blood sugar greater than 120 mg/dl?" />
                </Label>
                <Select
                  defaultValue="0"
                  onValueChange={(value) => setValue("fbs", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No (≤120 mg/dl)</SelectItem>
                    <SelectItem value="1">Yes (&gt;120 mg/dl)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="restecg" className="flex items-center">
                  Resting ECG Results
                  <FormTooltip content="0: Normal, 1: ST-T wave abnormality, 2: Left ventricular hypertrophy" />
                </Label>
                <Select
                  defaultValue="0"
                  onValueChange={(value) => setValue("restecg", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Normal</SelectItem>
                    <SelectItem value="1">ST-T Wave Abnormality</SelectItem>
                    <SelectItem value="2">Left Ventricular Hypertrophy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Data */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-heading">Exercise Response</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="thalach" className="flex items-center">
                  Maximum Heart Rate
                  <FormTooltip content="Maximum heart rate achieved during exercise test" />
                </Label>
                <Input
                  id="thalach"
                  type="number"
                  placeholder="e.g., 150"
                  {...register("thalach")}
                  className={errors.thalach ? "border-destructive" : ""}
                />
                {errors.thalach && (
                  <p className="text-xs text-destructive">{errors.thalach.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="exang" className="flex items-center">
                  Exercise Induced Angina
                  <FormTooltip content="Did exercise cause chest pain (angina)?" />
                </Label>
                <Select
                  defaultValue="0"
                  onValueChange={(value) => setValue("exang", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="oldpeak" className="flex items-center">
                  ST Depression (Oldpeak)
                  <FormTooltip content="ST depression induced by exercise relative to rest" />
                </Label>
                <Input
                  id="oldpeak"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 1.5"
                  {...register("oldpeak")}
                  className={errors.oldpeak ? "border-destructive" : ""}
                />
                {errors.oldpeak && (
                  <p className="text-xs text-destructive">{errors.oldpeak.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slope" className="flex items-center">
                  Slope of Peak ST Segment
                  <FormTooltip content="0: Upsloping, 1: Flat, 2: Downsloping" />
                </Label>
                <Select
                  defaultValue="0"
                  onValueChange={(value) => setValue("slope", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select slope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Upsloping</SelectItem>
                    <SelectItem value="1">Flat</SelectItem>
                    <SelectItem value="2">Downsloping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Metrics */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-heading">Advanced Metrics</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ca" className="flex items-center">
                  Number of Major Vessels
                  <FormTooltip content="Number of major vessels (0-4) colored by fluoroscopy" />
                </Label>
                <Select
                  defaultValue="0"
                  onValueChange={(value) => setValue("ca", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thal" className="flex items-center">
                  Thalassemia
                  <FormTooltip content="3: Normal, 6: Fixed defect, 7: Reversible defect" />
                </Label>

                <Select
                  defaultValue="3"
                  onValueChange={(value) => setValue("thal", parseInt(value), {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="3">Normal</SelectItem>
                    <SelectItem value="6">Fixed Defect</SelectItem>
                    <SelectItem value="7">Reversible Defect</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="gradient-warm text-primary-foreground font-semibold text-lg px-12 py-6 rounded-full shadow-warm hover:shadow-warm-lg transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" />
                  Get Prediction
                </>
              )}
            </Button>
          </div>
        </form>

        {/* API Info */}
        <div className="mt-8 p-4 bg-muted rounded-xl text-center">
          <p className="text-xs text-muted-foreground">
            <strong>Backend Setup:</strong> This form will send data to your Flask API at{" "}
            <code className="bg-background px-1 py-0.5 rounded">http://localhost:5000/predict</code>.
            Set the <code className="bg-background px-1 py-0.5 rounded">VITE_API_URL</code> environment variable to change this.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Predict;
