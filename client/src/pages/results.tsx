import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp, Activity, AlertCircle, Target, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PredictionResult } from "@shared/schema";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Results() {
  const [, navigate] = useLocation();
  const [prediction, setPrediction] = useState<{
    homeTeam: string;
    awayTeam: string;
    result: PredictionResult;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lastPrediction");
    if (stored) {
      setPrediction(JSON.parse(stored));
    } else {
      navigate("/predict");
    }
  }, [navigate]);

  if (!prediction) return null;

  const { homeTeam, awayTeam, result } = prediction;
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))', 'hsl(var(--accent))'];

  const probabilityData = [
    { name: 'Home Win', value: result.probabilities.home, color: COLORS[0] },
    { name: 'Draw', value: result.probabilities.draw, color: COLORS[1] },
    { name: 'Away Win', value: result.probabilities.away, color: COLORS[2] },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate("/predict")} data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-black">Prediction Results</h1>
        </div>

        {/* Match Header */}
        <Card className="p-8 mb-6 cyber-border">
          <div className="grid grid-cols-3 gap-4 items-center text-center">
            <div>
              <h2 className="text-3xl font-black text-primary" data-testid="text-home-team">{homeTeam}</h2>
              <p className="text-muted-foreground text-sm mt-1">Home</p>
            </div>
            <div>
              <div className="text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                VS
              </div>
              <Badge variant="outline" className="mt-2">UEFA Champions League</Badge>
            </div>
            <div>
              <h2 className="text-3xl font-black text-accent" data-testid="text-away-team">{awayTeam}</h2>
              <p className="text-muted-foreground text-sm mt-1">Away</p>
            </div>
          </div>
        </Card>

        {/* Probabilities */}
        <Card className="p-6 mb-6">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Match Outcome Probabilities
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">{homeTeam} Win</span>
                  <span className="text-primary font-black text-xl" data-testid="text-prob-home">{result.probabilities.home.toFixed(1)}%</span>
                </div>
                <Progress value={result.probabilities.home} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Draw</span>
                  <span className="text-muted-foreground font-black text-xl" data-testid="text-prob-draw">{result.probabilities.draw.toFixed(1)}%</span>
                </div>
                <Progress value={result.probabilities.draw} className="h-3 [&>div]:bg-muted" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">{awayTeam} Win</span>
                  <span className="text-accent font-black text-xl" data-testid="text-prob-away">{result.probabilities.away.toFixed(1)}%</span>
                </div>
                <Progress value={result.probabilities.away} className="h-3 [&>div]:bg-accent" />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={probabilityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {probabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Expected Goals & Top Scorelines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-chart-3" />
              Expected Goals
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{homeTeam}</span>
                <span className="text-3xl font-black text-primary" data-testid="text-xg-home">
                  {result.expectedGoals.home.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">{awayTeam}</span>
                <span className="text-3xl font-black text-accent" data-testid="text-xg-away">
                  {result.expectedGoals.away.toFixed(2)}
                </span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Goals Expected</span>
                  <span className="text-2xl font-black" data-testid="text-total-goals">
                    {result.predictedStats.totalGoals.mean.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Range: {result.predictedStats.totalGoals.min.toFixed(1)} - {result.predictedStats.totalGoals.max.toFixed(1)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Top 5 Likely Scorelines</h3>
            <div className="space-y-3">
              {result.topScorelines.map((scoreline, idx) => (
                <div key={idx} className="flex justify-between items-center" data-testid={`scoreline-${idx}`}>
                  <span className="text-2xl font-bold font-mono">{scoreline.score}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{scoreline.probability.toFixed(1)}%</span>
                    <Progress value={scoreline.probability * 5} className="w-20 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Match Statistics */}
        <Card className="p-6 mb-6">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Predicted Match Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Corners"
              homeValue={result.predictedStats.corners.home.mean}
              awayValue={result.predictedStats.corners.away.mean}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
            />
            <StatCard
              title="Shots"
              homeValue={result.predictedStats.shots.home.mean}
              awayValue={result.predictedStats.shots.away.mean}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
            />
            <StatCard
              title="Shots on Target"
              homeValue={result.predictedStats.shotsOnTarget.home.mean}
              awayValue={result.predictedStats.shotsOnTarget.away.mean}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
            />
            <StatCard
              title="Fouls"
              homeValue={result.predictedStats.fouls.home.mean}
              awayValue={result.predictedStats.fouls.away.mean}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
            />
            <StatCard
              title="Yellow Cards"
              homeValue={result.predictedStats.cards.homeYellow.mean}
              awayValue={result.predictedStats.cards.awayYellow.mean}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
            />
            <StatCard
              title="Red Cards"
              homeValue={result.predictedStats.cards.homeRed.mean}
              awayValue={result.predictedStats.cards.awayRed.mean}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
            />
          </div>
        </Card>

        {/* Explainability */}
        <Card className="p-6 mb-6">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-chart-5" />
            Why This Prediction?
          </h3>
          <div className="space-y-3">
            {result.explainability.map((factor, idx) => (
              <div key={idx} className="border-l-4 border-primary pl-4 py-2" data-testid={`factor-${idx}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{factor.factor}</span>
                  <Badge variant="outline">Weight: {factor.weight}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{factor.explanation}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Insights & Volatility */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-accent" />
              Betting Insights
            </h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Over/Under 2.5:</span>
                <p className="text-lg font-bold text-primary" data-testid="text-insight-over25">{result.insights.over25}</p>
              </div>
              <div>
                <span className="font-medium">Both Teams to Score:</span>
                <p className="text-lg font-bold text-accent" data-testid="text-insight-btts">{result.insights.btts}</p>
              </div>
              <div>
                <span className="font-medium">Double Chance:</span>
                <p className="text-lg font-bold" data-testid="text-insight-double-chance">{result.insights.doubleChance}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Prediction Confidence</h3>
            <div className="space-y-4">
              <div>
                <span className="font-medium">Confidence Level:</span>
                <Badge
                  className="ml-2"
                  variant={result.insights.confidence === 'High' ? 'default' : result.insights.confidence === 'Medium' ? 'secondary' : 'outline'}
                  data-testid="badge-confidence"
                >
                  {result.insights.confidence}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Volatility:</span>
                <Badge
                  className="ml-2"
                  variant={result.volatility === 'Low' ? 'default' : result.volatility === 'Medium' ? 'secondary' : 'destructive'}
                  data-testid="badge-volatility"
                >
                  {result.volatility}
                </Badge>
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  Based on {result.simulationCount.toLocaleString()} Monte Carlo simulations
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="p-4 border-destructive/50 bg-destructive/5">
          <p className="text-xs text-muted-foreground">
            <strong className="text-destructive">Disclaimer:</strong> Predictions are probabilistic and for entertainment/analysis only. 
            Not gambling advice. Use responsibly.
          </p>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, homeValue, awayValue, homeTeam, awayTeam }: {
  title: string;
  homeValue: number;
  awayValue: number;
  homeTeam: string;
  awayTeam: string;
}) {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-bold text-sm text-muted-foreground mb-3">{title}</h4>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs truncate max-w-[100px]">{homeTeam}</span>
          <span className="text-xl font-black text-primary">{homeValue.toFixed(1)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs truncate max-w-[100px]">{awayTeam}</span>
          <span className="text-xl font-black text-accent">{awayValue.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
