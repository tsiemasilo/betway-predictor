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
  private readonly UCL_AVG_GOALS_PER_TEAM = 1.40; // UCL average

  // Poisson distribution random sampler
  private poissonRandom(lambda: number): number {
    if (lambda <= 0) return 0;
    const L = Math.exp(-lambda);
    let p = 1.0;
    let k = 0;
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    return k - 1;
  }

  // ============================================
  // FACTOR CALCULATIONS (All 100 factors grouped)
  // ============================================

  // Form Score (Factors 1-20): Recent performance and trends
  private calculateFormScore(stats: TeamStats): number {
    let score = 0;
    
    // Factor 1-2: Recent form (last 5 and 10 matches)
    const last5Points = stats.last5Results.reduce((sum, r) => 
      sum + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);
    score += (last5Points / 15) * 0.15; // Max 0.15
    
    const last10Points = stats.last10Results.reduce((sum, r) => 
      sum + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);
    score += (last10Points / 30) * 0.10; // Max 0.10
    
    // Factor 4-5: Goals scored/conceded recently
    const recentGoalDiff = (stats.last5GoalsFor - stats.last5GoalsAgainst) / 5;
    score += Math.max(-0.1, Math.min(0.1, recentGoalDiff * 0.05));
    
    // Factor 6: Clean sheets
    const cleanSheetRate = stats.matchesPlayed > 0 ? stats.cleanSheets / stats.matchesPlayed : 0;
    score += cleanSheetRate * 0.05;
    
    // Factor 7: Comeback ability
    score += ((stats.comebackAbility || 5) - 5) / 50;
    
    // Factor 8: Lead protection
    score += ((stats.leadProtection || 5) - 5) / 50;
    
    // Factor 9: Performance vs big teams
    score += ((stats.bigTeamPerformance || 5) - 5) / 50;
    
    // Factor 10: Consistency
    score += ((stats.consistency || 5) - 5) / 50;
    
    // Factor 11: Current streak
    score += (stats.currentStreak || 0) * 0.01;
    
    // Factor 13-14: xG trends
    if (stats.xG && stats.xGA && stats.matchesPlayed > 0) {
      const xGDiff = (stats.xG - stats.xGA) / stats.matchesPlayed;
      score += Math.max(-0.1, Math.min(0.1, xGDiff * 0.03));
    }
    
    // Factor 15: Shot conversion rate
    score += ((stats.shotConversionRate || 0.1) - 0.1) * 0.5;
    
    // Factor 16: Chances created
    score += ((stats.chancesCreatedPerMatch || 3) - 3) * 0.02;
    
    // Factor 17: Defensive errors (negative)
    score -= (stats.defensiveErrors || 0) * 0.01;
    
    // Factor 18: Pressure performance
    score += ((stats.pressurePerformance || 5) - 5) / 50;
    
    // Factor 19-20: Late goals
    score += (stats.lateGoalsScored || 0) * 0.005;
    score -= (stats.lateGoalsConceded || 0) * 0.005;
    
    return score;
  }

  // Context Score (Factors 21-35): Match circumstances
  private calculateContextScore(stats: TeamStats, isHome: boolean): number {
    let score = 0;
    
    // Factor 21: Home advantage in Europe
    if (isHome) {
      score += ((stats.homeAdvantageStrength || 7) / 10) * 0.12;
    }
    
    // Factor 22: Travel fatigue (away team penalty)
    if (!isHome) {
      score -= (stats.travelFatigue || 0) / 100;
    }
    
    // Factor 23-27: Environmental factors
    score -= (stats.weatherImpact || 0) / 100;
    score += ((stats.pitchQuality || 7) - 5) / 100;
    score += (stats.kickoffTimeImpact || 0) / 50;
    if (isHome) {
      score += ((stats.stadiumAtmosphere || 7) - 5) / 50;
    }
    
    // Factor 28-31: Fatigue and rest
    score -= (stats.matchCongestion || 0) * 0.01;
    const restBonus = Math.min((stats.restDays || 4) - 3, 2) * 0.01;
    score += restBonus;
    
    // Factor 30: Rotation (reduces quality but players fresher)
    score -= (stats.rotationLikelihood || 0) / 500;
    
    // Factor 32: Competition priority
    score += ((stats.competitionPriority || 8) - 5) / 30;
    
    // Factor 33-34: Knockout context
    if (stats.isSecondLeg) {
      score += (stats.awayGoalPressure || 0) / 100;
    }
    
    return score;
  }

  // Squad Score (Factors 36-55): Player availability and quality
  private calculateSquadScore(stats: TeamStats): number {
    let score = 0;
    
    // Factor 36-38: Injuries and suspensions
    score -= (stats.keyPlayerInjuries || 0) * 0.02;
    score -= (stats.suspensions || 0) * 0.015;
    score += (stats.playersReturning || 0) * 0.01;
    
    // Factor 39-40: Squad depth and bench
    score += ((stats.squadDepth || 7) - 5) / 30;
    score += ((stats.benchImpact || 5) - 5) / 50;
    
    // Factor 41: Goalkeeper form
    score += ((stats.goalkeeperForm || 6) - 5) / 30;
    
    // Factor 42: Defensive leader
    if (!stats.defensiveLeaderAvailable) score -= 0.03;
    
    // Factor 43: European experience
    score += ((stats.europeanExperience || 6) - 5) / 30;
    
    // Factor 44: New signings integration
    score += ((stats.newSigningsIntegration || 7) - 5) / 50;
    
    // Factor 45: Captain presence
    if (!stats.captainPresent) score -= 0.02;
    
    // Factor 46: Squad age
    if (stats.squadAge === 'experienced') score += 0.02;
    else if (stats.squadAge === 'young') score -= 0.01;
    
    // Factor 47: Team morale
    score += ((stats.teamMorale || 7) - 5) / 25;
    
    // Factor 48: Internal issues
    if (stats.internalIssues) score -= 0.05;
    
    // Factor 49: Star player fitness
    score += ((stats.starPlayerFitness || 8) - 7) / 30;
    
    // Factor 51: Key player dependence (vulnerability)
    score -= ((stats.keyPlayerDependence || 5) - 5) / 50;
    
    // Factor 54: Pace threat
    score += ((stats.paceThreat || 6) - 5) / 50;
    
    // Factor 55: Physical advantage
    score += (stats.physicalAdvantage || 0) / 50;
    
    return score;
  }

  // Tactical Score (Factors 56-70): Style and matchup advantages
  private calculateTacticalScore(stats: TeamStats, opponentStats: TeamStats): number {
    let score = 0;
    
    // Factor 56: Tactical style matchups
    const style = stats.tacticalStyle || 'balanced';
    const oppStyle = opponentStats.tacticalStyle || 'balanced';
    
    // Counter beats high press, possession beats defensive
    if (style === 'counter' && oppStyle === 'high_press') score += 0.05;
    if (style === 'possession' && oppStyle === 'defensive') score += 0.03;
    if (style === 'high_press' && oppStyle === 'possession') score += 0.02;
    
    // Factor 57: High line vulnerability (opponent's pace vs our line)
    if ((opponentStats.paceThreat || 6) > 7 && (stats.highLineVulnerability || 5) > 5) {
      score -= 0.02;
    }
    
    // Factor 59: Midfield control
    score += ((stats.midfieldControl || 6) - 5) / 40;
    
    // Factor 61-62: Tactical flexibility
    score += ((stats.formationFlexibility || 5) - 5) / 50;
    score += ((stats.inGameAdjustments || 6) - 5) / 40;
    
    // Factor 68: Press resistance
    score += ((stats.pressResistance || 6) - 5) / 40;
    
    // Factor 70: Counter attack threat
    score += ((stats.counterAttackThreat || 6) - 5) / 40;
    
    // Factor 71-72: Set pieces
    score += ((stats.setPieceAttack || 6) - 5) / 40;
    score += ((stats.setPieceDefense || 6) - 5) / 50;
    
    // Factor 74: Defensive compactness
    score += ((stats.defensiveCompactness || 6) - 5) / 40;
    
    // Factor 75: Tactical discipline
    score += ((stats.tacticalDiscipline || 6) - 5) / 50;
    
    return score;
  }

  // Manager & DNA Score (Factors 71-80)
  private calculateManagerScore(stats: TeamStats): number {
    let score = 0;
    
    // Factor 71-72: Manager UCL record
    score += ((stats.managerUCLRecord || 5) - 5) / 25;
    score += ((stats.managerKnockoutExperience || 5) - 5) / 30;
    
    // Factor 73: Manager H2H
    score += (stats.managerH2H || 0) / 50;
    
    // Factor 74: Club European pedigree
    score += ((stats.clubEuropeanPedigree || 6) - 5) / 25;
    
    // Factor 75: Knockout mentality
    score += ((stats.knockoutMentality || 6) - 5) / 25;
    
    // Factor 76: Clutch vs choke history
    score += (stats.clutchVsChoke || 0) / 25;
    
    // Factor 77-78: Pressure and job security
    score -= ((stats.clubPressureExpectations || 5) - 5) / 100;
    score -= ((stats.boardPressureOnManager || 3) - 3) / 50;
    
    // Factor 80: Substitution timing
    score += ((stats.substitutionTiming || 6) - 5) / 50;
    
    return score;
  }

  // Psychology Score (Factors 91-100)
  private calculatePsychologyScore(stats: TeamStats, isHome: boolean): number {
    let score = 0;
    
    // Factor 91: Must-win situation (can boost or hinder)
    if (stats.mustWin) {
      score += (stats.pressureHandling || 6) > 6 ? 0.05 : -0.03;
    }
    
    // Factor 92: Qualification scenario
    const scenario = stats.qualificationScenario || 'safe';
    if (scenario === 'must_win') score -= 0.02;
    else if (scenario === 'safe') score += 0.02;
    
    // Factor 93: Revenge narrative
    if (stats.revengeNarrative) score += 0.02;
    
    // Factor 94: Underdog mentality (helps underdogs)
    if ((stats.underdogMentality || 5) > 7) {
      score += 0.02;
    }
    
    // Factor 95: Pressure handling
    score += ((stats.pressureHandling || 6) - 5) / 30;
    
    // Factor 96: Confidence after big result
    score += (stats.confidenceAfterBigResult || 0) / 50;
    
    // Factor 97: Elimination fear (negative)
    score -= ((stats.eliminationFear || 3) - 3) / 50;
    
    // Factor 98: Crowd referee bias
    if (isHome) {
      score += (stats.crowdRefereeBias || 0) / 100;
    }
    
    // Factor 99: Team belief
    score += ((stats.teamBelief || 7) - 5) / 25;
    
    // Factor 100: Emotional fatigue
    score -= ((stats.emotionalFatigue || 3) - 3) / 50;
    
    return score;
  }

  // ============================================
  // MAIN EXPECTED GOALS CALCULATION
  // ============================================

  private calculateExpectedGoals(
    attackingStats: TeamStats,
    defendingStats: TeamStats,
    isHome: boolean
  ): number {
    // Base attack/defense rates from season stats
    const attackRate = attackingStats.matchesPlayed > 0
      ? (attackingStats.goalsFor / attackingStats.matchesPlayed) / this.UCL_AVG_GOALS_PER_TEAM
      : 1.0;

    const defenseWeakness = defendingStats.matchesPlayed > 0
      ? (defendingStats.goalsAgainst / defendingStats.matchesPlayed) / this.UCL_AVG_GOALS_PER_TEAM
      : 1.0;

    // Calculate all factor modifiers
    const formModifier = 1 + this.calculateFormScore(attackingStats);
    const contextModifier = 1 + this.calculateContextScore(attackingStats, isHome);
    const squadModifier = 1 + this.calculateSquadScore(attackingStats);
    const tacticalModifier = 1 + this.calculateTacticalScore(attackingStats, defendingStats);
    const managerModifier = 1 + this.calculateManagerScore(attackingStats);
    const psychologyModifier = 1 + this.calculatePsychologyScore(attackingStats, isHome);

    // Opponent's defensive quality reduces expected goals
    const oppDefenseQuality = 1 - (this.calculateSquadScore(defendingStats) * 0.3);
    const oppTacticalDefense = 1 - (this.calculateTacticalScore(defendingStats, attackingStats) * 0.2);

    // Combine all factors
    let lambda = this.UCL_AVG_GOALS_PER_TEAM;
    lambda *= attackRate;
    lambda *= Math.sqrt(defenseWeakness); // Square root to prevent extreme values
    lambda *= formModifier;
    lambda *= contextModifier;
    lambda *= squadModifier;
    lambda *= tacticalModifier;
    lambda *= managerModifier;
    lambda *= psychologyModifier;
    lambda *= oppDefenseQuality;
    lambda *= oppTacticalDefense;

    // Clamp to realistic range: 0.4 to 3.0 expected goals
    return Math.min(3.0, Math.max(0.4, lambda));
  }

  // Run single simulation
  private runSimulation(homeStats: TeamStats, awayStats: TeamStats): SimulationResult {
    const lambdaHome = this.calculateExpectedGoals(homeStats, awayStats, true);
    const lambdaAway = this.calculateExpectedGoals(awayStats, homeStats, false);

    // Goals (capped at 6 per team for extreme realism)
    const homeGoals = Math.min(6, this.poissonRandom(lambdaHome));
    const awayGoals = Math.min(6, this.poissonRandom(lambdaAway));

    // Shots based on team averages and dominance
    const dominance = lambdaHome / (lambdaHome + lambdaAway);
    const homeShots = this.poissonRandom((homeStats.avgShots || 12) * (0.7 + dominance * 0.6));
    const awayShots = this.poissonRandom((awayStats.avgShots || 12) * (0.7 + (1 - dominance) * 0.6));
    
    // Shots on target
    const homeShotsOnTarget = Math.min(homeShots, this.poissonRandom(homeStats.avgShotsOnTarget || 5));
    const awayShotsOnTarget = Math.min(awayShots, this.poissonRandom(awayStats.avgShotsOnTarget || 5));

    // Corners
    const homeCorners = this.poissonRandom((homeStats.avgCorners || 5) * (0.8 + dominance * 0.4));
    const awayCorners = this.poissonRandom((awayStats.avgCorners || 5) * (0.8 + (1 - dominance) * 0.4));

    // Fouls
    const homeFouls = this.poissonRandom(homeStats.avgFouls || 11);
    const awayFouls = this.poissonRandom(awayStats.avgFouls || 11);

    // Yellow cards
    const homeYellowCards = this.poissonRandom(homeStats.avgYellowCards || 1.8);
    const awayYellowCards = this.poissonRandom(awayStats.avgYellowCards || 1.8);

    // Red cards (~5% chance)
    const homeRedCards = Math.random() < 0.05 ? 1 : 0;
    const awayRedCards = Math.random() < 0.05 ? 1 : 0;

    return {
      homeGoals, awayGoals,
      homeShots, awayShots,
      homeShotsOnTarget, awayShotsOnTarget,
      homeCorners, awayCorners,
      homeFouls, awayFouls,
      homeYellowCards, awayYellowCards,
      homeRedCards, awayRedCards,
    };
  }

  // Generate explainability factors
  private generateExplainability(homeStats: TeamStats, awayStats: TeamStats): PredictionResult['explainability'] {
    const factors: PredictionResult['explainability'] = [];

    // Form comparison
    const homeFormScore = this.calculateFormScore(homeStats);
    const awayFormScore = this.calculateFormScore(awayStats);
    factors.push({
      factor: 'Recent Form',
      weight: 25,
      explanation: `Home form: ${homeFormScore > 0 ? '+' : ''}${(homeFormScore * 100).toFixed(1)}%, Away form: ${awayFormScore > 0 ? '+' : ''}${(awayFormScore * 100).toFixed(1)}%`,
    });

    // Home advantage
    factors.push({
      factor: 'Home Advantage',
      weight: 12,
      explanation: `Stadium atmosphere rated ${homeStats.stadiumAtmosphere || 7}/10, travel fatigue for away: ${awayStats.travelFatigue || 0}/10`,
    });

    // Squad quality
    const homeSquadScore = this.calculateSquadScore(homeStats);
    const awaySquadScore = this.calculateSquadScore(awayStats);
    factors.push({
      factor: 'Squad Quality',
      weight: 18,
      explanation: `Home depth: ${homeStats.squadDepth || 7}/10, Away depth: ${awayStats.squadDepth || 7}/10`,
    });

    // Tactical matchup
    factors.push({
      factor: 'Tactical Matchup',
      weight: 15,
      explanation: `${homeStats.tacticalStyle || 'balanced'} vs ${awayStats.tacticalStyle || 'balanced'} - Midfield control: Home ${homeStats.midfieldControl || 6}/10 vs Away ${awayStats.midfieldControl || 6}/10`,
    });

    // European pedigree
    factors.push({
      factor: 'UCL Experience',
      weight: 10,
      explanation: `Home manager UCL record: ${homeStats.managerUCLRecord || 5}/10, Away: ${awayStats.managerUCLRecord || 5}/10`,
    });

    // Psychology
    const homePsych = this.calculatePsychologyScore(homeStats, true);
    const awayPsych = this.calculatePsychologyScore(awayStats, false);
    factors.push({
      factor: 'Mentality',
      weight: 10,
      explanation: `Home belief: ${homeStats.teamBelief || 7}/10, Away belief: ${awayStats.teamBelief || 7}/10`,
    });

    // Key absences
    if ((homeStats.keyPlayerInjuries || 0) > 0 || (awayStats.keyPlayerInjuries || 0) > 0) {
      factors.push({
        factor: 'Injuries',
        weight: 8,
        explanation: `Home missing ${homeStats.keyPlayerInjuries || 0} key players, Away missing ${awayStats.keyPlayerInjuries || 0}`,
      });
    }

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
      const sorted = [...values].sort((a, b) => a - b);
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
      over25: over25 > 0.55 ? `Over 2.5 (${(over25 * 100).toFixed(0)}%)` : `Under 2.5 (${((1 - over25) * 100).toFixed(0)}%)`,
      btts: btts > 0.55 ? `BTTS Yes (${(btts * 100).toFixed(0)}%)` : `BTTS No (${((1 - btts) * 100).toFixed(0)}%)`,
      doubleChance: probabilities.home > probabilities.away
        ? `1X (${(probabilities.home + probabilities.draw).toFixed(0)}%)`
        : `X2 (${(probabilities.draw + probabilities.away).toFixed(0)}%)`,
      confidence: (Math.max(probabilities.home, probabilities.draw, probabilities.away) > 55 ? 'High' :
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
