import type { TeamStats, PredictionResult } from "@shared/schema";

interface SimulationResult {
  homeGoals: number;
  awayGoals: number;
  homeShots: number;
  awayShots: number;
  homeShotsOnTarget: number;
  awayShotsOnTarget: number;
  homeCorners: number;
  awayCorners: number;
  homeFouls: number;
  awayFouls: number;
  homeYellowCards: number;
  awayYellowCards: number;
  homeRedCards: number;
  awayRedCards: number;
}

export class PredictionEngine {
  private readonly SIMULATIONS = 20000;
  private readonly HOME_ADVANTAGE = 0.15;
  private readonly UCL_BASELINE_GOALS = 2.8;

  // Poisson distribution random sampler
  private poissonRandom(lambda: number): number {
    const L = Math.exp(-lambda);
    let p = 1.0;
    let k = 0;

    do {
      k++;
      p *= Math.random();
    } while (p > L);

    return k - 1;
  }

  // Calculate Elo-like strength rating
  private calculateStrength(stats: TeamStats, isHome: boolean): number {
    let strength = 1.0;

    // Season performance
    if (stats.matchesPlayed > 0) {
      const goalDiff = (stats.goalsFor - stats.goalsAgainst) / stats.matchesPlayed;
      strength += goalDiff * 0.1;
    }

    // Home/Away splits
    if (isHome && stats.homeMatchesPlayed > 0) {
      const homeGoalDiff = (stats.homeGoalsFor - stats.homeGoalsAgainst) / stats.homeMatchesPlayed;
      strength += homeGoalDiff * 0.15;
    } else if (!isHome && stats.awayMatchesPlayed > 0) {
      const awayGoalDiff = (stats.awayGoalsFor - stats.awayGoalsAgainst) / stats.awayMatchesPlayed;
      strength += awayGoalDiff * 0.15;
    }

    // Recent form (last 5)
    const last5Wins = stats.last5Results.filter(r => r === 'W').length;
    const last5Draws = stats.last5Results.filter(r => r === 'D').length;
    const formPoints = (last5Wins * 3 + last5Draws) / 15;
    strength += formPoints * 0.3;

    // xG if available
    if (stats.xG && stats.xGA && stats.matchesPlayed > 0) {
      const xGDiff = (stats.xG - stats.xGA) / stats.matchesPlayed;
      strength += xGDiff * 0.12;
    }

    return Math.max(0.3, strength);
  }

  // Calculate expected goals for a team (realistic UCL range: 0.5 - 2.5)
  private calculateExpectedGoals(
    attackingStats: TeamStats,
    defendingStats: TeamStats,
    isHome: boolean,
    h2hModifier: number
  ): number {
    // UCL league average is ~1.4 goals per team per match
    const UCL_AVG_GOALS_PER_TEAM = 1.4;
    
    // Calculate attack strength relative to league average
    const attackRate = attackingStats.matchesPlayed > 0
      ? attackingStats.goalsFor / attackingStats.matchesPlayed / UCL_AVG_GOALS_PER_TEAM
      : 1.0;

    // Calculate defense weakness relative to league average (how many they concede)
    const defenseWeakness = defendingStats.matchesPlayed > 0
      ? defendingStats.goalsAgainst / defendingStats.matchesPlayed / UCL_AVG_GOALS_PER_TEAM
      : 1.0;

    // Form bonus (last 5 results: W=3, D=1, L=0 points, max 15)
    const formPoints = attackingStats.last5Results.reduce((sum, r) => 
      sum + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);
    const formMultiplier = 0.9 + (formPoints / 15) * 0.2; // Range: 0.9 to 1.1

    // Expected goals = league avg * attack strength * opponent defense weakness * form
    let lambda = UCL_AVG_GOALS_PER_TEAM * attackRate * defenseWeakness * formMultiplier;

    // Home advantage: +10% for home team
    if (isHome) {
      lambda *= 1.10;
    }

    // H2H modifier (very small impact)
    lambda *= (1 + h2hModifier * 0.5);

    // Clamp to realistic range: 0.5 to 2.8 expected goals
    return Math.min(2.8, Math.max(0.5, lambda));
  }

