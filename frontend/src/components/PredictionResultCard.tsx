import { Heart, AlertTriangle, CheckCircle, XCircle, RefreshCw, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PredictionResult } from '@/lib/heartPrediction';

interface PredictionResultCardProps {
  result: PredictionResult;
  onReset: () => void;
}

const PredictionResultCard = ({ result, onReset }: PredictionResultCardProps) => {
  const getRiskColor = () => {
    switch (result.riskLevel) {
      case 'Low':
        return 'text-green-600';
      case 'Moderate':
        return 'text-yellow-600';
      case 'High':
        return 'text-orange-600';
      case 'Very High':
        return 'text-red-600';
      default:
        return 'text-foreground';
    }
  };

  const getRiskBgColor = () => {
    switch (result.riskLevel) {
      case 'Low':
        return 'bg-green-500';
      case 'Moderate':
        return 'bg-yellow-500';
      case 'High':
        return 'bg-orange-500';
      case 'Very High':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };

  const getRiskIcon = () => {
    switch (result.riskLevel) {
      case 'Low':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'Moderate':
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
      case 'High':
        return <AlertTriangle className="w-12 h-12 text-orange-500" />;
      case 'Very High':
        return <XCircle className="w-12 h-12 text-red-500" />;
      default:
        return <Heart className="w-12 h-12 text-primary" />;
    }
  };

  const getRiskMessage = () => {
    switch (result.riskLevel) {
      case 'Low':
        return "Your heart disease risk appears to be low based on the provided parameters. Continue maintaining a healthy lifestyle!";
      case 'Moderate':
        return "You have some risk factors present. Consider consulting with a healthcare provider for a comprehensive evaluation.";
      case 'High':
        return "Several risk factors are present. We strongly recommend scheduling an appointment with a cardiologist.";
      case 'Very High':
        return "Multiple significant risk factors detected. Please seek medical consultation as soon as possible.";
      default:
        return "Assessment complete.";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Main Result Card */}
      <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
        <div className={`h-2 ${getRiskBgColor()}`} />
        <CardHeader className="text-center pb-4 pt-8">
          <div className="mx-auto mb-4">
            {getRiskIcon()}
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold">
            <span className={getRiskColor()}>{result.riskLevel} Risk</span>
          </CardTitle>
          <p className="text-lg text-muted-foreground mt-2">
            {result.prediction === 1 ? 'Heart Disease Likely' : 'Heart Disease Unlikely'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8 pb-8">
          {/* Risk Score */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{result.probability}%</span>
              <span className="text-muted-foreground">Risk Score</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Low Risk</span>
              <span>High Risk</span>
            </div>
            <Progress value={result.probability} className="h-3" />
          </div>

          {/* Risk Message */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-center text-foreground">{getRiskMessage()}</p>
          </div>

          {/* Risk Factors */}
          {result.riskFactors.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-accent" />
                Key Risk Factors Identified:
              </h4>
              <ul className="space-y-2">
                {result.riskFactors.map((factor, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-2 text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">Disclaimer:</strong> This assessment is for educational purposes only and 
              should not replace professional medical advice. Always consult with a qualified healthcare 
              provider for accurate diagnosis and treatment.
            </p>
          </div>

          {/* Reset Button */}
          <Button 
            onClick={onReset}
            size="lg"
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Start New Assessment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionResultCard;
