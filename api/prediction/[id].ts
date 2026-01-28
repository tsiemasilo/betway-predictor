import type { VercelRequest, VercelResponse } from '@vercel/node';
import { predictionEngine } from '../../server/prediction-engine';
import { getFixtures, type UCLTeam } from '../../server/ucl-data';
import type { TeamStats } from '../../shared/schema';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const fixtureId = parseInt(id as string);
    const fixture = getFixtures().find(f => f.id === fixtureId);
    
    if (!fixture) {
      return res.status(404).json({ message: 'Fixture not found' });
    }

    const homeStats = convertToTeamStats(fixture.homeTeam, true);
    const awayStats = convertToTeamStats(fixture.awayTeam, false);
    const prediction = predictionEngine.predict(homeStats, awayStats);

    res.status(200).json({
      fixture,
      prediction
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

function convertToTeamStats(team: UCLTeam, isHome: boolean): TeamStats {
  const s = team.stats;
  
  return {
    matchesPlayed: s.played,
    goalsFor: s.goalsFor,
    goalsAgainst: s.goalsAgainst,
    cleanSheets: s.cleanSheets,
    xG: s.xG,
    xGA: s.xGA,
    last5Results: s.form,
    last5GoalsFor: Math.round(s.goalsFor * 5 / s.played),
    last5GoalsAgainst: Math.round(s.goalsAgainst * 5 / s.played),
    last10Results: [...s.form, ...s.form.slice(0, 5)],
    last10GoalsFor: Math.round(s.goalsFor * 10 / s.played),
    last10GoalsAgainst: Math.round(s.goalsAgainst * 10 / s.played),
    homeMatchesPlayed: Math.ceil(s.played / 2),
    homeGoalsFor: isHome ? Math.round(s.goalsFor * 0.55) : Math.round(s.goalsFor * 0.45),
    homeGoalsAgainst: isHome ? Math.round(s.goalsAgainst * 0.4) : Math.round(s.goalsAgainst * 0.6),
    awayMatchesPlayed: Math.floor(s.played / 2),
    awayGoalsFor: isHome ? Math.round(s.goalsFor * 0.45) : Math.round(s.goalsFor * 0.55),
    awayGoalsAgainst: isHome ? Math.round(s.goalsAgainst * 0.6) : Math.round(s.goalsAgainst * 0.4),
    comebackAbility: s.comebackAbility,
    leadProtection: s.leadProtection,
    bigTeamPerformance: s.bigTeamPerformance,
    consistency: s.consistency,
    currentStreak: s.currentStreak,
    shotConversionRate: s.shotConversionRate,
    chancesCreatedPerMatch: s.chancesCreatedPerMatch,
    defensiveErrors: s.defensiveErrors,
    pressurePerformance: s.pressurePerformance,
    lateGoalsScored: s.lateGoalsScored,
    lateGoalsConceded: s.lateGoalsConceded,
    homeAdvantageStrength: isHome ? 7 : 5,
    travelDistance: isHome ? 0 : 1500,
    travelFatigue: isHome ? 0 : 3,
    weatherImpact: 0,
    pitchQuality: 8,
    kickoffTimeImpact: 0,
    stadiumAtmosphere: isHome ? 8 : 4,
    altitude: 0,
    matchCongestion: 1,
    nextMatchImportance: 6,
    rotationLikelihood: 10,
    restDays: 4,
    competitionPriority: 9,
    isSecondLeg: false,
    awayGoalPressure: 0,
    isNeutralVenue: false,
    keyPlayerInjuries: 0,
    suspensions: 0,
    playersReturning: 0,
    squadDepth: s.squadDepth,
    benchImpact: 6,
    goalkeeperForm: s.goalkeeperForm,
    defensiveLeaderAvailable: true,
    europeanExperience: s.europeanExperience,
    newSigningsIntegration: 7,
    captainPresent: true,
    squadAge: 'balanced',
    teamMorale: s.teamMorale,
    internalIssues: false,
    starPlayerFitness: s.starPlayerFitness,
    managerRotationTendency: 5,
    keyPlayerDependence: s.keyPlayerDependence,
    penaltyTakerAvailable: true,
    setPieceSpecialist: true,
    paceThreat: s.paceThreat,
    physicalAdvantage: 0,
    startingXI: [],
    bench: [],
    keyAbsences: false,
    absenceImpact: 0,
    tacticalStyle: s.tacticalStyle,
    pressResistance: s.pressResistance,
    highLineVulnerability: 5,
    fullbackVsWingerMismatch: 0,
    midfieldControl: s.midfieldControl,
    formationFlexibility: 6,
    inGameAdjustments: 6,
    buildUpQuality: 6,
    counterAttackThreat: s.counterAttackThreat,
    setPieceDefense: s.setPieceDefense,
    setPieceAttack: s.setPieceAttack,
    overlappingRuns: 5,
    defensiveCompactness: s.defensiveCompactness,
    tacticalDiscipline: 6,
    avgShots: s.avgShots,
    avgShotsOnTarget: s.avgShotsOnTarget,
    avgPossession: s.avgPossession,
    avgCorners: s.avgCorners,
    avgFouls: s.avgFouls,
    avgYellowCards: s.avgYellowCards,
    avgRedCards: 0.05,
    crossingTendency: 5,
    defensivePressure: 6,
    discipline: 6,
    managerUCLRecord: s.managerUCLRecord,
    managerKnockoutExperience: s.managerKnockoutExperience,
    managerH2H: 0,
    clubEuropeanPedigree: s.clubEuropeanPedigree,
    knockoutMentality: s.knockoutMentality,
    clutchVsChoke: s.clutchVsChoke,
    clubPressureExpectations: 5,
    boardPressureOnManager: 3,
    tacticalConservatism: 5,
    substitutionTiming: 6,
    managerForm: 6,
    tacticalStability: 6,
    oddsMovement: 0,
    sharpMoneyDirection: 0,
    publicBettingBias: 0,
    lastResultOverreaction: 0,
    defensiveUnderrating: 0,
    mediaHypeImpact: 0,
    impliedProbability: 33,
    bookmakerMargin: 0.05,
    bigNameOverconfidence: 0,
    trapOddsRisk: false,
    mustWin: false,
    qualificationScenario: 'safe',
    revengeNarrative: false,
    underdogMentality: s.underdogMentality,
    pressureHandling: s.pressureHandling,
    confidenceAfterBigResult: 0,
    eliminationFear: 3,
    crowdRefereeBias: isHome ? 1 : 0,
    teamBelief: s.teamBelief,
    emotionalFatigue: 3,
    importanceLevel: 8,
    refereeStrictness: 5,
    h2hMeetings: 0,
    h2hWins: 0,
    h2hDraws: 0,
    h2hLosses: 0,
    h2hGoalsFor: 0,
    h2hGoalsAgainst: 0,
  };
}
