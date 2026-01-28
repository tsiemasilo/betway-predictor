import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2, Target, TrendingUp, Activity, AlertCircle } from "lucide-react";
import type { PredictionResult } from "@shared/schema";

interface UCLTeam {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  stats: any;
}

interface UCLFixture {
  id: number;
  homeTeam: UCLTeam;
  awayTeam: UCLTeam;
  date: string;
  time: string;
  venue: string;
  round: string;
  prediction: {
    homeGoals: number;
    awayGoals: number;
    homeWinProb: number;
    drawProb: number;
    awayWinProb: number;
  };
}

interface DetailedPrediction {
  fixture: UCLFixture;
  prediction: PredictionResult;
}

export default function Home() {
  const [selectedFixture, setSelectedFixture] = useState<number | null>(null);

  const { data: fixtures, isLoading } = useQuery({
    queryKey: ["fixtures"],
    queryFn: async () => {
      const res = await fetch("/api/fixtures");
      if (!res.ok) throw new Error("Failed to fetch fixtures");
      return res.json() as Promise<UCLFixture[]>;
    },
  });

  const { data: detailedPrediction, isLoading: loadingDetails } = useQuery({
    queryKey: ["prediction", selectedFixture],
    queryFn: async () => {
      const res = await fetch(`/api/fixtures/${selectedFixture}/prediction`);
      if (!res.ok) throw new Error("Failed to fetch prediction");
      return res.json() as Promise<DetailedPrediction>;
    },
    enabled: !!selectedFixture,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a2e] via-[#16213e] to-[#0f0f23]">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-purple-900/50" />
        <div className="relative container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl font-black text-center bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent tracking-wider">
            Champions League Round 8
          </h1>
          <p className="text-center text-purple-300/70 mt-2 text-sm">
            Tonight's Fixtures • January 28, 2026
          </p>
        </div>
      </header>

      {/* Fixtures */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        )}

        <div className="space-y-3">
          {fixtures?.map((fixture) => (
            <Card
              key={fixture.id}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer overflow-hidden"
              onClick={() => setSelectedFixture(fixture.id)}
              data-testid={`fixture-card-${fixture.id}`}
            >
              <div className="flex items-center p-4">
                {/* Home Team */}
                <div className="flex-1 flex items-center gap-3">
                  <img
                    src={fixture.homeTeam.logo}
                    alt={fixture.homeTeam.name}
                    className="w-12 h-12 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=' + fixture.homeTeam.shortName.charAt(0); }}
                  />
                  <span className="font-bold text-white text-sm md:text-base truncate" data-testid={`home-team-${fixture.id}`}>
                    {fixture.homeTeam.shortName}
                  </span>
                </div>

                {/* Score Prediction */}
                <div className="flex items-center gap-2 px-4">
                  <span className="text-3xl font-black text-white" data-testid={`home-score-${fixture.id}`}>
                    {fixture.prediction.homeGoals}
                  </span>
                  <span className="text-2xl font-light text-white/50">:</span>
                  <span className="text-3xl font-black text-white" data-testid={`away-score-${fixture.id}`}>
                    {fixture.prediction.awayGoals}
                  </span>
                </div>

                {/* Away Team */}
                <div className="flex-1 flex items-center justify-end gap-3">
                  <span className="font-bold text-white text-sm md:text-base truncate text-right" data-testid={`away-team-${fixture.id}`}>
                    {fixture.awayTeam.shortName}
                  </span>
                  <img
                    src={fixture.awayTeam.logo}
                    alt={fixture.awayTeam.name}
                    className="w-12 h-12 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=' + fixture.awayTeam.shortName.charAt(0); }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-xs text-red-300/80 text-center">
            <strong>Disclaimer:</strong> Predictions are for entertainment only. Not gambling advice.
          </p>
        </div>
      </main>

      {/* Detail Modal */}
      <Dialog open={!!selectedFixture} onOpenChange={() => setSelectedFixture(null)}>
        <DialogContent className="bg-[#1a1a2e] border-purple-500/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          {loadingDetails && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            </div>
          )}

          {detailedPrediction && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-black">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <img
                      src={detailedPrediction.fixture.homeTeam.logo}
                      alt=""
                      className="w-16 h-16 object-contain"
                    />
                    <span className="text-4xl text-purple-400">
                      {detailedPrediction.prediction.expectedGoals.home.toFixed(1)} - {detailedPrediction.prediction.expectedGoals.away.toFixed(1)}
                    </span>
                    <img
                      src={detailedPrediction.fixture.awayTeam.logo}
                      alt=""
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div className="text-sm font-normal text-purple-300/70">
                    {detailedPrediction.fixture.homeTeam.name} vs {detailedPrediction.fixture.awayTeam.name}
                  </div>
                </DialogTitle>
              </DialogHeader>

              {/* Probabilities */}
              <div className="mt-6 space-y-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  Win Probability
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-purple-500/20 rounded-lg p-3">
                    <p className="text-2xl font-black text-purple-400" data-testid="prob-home">
                      {detailedPrediction.prediction.probabilities.home.toFixed(0)}%
                    </p>
                    <p className="text-xs text-purple-300/70">Home Win</p>
                  </div>
                  <div className="bg-gray-500/20 rounded-lg p-3">
                    <p className="text-2xl font-black text-gray-400" data-testid="prob-draw">
                      {detailedPrediction.prediction.probabilities.draw.toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-400/70">Draw</p>
                  </div>
                  <div className="bg-green-500/20 rounded-lg p-3">
                    <p className="text-2xl font-black text-green-400" data-testid="prob-away">
                      {detailedPrediction.prediction.probabilities.away.toFixed(0)}%
                    </p>
                    <p className="text-xs text-green-400/70">Away Win</p>
                  </div>
                </div>
              </div>

              {/* Stats Comparison */}
              <div className="mt-6 space-y-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  Predicted Stats
                </h3>
                <div className="space-y-2">
                  <StatRow
                    label="Shots"
                    homeValue={detailedPrediction.prediction.predictedStats.shots.home.mean}
                    awayValue={detailedPrediction.prediction.predictedStats.shots.away.mean}
                  />
                  <StatRow
                    label="Shots on Target"
                    homeValue={detailedPrediction.prediction.predictedStats.shotsOnTarget.home.mean}
                    awayValue={detailedPrediction.prediction.predictedStats.shotsOnTarget.away.mean}
                  />
                  <StatRow
                    label="Corners"
                    homeValue={detailedPrediction.prediction.predictedStats.corners.home.mean}
                    awayValue={detailedPrediction.prediction.predictedStats.corners.away.mean}
                  />
                  <StatRow
                    label="Fouls"
                    homeValue={detailedPrediction.prediction.predictedStats.fouls.home.mean}
                    awayValue={detailedPrediction.prediction.predictedStats.fouls.away.mean}
                  />
                  <StatRow
                    label="Yellow Cards"
                    homeValue={detailedPrediction.prediction.predictedStats.cards.homeYellow.mean}
                    awayValue={detailedPrediction.prediction.predictedStats.cards.awayYellow.mean}
                  />
                </div>
              </div>

              {/* Top Scorelines */}
              <div className="mt-6 space-y-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-400" />
                  Most Likely Scores
                </h3>
                <div className="flex flex-wrap gap-2">
                  {detailedPrediction.prediction.topScorelines.slice(0, 5).map((s, i) => (
                    <Badge key={i} variant="outline" className="text-lg px-3 py-1 bg-white/5">
                      {s.score} ({s.probability.toFixed(0)}%)
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div className="mt-6 space-y-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-purple-400" />
                  Betting Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-purple-300/70 text-xs">Over/Under 2.5</p>
                    <p className="font-bold">{detailedPrediction.prediction.insights.over25}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-purple-300/70 text-xs">BTTS</p>
                    <p className="font-bold">{detailedPrediction.prediction.insights.btts}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-purple-300/70 text-xs">Double Chance</p>
                    <p className="font-bold">{detailedPrediction.prediction.insights.doubleChance}</p>
                  </div>
                </div>
              </div>

              {/* Confidence */}
              <div className="mt-4 flex items-center justify-between text-xs text-purple-300/50">
                <span>Confidence: <Badge variant={detailedPrediction.prediction.insights.confidence === 'High' ? 'default' : 'secondary'}>{detailedPrediction.prediction.insights.confidence}</Badge></span>
                <span>Volatility: <Badge variant={detailedPrediction.prediction.volatility === 'Low' ? 'default' : 'destructive'}>{detailedPrediction.prediction.volatility}</Badge></span>
                <span>Simulations: {detailedPrediction.prediction.simulationCount.toLocaleString()}</span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatRow({ label, homeValue, awayValue }: { label: string; homeValue: number; awayValue: number }) {
  const total = homeValue + awayValue;
  const homePercent = total > 0 ? (homeValue / total) * 100 : 50;

  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-sm font-bold text-purple-400">{homeValue.toFixed(1)}</span>
      <div className="flex-1 relative h-6 rounded-full overflow-hidden bg-gray-800">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-600 to-purple-500"
          style={{ width: `${homePercent}%` }}
        />
        <div
          className="absolute right-0 top-0 h-full bg-gradient-to-l from-green-600 to-green-500"
          style={{ width: `${100 - homePercent}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
          {label}
        </span>
      </div>
      <span className="w-16 text-sm font-bold text-green-400 text-right">{awayValue.toFixed(1)}</span>
    </div>
  );
}
