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

  // Calculate expected goals for a team
  private calculateExpectedGoals(
    attackingStats: TeamStats,
    defendingStats: TeamStats,
    isHome: boolean,
    h2hModifier: number
  ): number {
    const attackStrength = this.calculateStrength(attackingStats, isHome);
    const defenseStrength = this.calculateStrength(defendingStats, !isHome);

    // Base attack rate
    let attackRate = attackingStats.matchesPlayed > 0
      ? attackingStats.goalsFor / attackingStats.matchesPlayed
      : 1.2;

    // Defense rate
    let defenseRate = defendingStats.matchesPlayed > 0
      ? defendingStats.goalsAgainst / defendingStats.matchesPlayed
      : 1.2;

    // Apply home advantage
    if (isHome) {
      attackRate *= (1 + this.HOME_ADVANTAGE);
    }

    // Recent form weight
    const recentGoals = attackingStats.last5Results.length > 0
      ? attackingStats.last5GoalsFor / 5
      : attackRate;
    attackRate = attackRate * 0.6 + recentGoals * 0.4;

    // Expected goals
    let lambda = (attackRate * defenseRate * attackStrength) / defenseStrength;
    lambda = lambda * (this.UCL_BASELINE_GOALS / 2.5);

    // H2H modifier
    lambda *= (1 + h2hModifier);

    // Squad impact
    const squadStrength = this.calculateSquadStrength(attackingStats);
    lambda *= squadStrength;

    // Manager form
    lambda *= (attackingStats.managerForm / 10) * 0.2 + 0.8;

    // Context factors
    if (attackingStats.mustWin) {
      lambda *= 1.15;
    }
    lambda *= 1 + (attackingStats.importanceLevel - 5) * 0.02;

    // Fatigue
    const fatigueImpact = (attackingStats.restDays < 3 ? 0.95 : 1.0) * (1 - attackingStats.travelFatigue / 100);
    lambda *= fatigueImpact;

    return Math.max(0.3, lambda);
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

    const homeGoals = this.poissonRandom(lambdaHome);
    const awayGoals = this.poissonRandom(lambdaAway);

    // Shots and shots on target
    const homeShots = this.poissonRandom(homeStats.avgShots * (lambdaHome / 1.5));
    const awayShots = this.poissonRandom(awayStats.avgShots * (lambdaAway / 1.5));
    const homeShotsOnTarget = Math.min(homeShots, this.poissonRandom(homeStats.avgShotsOnTarget * (lambdaHome / 1.5)));
    const awayShotsOnTarget = Math.min(awayShots, this.poissonRandom(awayStats.avgShotsOnTarget * (lambdaAway / 1.5)));

    // Corners
    const homeCornerBase = homeStats.avgCorners * (homeStats.crossingTendency / 5) * (awayStats.defensivePressure / 5);
    const awayCornerBase = awayStats.avgCorners * (awayStats.crossingTendency / 5) * (homeStats.defensivePressure / 5);
    const homeCorners = this.poissonRandom(homeCornerBase);
    const awayCorners = this.poissonRandom(awayCornerBase);

    // Fouls
    const homeFoulBase = homeStats.avgFouls * (1 + (homeStats.importanceLevel - 5) / 10) * (homeStats.refereeStrictness / 5);
    const awayFoulBase = awayStats.avgFouls * (1 + (awayStats.importanceLevel - 5) / 10) * (awayStats.refereeStrictness / 5);
    const homeFouls = this.poissonRandom(homeFoulBase);
    const awayFouls = this.poissonRandom(awayFoulBase);

    // Cards
    const homeCardRate = (homeFouls / homeStats.avgFouls) * (homeStats.avgYellowCards) * (11 - homeStats.discipline) / 10;
    const awayCardRate = (awayFouls / awayStats.avgFouls) * (awayStats.avgYellowCards) * (11 - awayStats.discipline) / 10;
    const homeYellowCards = this.poissonRandom(homeCardRate);
    const awayYellowCards = this.poissonRandom(awayCardRate);

    const homeRedCards = Math.random() < (homeStats.avgRedCards * (11 - homeStats.discipline) / 10) ? 1 : 0;
    const awayRedCards = Math.random() < (awayStats.avgRedCards * (11 - awayStats.discipline) / 10) ? 1 : 0;

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
