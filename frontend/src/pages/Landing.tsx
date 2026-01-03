import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Activity, ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen gradient-soft">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating Heart Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* UPDATED: Changed text-primary-foreground to text-slate-900 to ensure visibility */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full gradient-warm flex items-center justify-center shadow-warm-lg animate-float">
                <Heart className="w-12 h-12 md:w-16 md:h-16 text-slate-900 fill-slate-900" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-accent-foreground" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
            Heart Disease{" "}
            <span className="text-gradient-warm">Prediction</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Get an early assessment of heart disease risk using advanced machine learning. 
            Simply enter your health parameters and receive instant insights.
          </p>

          {/* CTA Button */}
          <Link to="/predict">
            <Button 
              size="lg" 
              className="gradient-warm text-primary-foreground font-semibold text-lg px-8 py-6 rounded-full shadow-warm hover:shadow-warm-lg transition-all duration-300 hover:scale-105"
            >
              Start Prediction
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              <span>Based on Clinical Data</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span>ML-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              <span>13 Health Parameters</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-warm transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2">Enter Your Data</h3>
              <p className="text-muted-foreground text-sm">
                Fill in your health parameters including age, blood pressure, cholesterol, and more.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-warm transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2">AI Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Our machine learning model analyzes your data using a trained Logistic Regression algorithm.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-warm transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2">Get Results</h3>
              <p className="text-muted-foreground text-sm">
                Receive an instant prediction with confidence score and recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-accent/50 rounded-xl p-4 text-center">
            <p className="text-sm text-accent-foreground">
              <strong>Disclaimer:</strong> This tool is for educational purposes only and should not replace professional medical advice. 
              Always consult with a healthcare provider for medical decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <p>Built with ❤️ for heart health awareness</p>
      </footer>
    </div>
  );
};

export default Landing;