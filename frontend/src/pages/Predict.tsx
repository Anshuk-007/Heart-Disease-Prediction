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
    watch,
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

  // Watch values for Select components to prevent UI desync
  const formValues = watch();

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
        description: "Backend server is not responding. Please check your Render logs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-[#FFFBF2] py-8 px-4 font-sans">
        <div className="container mx-auto max-w-4xl">
          <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-8 font-bold transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
          </Link>
          <PredictionResult prediction={result.prediction} confidence={result.confidence} onReset={() => {setResult(null); reset();}} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF2] py-8 px-4 font-sans">
      <div className="container mx-auto max-w-4xl">
        {/* Header - Fixed Heart Visibility */}
        <div className="mb-12 flex items-center gap-6">
          <div className="w-16 h-16 shrink-0 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Heart Disease Prediction</h1>
            <p className="text-orange-700 font-semibold text-lg opacity-90">Medical Diagnostic Assessment</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {/* Card 1: Patient Profile */}
          <Card className="border-2 border-orange-100 shadow-xl bg-white overflow-visible">
            <CardHeader className="bg-orange-50/50 border-b border-orange-100">
              <CardTitle className="text-orange-950 flex items-center gap-2">
                <span className="bg-orange-200 text-orange-800 w-6 h-6 rounded-full text-xs flex items-center justify-center">1</span>
                Patient Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-10 pt-8">
              <div className="space-y-3">
                <Label className="text-slate-800 font-bold text-base flex items-center gap-2">Age <FormTooltip content="Age in years" /></Label>
                <Input {...register("age")} className="bg-white border-orange-200 border-2 h-12 text-lg focus:border-orange-500 transition-all" placeholder="e.g. 45" />
                {errors.age && <p className="text-red-500 text-sm font-bold">{errors.age.message}</p>}
              </div>
              <div className="space-y-3">
                <Label className="text-slate-800 font-bold text-base">Sex</Label>
                <Select value={formValues.sex.toString()} onValueChange={(v) => setValue("sex", parseInt(v))}>
                  <SelectTrigger className="border-orange-200 border-2 h-12 text-lg bg-white">
                    <SelectValue placeholder="Select Sex" />
                  </SelectTrigger>
                  <SelectContent className="z-[100] bg-white border-orange-200 shadow-2xl">
                    <SelectItem value="0" className="cursor-pointer">Female</SelectItem>
                    <SelectItem value="1" className="cursor-pointer">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Clinical Indicators - Fixed Overlap with extra Gap */}
          <Card className="border-2 border-orange-100 shadow-xl bg-white overflow-visible">
            <CardHeader className="bg-orange-50/50 border-b border-orange-100">
              <CardTitle className="text-orange-950 flex items-center gap-2">
                <span className="bg-orange-200 text-orange-800 w-6 h-6 rounded-full text-xs flex items-center justify-center">2</span>
                Clinical Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-10 pt-8">
              <div className="space-y-3 md:col-span-1">
                <Label className="text-slate-800 font-bold text-base">Chest Pain Type</Label>
                <Select value={formValues.cp.toString()} onValueChange={(v) => setValue("cp", parseInt(v))}>
                  <SelectTrigger className="border-orange-200 border-2 h-12 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100] bg-white shadow-2xl">
                    <SelectItem value="0">Typical Angina</SelectItem>
                    <SelectItem value="1">Atypical Angina</SelectItem>
                    <SelectItem value="2">Non-anginal</SelectItem>
                    <SelectItem value="3">Asymptomatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-slate-800 font-bold text-base">Resting BP (mm Hg)</Label>
                <Input {...register("trestbps")} className="border-orange-200 border-2 h-12 bg-white" placeholder="120" />
              </div>
              <div className="space-y-3">
                <Label className="text-slate-800 font-bold text-base">Cholesterol (mg/dl)</Label>
                <Input {...register("chol")} className="border-orange-200 border-2 h-12 bg-white" placeholder="200" />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Advanced Testing */}
          <Card className="border-2 border-orange-100 shadow-xl bg-white overflow-visible">
            <CardHeader className="bg-orange-50/50 border-b border-orange-100">
              <CardTitle className="text-orange-950 flex items-center gap-2">
                <span className="bg-orange-200 text-orange-800 w-6 h-6 rounded-full text-xs flex items-center justify-center">3</span>
                Advanced Testing
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-10 pt-8">
              <div className="space-y-3">
                <Label className="text-slate-800 font-bold text-base">Major Vessels (0-4)</Label>
                <Select value={formValues.ca.toString()} onValueChange={(v) => setValue("ca", parseInt(v))}>
                  <SelectTrigger className="border-orange-200 border-2 h-12 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="z-[100] bg-white"><SelectItem value="0">0</SelectItem><SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem><SelectItem value="4">4</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-slate-800 font-bold text-base">Thalassemia</Label>
                <Select value={formValues.thal.toString()} onValueChange={(v) => setValue("thal", parseInt(v))}>
                  <SelectTrigger className="border-orange-200 border-2 h-12 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="z-[100] bg-white"><SelectItem value="0">Normal</SelectItem><SelectItem value="1">Fixed Defect</SelectItem><SelectItem value="2">Reversible</SelectItem></SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Main Action Button */}
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white font-black text-2xl px-20 py-10 rounded-3xl shadow-2xl shadow-orange-300 transition-all hover:scale-105 active:scale-95 disabled:opacity-50">
              {isLoading ? (
                <><Loader2 className="w-8 h-8 mr-3 animate-spin" /> Analyzing Clinical Data...</>
              ) : (
                <><Heart className="w-8 h-8 mr-3 fill-white" /> GENERATE REPORT</>
              )}
            </Button>
            <p className="text-orange-900/50 text-sm font-medium">AI-powered medical analysis will begin instantly</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Predict;