  // Calculate squad strength from players
  private calculateSquadStrength(stats: TeamStats): number {
    if (stats.startingXI.length === 0) return 1.0;

    const availableStarters = stats.startingXI.filter(p => p.available);
    const avgForm = availableStarters.length > 0
      ? availableStarters.reduce((sum, p) => sum + p.form, 0) / availableStarters.length / 10
      : 0.7;

    const absenceImpact = stats.keyAbsences ? 1 - (stats.absenceImpact / 100) : 1.0;

    return avgForm * absenceImpact;
  }

  // Calculate H2H modifier
  private calculateH2HModifier(stats: TeamStats): number {
    if (stats.h2hMeetings === 0) return 0;

    const winRate = stats.h2hWins / stats.h2hMeetings;
    const goalDiff = stats.h2hMeetings > 0
      ? (stats.h2hGoalsFor - stats.h2hGoalsAgainst) / stats.h2hMeetings
      : 0;

    return (winRate - 0.33) * 0.05 + goalDiff * 0.02;
  }

  // Run single simulation
  private runSimulation(homeStats: TeamStats, awayStats: TeamStats): SimulationResult {
    const h2hHomeModifier = this.calculateH2HModifier(homeStats);
    const h2hAwayModifier = this.calculateH2HModifier(awayStats);

    const lambdaHome = this.calculateExpectedGoals(homeStats, awayStats, true, h2hHomeModifier);
    const lambdaAway = this.calculateExpectedGoals(awayStats, homeStats, false, h2hAwayModifier);

    // Goals (capped at 6 per team for realism)
    const homeGoals = Math.min(6, this.poissonRandom(lambdaHome));
    const awayGoals = Math.min(6, this.poissonRandom(lambdaAway));

    // Shots: Use team averages directly (typically 10-18 per team)
    const homeShots = this.poissonRandom(homeStats.avgShots || 12);
    const awayShots = this.poissonRandom(awayStats.avgShots || 12);
    
    // Shots on target: ~40% of total shots
    const homeShotsOnTarget = Math.min(homeShots, this.poissonRandom((homeStats.avgShotsOnTarget || 5)));
    const awayShotsOnTarget = Math.min(awayShots, this.poissonRandom((awayStats.avgShotsOnTarget || 5)));

    // Corners: typically 4-8 per team
    const homeCorners = this.poissonRandom(homeStats.avgCorners || 5);
    const awayCorners = this.poissonRandom(awayStats.avgCorners || 5);

    // Fouls: typically 10-15 per team
    const homeFouls = this.poissonRandom(homeStats.avgFouls || 11);
    const awayFouls = this.poissonRandom(awayStats.avgFouls || 11);

    // Yellow cards: typically 1-3 per team
    const homeYellowCards = this.poissonRandom(homeStats.avgYellowCards || 1.8);
    const awayYellowCards = this.poissonRandom(awayStats.avgYellowCards || 1.8);

    // Red cards: rare (~5% chance per team)
    const homeRedCards = Math.random() < 0.05 ? 1 : 0;
    const awayRedCards = Math.random() < 0.05 ? 1 : 0;

    return {
      homeGoals,
      awayGoals,
      homeShots,
      awayShots,
      homeShotsOnTarget,
      awayShotsOnTarget,
      homeCorners,
      awayCorners,
      homeFouls,
      awayFouls,
      homeYellowCards,
      awayYellowCards,
      homeRedCards,
      awayRedCards,
    };
  }

