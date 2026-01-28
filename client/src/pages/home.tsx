import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, TrendingUp, Brain, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-16 pt-8">
          <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
            UCL PREDICTOR
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Monte Carlo Match Outcome Engine
          </p>
          <p className="text-sm text-muted-foreground mt-2 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            20,000 simulations · Advanced statistics · Real-time predictions
          </p>
        </header>

        {/* Main CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
          <Link href="/predict">
            <Button size="lg" className="text-lg px-8 py-6 cyber-border glow" data-testid="button-predict">
              <Brain className="mr-2 h-5 w-5" />
              Start Prediction
            </Button>
          </Link>
          <Link href="/scenarios">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" data-testid="button-scenarios">
              <TrendingUp className="mr-2 h-5 w-5" />
              View Scenarios
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 border-2 hover:border-primary transition-all duration-300 hover:scale-105 animate-in fade-in zoom-in-95 duration-700 delay-400" data-testid="card-feature-monte">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Monte Carlo Simulation</h3>
            <p className="text-muted-foreground text-sm">
              20,000 iterations using Poisson/Skellam distribution for accurate probability modeling
            </p>
          </Card>

          <Card className="p-6 border-2 hover:border-accent transition-all duration-300 hover:scale-105 animate-in fade-in zoom-in-95 duration-700 delay-500" data-testid="card-feature-factors">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/20 mb-4">
              <Target className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">Multi-Factor Analysis</h3>
            <p className="text-muted-foreground text-sm">
              Home advantage, recent form, H2H, squad availability, manager form, fatigue, and more
            </p>
          </Card>

          <Card className="p-6 border-2 hover:border-chart-3 transition-all duration-300 hover:scale-105 animate-in fade-in zoom-in-95 duration-700 delay-600" data-testid="card-feature-stats">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-chart-3/20 mb-4">
              <TrendingUp className="h-6 w-6 text-chart-3" />
            </div>
            <h3 className="text-xl font-bold mb-2">Comprehensive Stats</h3>
            <p className="text-muted-foreground text-sm">
              Predicted goals, scorelines, corners, shots, fouls, cards with confidence intervals
            </p>
          </Card>

          <Card className="p-6 border-2 hover:border-chart-5 transition-all duration-300 hover:scale-105 animate-in fade-in zoom-in-95 duration-700 delay-700" data-testid="card-feature-explain">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-chart-5/20 mb-4">
              <Brain className="h-6 w-6 text-chart-5" />
            </div>
            <h3 className="text-xl font-bold mb-2">Explainability</h3>
            <p className="text-muted-foreground text-sm">
              Understand why each prediction was made with weighted factor breakdown
            </p>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="p-6 border-destructive/50 bg-destructive/5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-800">
          <h4 className="font-bold text-lg mb-2 text-destructive">Important Disclaimer</h4>
          <p className="text-sm text-muted-foreground">
            All predictions are probabilistic and based on statistical models. They are provided for entertainment and analytical purposes only. 
            Past performance does not guarantee future results. This tool does not encourage or endorse gambling. 
            Always use predictions responsibly and never bet more than you can afford to lose.
          </p>
        </Card>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-muted-foreground">
          <p>Powered by advanced statistical modeling and machine learning algorithms</p>
          <p className="mt-2">UEFA Champions League · Season 2025-2026</p>
        </footer>
      </div>
    </div>
  );
}
