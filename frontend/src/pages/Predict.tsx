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
  thal: z.coerce.number().min(0).max(3),
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
      thal: 1,
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
        description: "Could not connect to the server. Please check your connection.",
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
      <div className="min-h-screen bg-[#fffcf5] py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center text-orange-700 hover:text-orange-900 mb-8 font-medium"
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
    <div className="min-h-screen bg-[#fffcf5] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-orange-700 hover:text-orange-900 mb-4 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Heart Disease Prediction
              </h1>
              <p className="text-orange-800/70 font-medium">
                Complete the clinical assessment below
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Card Section Helper: We use grid-cols-1 md:grid-cols-2 with gap-8 to prevent overlapping */}
          
          <Card className="border-orange-100 shadow-xl shadow-orange-100/50 bg-white overflow-visible">
            <CardHeader className="bg-orange-50/50 border-b border-orange-100 rounded-t-xl">
              <CardTitle className="text-xl text-orange-900">1. Patient Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-8 pt-6">
              <div className="space-y-3">
                <Label htmlFor="age" className="text-slate-700 font-bold flex items-center gap-2">
                  Age <FormTooltip content="Your age in years" />
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 45"
                  {...register("age")}
                  className="bg-orange-50/30 border-orange-200 focus:ring-orange-500 h-11"
                />
                {errors.age && <p className="text-xs text-red-500 font-medium">{errors.age.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="sex" className="text-slate-700 font-bold flex items-center gap-2">
                  Sex <FormTooltip content="Biological sex at birth" />
                </Label>
                <Select defaultValue="0" onValueChange={(value) => setValue("sex", parseInt(value))}>
                  <SelectTrigger className="bg-orange-50/30 border-orange-200 h-11">
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="0">Female</SelectItem>
                    <SelectItem value="1">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100 shadow-xl shadow-orange-100/50 bg-white overflow-visible">
            <CardHeader className="bg-orange-50/50 border-b border-orange-100 rounded-t-xl">
              <CardTitle className="text-xl text-orange-900">2. Clinical Indicators</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
              <div className="space-y-3">
                <Label className="text-slate-700 font-bold flex items-center gap-2">Chest Pain Type</Label>
                <Select defaultValue="0" onValueChange={(value) => setValue("cp", parseInt(value))}>
                  <SelectTrigger className="bg-orange-50/30 border-orange-200 h-11">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="0">Typical Angina</SelectItem>
                    <SelectItem value="1">Atypical Angina</SelectItem>
                    <SelectItem value="2">Non-anginal Pain</SelectItem>
                    <SelectItem value="3">Asymptomatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700 font-bold flex items-center gap-2">Resting BP (mm Hg)</Label>
                <Input type="number" {...register("trestbps")} className="bg-orange-50/30 border-orange-200 h-11" />
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700 font-bold flex items-center gap-2">Cholesterol (mg/dl)</Label>
                <Input type="number" {...register("chol")} className="bg-orange-50/30 border-orange-200 h-11" />
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700 font-bold flex items-center gap-2">Fasting Sugar {'>'} 120</Label>
                <Select defaultValue="0" onValueChange={(value) => setValue("fbs", parseInt(value))}>
                  <SelectTrigger className="bg-orange-50/30 border-orange-200 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700 font-bold flex items-center gap-2">Resting ECG</Label>
                <Select defaultValue="0" onValueChange={(value) => setValue("restecg", parseInt(value))}>
                  <SelectTrigger className="bg-orange-50/30 border-orange-200 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="0">Normal</SelectItem>
                    <SelectItem value="1">Abnormality</SelectItem>
                    <SelectItem value="2">Hypertrophy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700 font-bold flex items-center gap-2">Max Heart Rate</Label>
                <Input type="number" {...register("thalach")} className="bg-orange-50/30 border-orange-200 h-11" />
              </div>
            </CardContent>
          </Card>

          {/* Advanced Section */}
          <Card className="border-orange-100 shadow-xl shadow-orange-100/50 bg-white overflow-visible">
            <CardHeader className="bg-orange-50/50 border-b border-orange-100 rounded-t-xl">
              <CardTitle className="text-xl text-orange-900">3. Advanced Testing</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
               <div className="space-y-3">
                <Label className="text-slate-700 font-bold flex items-center gap-2">Exercise Angina</Label>
                <Select defaultValue="0" onValueChange={(value) => setValue("exang", parseInt(value))}>
                  <SelectTrigger className="bg-orange-50/30 border-orange-200 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700 font-bold flex items-center gap-2">ST Depression</Label>
                <Input step="0.1" type="number" {...register("oldpeak")} className="bg-orange-50/30 border-orange-200 h-11" />
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700 font-bold flex items-center gap-2">ST Slope</Label>
                <Select defaultValue="0" onValueChange={(value) => setValue("slope", parseInt(value))}>
                  <SelectTrigger className="bg-orange-50/30 border-orange-200 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="0">Upsloping</SelectItem>
                    <SelectItem value="1">Flat</SelectItem>
                    <SelectItem value="2">Downsloping</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700 font-bold flex items-center gap-2">Major Vessels (0-4)</Label>
                <Select defaultValue="0" onValueChange={(value) => setValue("ca", parseInt(value))}>
                  <SelectTrigger className="bg-orange-50/30 border-orange-200 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700 font-bold flex items-center gap-2">Thalassemia</Label>
                <Select defaultValue="1" onValueChange={(value) => setValue("thal", parseInt(value))}>
                  <SelectTrigger className="bg-orange-50/30 border-orange-200 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="0">Normal</SelectItem>
                    <SelectItem value="1">Fixed Defect</SelectItem>
                    <SelectItem value="2">Reversible Defect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl px-16 py-8 rounded-2xl shadow-xl shadow-orange-200 transition-all hover:scale-105"
            >
              {isLoading ? (
                <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Analyzing...</>
              ) : (
                <><Heart className="w-6 h-6 mr-2" /> Get Heart Report</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Predict;