  // Generate explainability factors
  private generateExplainability(homeStats: TeamStats, awayStats: TeamStats): PredictionResult['explainability'] {
    const factors: PredictionResult['explainability'] = [];

    // Home advantage
    factors.push({
      factor: 'Home Advantage',
      weight: 15,
      explanation: `${homeStats.homeMatchesPlayed > 0 ? `Home team averages ${(homeStats.homeGoalsFor / homeStats.homeMatchesPlayed).toFixed(1)} goals at home` : 'Playing at home provides a 15% boost'}`,
    });

    // Recent form
    const homeFormWins = homeStats.last5Results.filter(r => r === 'W').length;
    const awayFormWins = awayStats.last5Results.filter(r => r === 'W').length;
    factors.push({
      factor: 'Recent Form',
      weight: 30,
      explanation: `Home: ${homeFormWins}/5 wins, Away: ${awayFormWins}/5 wins in last 5 matches`,
    });

    // Attack vs Defense
    const homeAttack = homeStats.matchesPlayed > 0 ? (homeStats.goalsFor / homeStats.matchesPlayed).toFixed(1) : 'N/A';
    const awayDefense = awayStats.matchesPlayed > 0 ? (awayStats.goalsAgainst / awayStats.matchesPlayed).toFixed(1) : 'N/A';
    factors.push({
      factor: 'Attack vs Defense',
      weight: 25,
      explanation: `Home attack (${homeAttack} goals/game) vs Away defense (${awayDefense} conceded/game)`,
    });

    // Squad availability
    if (homeStats.keyAbsences || awayStats.keyAbsences) {
      factors.push({
        factor: 'Injuries/Absences',
        weight: homeStats.absenceImpact + awayStats.absenceImpact,
        explanation: `${homeStats.keyAbsences ? 'Home' : 'Away'} team has key players unavailable`,
      });
    }

    // H2H
    if (homeStats.h2hMeetings > 0) {
      factors.push({
        factor: 'Head-to-Head',
        weight: 5,
        explanation: `${homeStats.h2hWins}W-${homeStats.h2hDraws}D-${homeStats.h2hLosses}L in last ${homeStats.h2hMeetings} meetings`,
      });
    }

    // Rest days
    if (homeStats.restDays < 3 || awayStats.restDays < 3) {
      factors.push({
        factor: 'Fatigue/Rest',
        weight: 10,
        explanation: `${homeStats.restDays < 3 ? 'Home' : 'Away'} team has only ${Math.min(homeStats.restDays, awayStats.restDays)} rest days`,
      });
    }

    // Manager form
    factors.push({
      factor: 'Manager Form',
      weight: 8,
      explanation: `Home manager: ${homeStats.managerForm}/10, Away manager: ${awayStats.managerForm}/10`,
    });

    return factors.sort((a, b) => b.weight - a.weight);
  }

