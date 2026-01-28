import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, Play } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { TeamStats, PredictionResult } from "@shared/schema";

const defaultTeamStats: TeamStats = {
  matchesPlayed: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  cleanSheets: 0,
  last5Results: [],
  last5GoalsFor: 0,
  last5GoalsAgainst: 0,
  last10Results: [],
  last10GoalsFor: 0,
  last10GoalsAgainst: 0,
  homeMatchesPlayed: 0,
  homeGoalsFor: 0,
  homeGoalsAgainst: 0,
  awayMatchesPlayed: 0,
  awayGoalsFor: 0,
  awayGoalsAgainst: 0,
  h2hMeetings: 0,
  h2hWins: 0,
  h2hDraws: 0,
  h2hLosses: 0,
  h2hGoalsFor: 0,
  h2hGoalsAgainst: 0,
  startingXI: [],
  bench: [],
  keyAbsences: false,
  absenceImpact: 0,
  managerForm: 5,
  tacticalStability: 5,
  importanceLevel: 5,
  mustWin: false,
  restDays: 3,
  travelFatigue: 0,
  weatherImpact: 0,
  refereeStrictness: 5,
  avgShots: 12,
  avgShotsOnTarget: 5,
  avgPossession: 50,
  avgCorners: 5,
  avgFouls: 10,
  avgYellowCards: 2,
  avgRedCards: 0,
  crossingTendency: 5,
  defensivePressure: 5,
  discipline: 5,
};

