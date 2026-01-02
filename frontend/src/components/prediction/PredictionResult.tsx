import { Button } from "@/components/ui/button";
import { Heart, AlertTriangle, CheckCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PredictionResultProps {
  prediction: number;
  confidence?: number;
  onReset: () => void;
}

const PredictionResult = ({ prediction, confidence, onReset }: PredictionResultProps) => {
  const isHighRisk = prediction === 1;

  return (
    <div className="max-w-lg mx-auto">
      <div
        className={cn(
          "rounded-2xl p-8 text-center shadow-lg transition-all duration-500",
          isHighRisk
            ? "bg-destructive/10 border-2 border-destructive"
            : "bg-success/10 border-2 border-success"
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            "w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center",
            isHighRisk ? "bg-destructive" : "bg-success"
          )}
        >
          {isHighRisk ? (
            <AlertTriangle className="w-10 h-10 text-destructive-foreground" />
          ) : (
            <CheckCircle className="w-10 h-10 text-success-foreground" />
          )}
        </div>

        {/* Result Text */}
        <h2
          className={cn(
            "text-2xl md:text-3xl font-heading font-bold mb-3",
            isHighRisk ? "text-destructive" : "text-success"
          )}
        >
          {isHighRisk ? "Heart Disease Risk Detected" : "No Heart Disease Risk Detected"}
        </h2>

        {/* Confidence */}
        {confidence !== undefined && (
          <div className="mb-6">
            <span className="text-muted-foreground">Confidence: </span>
            <span className={cn("font-bold text-lg", isHighRisk ? "text-destructive" : "text-success")}>
              {(confidence * 100).toFixed(1)}%
            </span>
          </div>
        )}

        {/* Message */}
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {isHighRisk
            ? "Based on the provided parameters, there may be an elevated risk of heart disease. Please consult with a healthcare professional for a proper evaluation."
            : "Based on the provided parameters, the risk of heart disease appears to be low. Continue maintaining a healthy lifestyle and regular check-ups."}
        </p>

        {/* Heart Icon */}
        <div className="flex justify-center mb-6">
          <Heart
            className={cn(
              "w-8 h-8 animate-pulse-soft",
              isHighRisk ? "text-destructive" : "text-success"
            )}
            fill="currentColor"
          />
        </div>

        {/* Reset Button */}
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
          className="rounded-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Check Another Patient
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-muted rounded-xl text-center">
        <p className="text-xs text-muted-foreground">
          <strong>Important:</strong> This prediction is based on a machine learning model and should not be used as a definitive medical diagnosis. 
          Always consult with qualified healthcare professionals.
        </p>
      </div>
    </div>
  );
};

export default PredictionResult;
