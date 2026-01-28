import type { Express } from "express";
import { createServer, type Server } from "http";
import { predictionEngine } from "./prediction-engine";
import { getFixtures, getTeams, type UCLTeam } from "./ucl-data";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Get all UCL fixtures for tonight
  app.get("/api/fixtures", async (req, res) => {
    try {
      const fixtures = getFixtures();
      
      // Add predictions to each fixture
      const fixturesWithPredictions = fixtures.map(fixture => {
        const homeStats = convertToTeamStats(fixture.homeTeam, true);
        const awayStats = convertToTeamStats(fixture.awayTeam, false);
        const prediction = predictionEngine.predict(homeStats, awayStats);
        
        return {
          ...fixture,
          prediction: {
            homeGoals: Math.round(prediction.expectedGoals.home),
            awayGoals: Math.round(prediction.expectedGoals.away),
            homeWinProb: prediction.probabilities.home,
            drawProb: prediction.probabilities.draw,
            awayWinProb: prediction.probabilities.away,
          }
        };
      });
      
      res.json(fixturesWithPredictions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get detailed prediction for a specific fixture
  app.get("/api/fixtures/:id/prediction", async (req, res) => {
    try {
      const fixtureId = parseInt(req.params.id);
      const fixture = getFixtures().find(f => f.id === fixtureId);
      
      if (!fixture) {
        return res.status(404).json({ message: "Fixture not found" });
      }

      const homeStats = convertToTeamStats(fixture.homeTeam, true);
      const awayStats = convertToTeamStats(fixture.awayTeam, false);
      const prediction = predictionEngine.predict(homeStats, awayStats);

      res.json({
        fixture,
        prediction
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get all teams
  app.get("/api/teams", async (req, res) => {
    try {
      res.json(getTeams());
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", engine: "Monte Carlo (20k sims)", version: "1.0.0" });
  });

  return httpServer;
}

function convertToTeamStats(team: any, isHome: boolean) {
  const stats = team.stats;
  const formResults = stats.form.map((r: string) => r as 'W' | 'D' | 'L');
  
  return {
    matchesPlayed: stats.played,
    goalsFor: stats.goalsFor,
    goalsAgainst: stats.goalsAgainst,
    cleanSheets: stats.cleanSheets,
    last5Results: formResults,
    last5GoalsFor: Math.round(stats.goalsFor * 5 / stats.played),
    last5GoalsAgainst: Math.round(stats.goalsAgainst * 5 / stats.played),
    last10Results: [...formResults, ...formResults.slice(0, 5)],
    last10GoalsFor: Math.round(stats.goalsFor * 10 / stats.played),
    last10GoalsAgainst: Math.round(stats.goalsAgainst * 10 / stats.played),
    homeMatchesPlayed: Math.ceil(stats.played / 2),
    homeGoalsFor: isHome ? Math.round(stats.goalsFor * 0.6) : Math.round(stats.goalsFor * 0.4),
    homeGoalsAgainst: isHome ? Math.round(stats.goalsAgainst * 0.4) : Math.round(stats.goalsAgainst * 0.6),
    awayMatchesPlayed: Math.floor(stats.played / 2),
    awayGoalsFor: isHome ? Math.round(stats.goalsFor * 0.4) : Math.round(stats.goalsFor * 0.6),
    awayGoalsAgainst: isHome ? Math.round(stats.goalsAgainst * 0.6) : Math.round(stats.goalsAgainst * 0.4),
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
    managerForm: 5 + (stats.won - stats.lost) * 0.5,
    tacticalStability: 5,
    importanceLevel: 8,
    mustWin: stats.played === 7 && stats.won < 3,
    restDays: 4,
    travelFatigue: isHome ? 0 : 3,
    weatherImpact: 0,
    refereeStrictness: 5,
    avgShots: stats.avgShots,
    avgShotsOnTarget: stats.avgShotsOnTarget,
    avgPossession: 50,
    avgCorners: stats.avgCorners,
    avgFouls: stats.avgFouls,
    avgYellowCards: stats.avgYellowCards,
    avgRedCards: 0.1,
    crossingTendency: 5,
    defensivePressure: 5,
    discipline: 10 - stats.avgYellowCards,
  };
}