  // Main prediction function
  predict(homeStats: TeamStats, awayStats: TeamStats): PredictionResult {
    const simulations: SimulationResult[] = [];

    // Run Monte Carlo simulations
    for (let i = 0; i < this.SIMULATIONS; i++) {
      simulations.push(this.runSimulation(homeStats, awayStats));
    }

    // Calculate probabilities
    const homeWins = simulations.filter(s => s.homeGoals > s.awayGoals).length;
    const draws = simulations.filter(s => s.homeGoals === s.awayGoals).length;
    const awayWins = simulations.filter(s => s.homeGoals < s.awayGoals).length;

    const probabilities = {
      home: (homeWins / this.SIMULATIONS) * 100,
      draw: (draws / this.SIMULATIONS) * 100,
      away: (awayWins / this.SIMULATIONS) * 100,
    };

    // Expected goals
    const expectedGoals = {
      home: simulations.reduce((sum, s) => sum + s.homeGoals, 0) / this.SIMULATIONS,
      away: simulations.reduce((sum, s) => sum + s.awayGoals, 0) / this.SIMULATIONS,
    };

    // Top scorelines
    const scorelineMap = new Map<string, number>();
    simulations.forEach(s => {
      const key = `${s.homeGoals}-${s.awayGoals}`;
      scorelineMap.set(key, (scorelineMap.get(key) || 0) + 1);
    });

    const topScorelines = Array.from(scorelineMap.entries())
      .map(([score, count]) => ({
        score,
        probability: (count / this.SIMULATIONS) * 100,
      }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5);

    // Calculate stats
    const calculateStats = (values: number[]) => {
      const sorted = values.sort((a, b) => a - b);
      return {
        mean: values.reduce((a, b) => a + b, 0) / values.length,
        min: sorted[Math.floor(sorted.length * 0.1)],
        max: sorted[Math.floor(sorted.length * 0.9)],
      };
    };

    const totalGoals = simulations.map(s => s.homeGoals + s.awayGoals);

    const predictedStats = {
      totalGoals: calculateStats(totalGoals),
      corners: {
        home: calculateStats(simulations.map(s => s.homeCorners)),
        away: calculateStats(simulations.map(s => s.awayCorners)),
        total: calculateStats(simulations.map(s => s.homeCorners + s.awayCorners)),
      },
      shots: {
        home: calculateStats(simulations.map(s => s.homeShots)),
        away: calculateStats(simulations.map(s => s.awayShots)),
      },
      shotsOnTarget: {
        home: calculateStats(simulations.map(s => s.homeShotsOnTarget)),
        away: calculateStats(simulations.map(s => s.awayShotsOnTarget)),
      },
      fouls: {
        home: calculateStats(simulations.map(s => s.homeFouls)),
        away: calculateStats(simulations.map(s => s.awayFouls)),
      },
      cards: {
        homeYellow: calculateStats(simulations.map(s => s.homeYellowCards)),
        awayYellow: calculateStats(simulations.map(s => s.awayYellowCards)),
        homeRed: calculateStats(simulations.map(s => s.homeRedCards)),
        awayRed: calculateStats(simulations.map(s => s.awayRedCards)),
      },
    };

    // Insights
    const over25 = simulations.filter(s => s.homeGoals + s.awayGoals > 2.5).length / this.SIMULATIONS;
    const btts = simulations.filter(s => s.homeGoals > 0 && s.awayGoals > 0).length / this.SIMULATIONS;

    const insights = {
      over25: over25 > 0.55 ? `Lean: Over 2.5 (${(over25 * 100).toFixed(1)}%)` : `Lean: Under 2.5 (${((1 - over25) * 100).toFixed(1)}%)`,
      btts: btts > 0.55 ? `Lean: BTTS Yes (${(btts * 100).toFixed(1)}%)` : `Lean: BTTS No (${((1 - btts) * 100).toFixed(1)}%)`,
      doubleChance: probabilities.home > probabilities.away
        ? `Lean: 1X (${(probabilities.home + probabilities.draw).toFixed(1)}%)`
        : `Lean: X2 (${(probabilities.draw + probabilities.away).toFixed(1)}%)`,
      confidence: (Math.max(probabilities.home, probabilities.draw, probabilities.away) > 50 ? 'High' :
        Math.max(probabilities.home, probabilities.draw, probabilities.away) > 40 ? 'Medium' : 'Low') as 'Low' | 'Medium' | 'High',
    };

    // Volatility
    const stdDev = Math.sqrt(totalGoals.reduce((sum, g) => sum + Math.pow(g - predictedStats.totalGoals.mean, 2), 0) / totalGoals.length);
    const volatility = (stdDev > 1.8 ? 'High' : stdDev > 1.3 ? 'Medium' : 'Low') as 'Low' | 'Medium' | 'High';

    return {
      probabilities,
      expectedGoals,
      topScorelines,
      predictedStats,
      explainability: this.generateExplainability(homeStats, awayStats),
      insights,
      volatility,
      simulationCount: this.SIMULATIONS,
    };
  }
}

export const predictionEngine = new PredictionEngine();