export default function Predict() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [homeStats, setHomeStats] = useState<TeamStats>(defaultTeamStats);
  const [awayStats, setAwayStats] = useState<TeamStats>(defaultTeamStats);

  const predictMutation = useMutation({
    mutationFn: async (data: { homeTeamStats: TeamStats; awayTeamStats: TeamStats }) => {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Prediction failed");
      }
      return response.json() as Promise<PredictionResult>;
    },
    onSuccess: (result) => {
      localStorage.setItem("lastPrediction", JSON.stringify({
        homeTeam,
        awayTeam,
        result,
      }));
      navigate("/results");
    },
    onError: (error: Error) => {
      toast({
        title: "Prediction Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePredict = () => {
    if (!homeTeam || !awayTeam) {
      toast({
        title: "Missing Information",
        description: "Please enter both team names",
        variant: "destructive",
      });
      return;
    }
    predictMutation.mutate({ homeTeamStats: homeStats, awayTeamStats: awayStats });
  };

  const updateHomeStats = (key: keyof TeamStats, value: any) => {
    setHomeStats(prev => ({ ...prev, [key]: value }));
  };

  const updateAwayStats = (key: keyof TeamStats, value: any) => {
    setAwayStats(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate("/")} data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-black">Match Predictor</h1>
        </div>

        {/* Team Names */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="home-team" className="text-lg font-bold">Home Team</Label>
              <Input
                id="home-team"
                data-testid="input-home-team"
                placeholder="e.g., Real Madrid"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>
            <div>
              <Label htmlFor="away-team" className="text-lg font-bold">Away Team</Label>
              <Input
                id="away-team"
                data-testid="input-away-team"
                placeholder="e.g., Bayern Munich"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                className="mt-2 text-lg"
              />
            </div>
          </div>
        </Card>

        {/* Team Stats Tabs */}
        <Tabs defaultValue="home" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="home" data-testid="tab-home">Home Team Stats</TabsTrigger>
            <TabsTrigger value="away" data-testid="tab-away">Away Team Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <TeamStatsForm stats={homeStats} updateStats={updateHomeStats} teamType="home" />
          </TabsContent>

          <TabsContent value="away" className="space-y-6">
            <TeamStatsForm stats={awayStats} updateStats={updateAwayStats} teamType="away" />
          </TabsContent>
        </Tabs>

        {/* Predict Button */}
        <Card className="p-6">
          <Button
            size="lg"
            className="w-full text-xl py-6 cyber-border glow"
            onClick={handlePredict}
            disabled={predictMutation.isPending}
            data-testid="button-run-prediction"
          >
            {predictMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Running 20,000 Simulations...
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Run Prediction
              </>
            )}
          </Button>
        </Card>
      </div>
    </div>
  );
}

function TeamStatsForm({ stats, updateStats, teamType }: {
  stats: TeamStats;
  updateStats: (key: keyof TeamStats, value: any) => void;
  teamType: string;
}) {
  return (
    <>
      {/* Season Stats */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Season Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Matches Played</Label>
            <Input
              type="number"
              value={stats.matchesPlayed}
              onChange={(e) => updateStats("matchesPlayed", parseInt(e.target.value) || 0)}
              data-testid={`input-${teamType}-matches-played`}
            />
          </div>
          <div>
            <Label>Goals For</Label>
            <Input
              type="number"
              value={stats.goalsFor}
              onChange={(e) => updateStats("goalsFor", parseInt(e.target.value) || 0)}
              data-testid={`input-${teamType}-goals-for`}
            />
          </div>
          <div>
            <Label>Goals Against</Label>
            <Input
              type="number"
              value={stats.goalsAgainst}
              onChange={(e) => updateStats("goalsAgainst", parseInt(e.target.value) || 0)}
              data-testid={`input-${teamType}-goals-against`}
            />
          </div>
        </div>
      </Card>

      {/* Recent Form */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Recent Form (Last 5 Matches)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Goals Scored (Last 5)</Label>
            <Input
              type="number"
              value={stats.last5GoalsFor}
              onChange={(e) => updateStats("last5GoalsFor", parseInt(e.target.value) || 0)}
              data-testid={`input-${teamType}-last5-goals-for`}
            />
          </div>
          <div>
            <Label>Goals Conceded (Last 5)</Label>
            <Input
              type="number"
              value={stats.last5GoalsAgainst}
              onChange={(e) => updateStats("last5GoalsAgainst", parseInt(e.target.value) || 0)}
              data-testid={`input-${teamType}-last5-goals-against`}
            />
          </div>
        </div>
      </Card>

      {/* Playing Style */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Playing Style</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Average Shots per Match: {stats.avgShots}</Label>
            <Slider
              value={[stats.avgShots]}
              onValueChange={(v) => updateStats("avgShots", v[0])}
              min={5}
              max={25}
              step={1}
              className="mt-2"
              data-testid={`slider-${teamType}-avg-shots`}
            />
          </div>
          <div>
            <Label>Average Shots on Target: {stats.avgShotsOnTarget}</Label>
            <Slider
              value={[stats.avgShotsOnTarget]}
              onValueChange={(v) => updateStats("avgShotsOnTarget", v[0])}
              min={2}
              max={15}
              step={1}
              className="mt-2"
              data-testid={`slider-${teamType}-avg-sot`}
            />
          </div>
          <div>
            <Label>Average Corners: {stats.avgCorners}</Label>
            <Slider
              value={[stats.avgCorners]}
              onValueChange={(v) => updateStats("avgCorners", v[0])}
              min={0}
              max={15}
              step={1}
              className="mt-2"
              data-testid={`slider-${teamType}-avg-corners`}
            />
          </div>
          <div>
            <Label>Discipline (1-10): {stats.discipline}</Label>
            <Slider
              value={[stats.discipline]}
              onValueChange={(v) => updateStats("discipline", v[0])}
              min={1}
              max={10}
              step={1}
              className="mt-2"
              data-testid={`slider-${teamType}-discipline`}
            />
          </div>
        </div>
      </Card>

      {/* Manager & Context */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Manager & Match Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Manager Form (1-10): {stats.managerForm}</Label>
            <Slider
              value={[stats.managerForm]}
              onValueChange={(v) => updateStats("managerForm", v[0])}
              min={1}
              max={10}
              step={1}
              className="mt-2"
              data-testid={`slider-${teamType}-manager-form`}
            />
          </div>
          <div>
            <Label>Match Importance (1-10): {stats.importanceLevel}</Label>
            <Slider
              value={[stats.importanceLevel]}
              onValueChange={(v) => updateStats("importanceLevel", v[0])}
              min={1}
              max={10}
              step={1}
              className="mt-2"
              data-testid={`slider-${teamType}-importance`}
            />
          </div>
          <div>
            <Label>Rest Days: {stats.restDays}</Label>
            <Slider
              value={[stats.restDays]}
              onValueChange={(v) => updateStats("restDays", v[0])}
              min={0}
              max={14}
              step={1}
              className="mt-2"
              data-testid={`slider-${teamType}-rest-days`}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor={`must-win-${teamType}`}>Must-Win Match</Label>
            <Switch
              id={`must-win-${teamType}`}
              checked={stats.mustWin}
              onCheckedChange={(checked) => updateStats("mustWin", checked)}
              data-testid={`switch-${teamType}-must-win`}
            />
          </div>
        </div>
      </Card>
    </>
  );
}
