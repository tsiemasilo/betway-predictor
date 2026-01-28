export interface UCLTeamStats {
  // Form & Performance
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  form: ('W' | 'D' | 'L')[];
  cleanSheets: number;
  xG: number;
  xGA: number;
  
  // Advanced form
  comebackAbility: number;
  leadProtection: number;
  bigTeamPerformance: number;
  consistency: number;
  currentStreak: number;
  shotConversionRate: number;
  chancesCreatedPerMatch: number;
  defensiveErrors: number;
  pressurePerformance: number;
  lateGoalsScored: number;
  lateGoalsConceded: number;
  
  // Match stats
  avgShots: number;
  avgShotsOnTarget: number;
  avgPossession: number;
  avgCorners: number;
  avgFouls: number;
  avgYellowCards: number;
  
  // Squad factors
  squadDepth: number;
  goalkeeperForm: number;
  europeanExperience: number;
  teamMorale: number;
  starPlayerFitness: number;
  keyPlayerDependence: number;
  paceThreat: number;
  
  // Tactics
  tacticalStyle: 'high_press' | 'possession' | 'counter' | 'defensive' | 'balanced';
  pressResistance: number;
  midfieldControl: number;
  counterAttackThreat: number;
  setPieceDefense: number;
  setPieceAttack: number;
  defensiveCompactness: number;
  
  // Manager & Club DNA
  managerUCLRecord: number;
  managerKnockoutExperience: number;
  clubEuropeanPedigree: number;
  knockoutMentality: number;
  clutchVsChoke: number;
  
  // Psychology
  pressureHandling: number;
  teamBelief: number;
  underdogMentality: number;
}

export interface UCLTeam {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  stats: UCLTeamStats;
}

export interface UCLFixture {
  id: number;
  homeTeam: UCLTeam;
  awayTeam: UCLTeam;
  date: string;
  time: string;
  venue: string;
  round: string;
  prediction?: {
    homeGoals: number;
    awayGoals: number;
    homeWinProb: number;
    drawProb: number;
    awayWinProb: number;
  };
}

// Comprehensive team data with all 100 factors
const teams: Record<string, UCLTeam> = {
  liverpool: {
    id: 1,
    name: "Liverpool FC",
    shortName: "Liverpool",
    logo: "https://media.api-sports.io/football/teams/40.png",
    stats: {
      played: 7, won: 7, drawn: 0, lost: 0, goalsFor: 15, goalsAgainst: 2,
      form: ['W','W','W','W','W'], cleanSheets: 5, xG: 14.2, xGA: 3.1,
      comebackAbility: 8, leadProtection: 9, bigTeamPerformance: 9, consistency: 9,
      currentStreak: 7, shotConversionRate: 0.15, chancesCreatedPerMatch: 4.5,
      defensiveErrors: 1, pressurePerformance: 9, lateGoalsScored: 4, lateGoalsConceded: 0,
      avgShots: 15, avgShotsOnTarget: 7, avgPossession: 58, avgCorners: 7, avgFouls: 9, avgYellowCards: 1.2,
      squadDepth: 9, goalkeeperForm: 9, europeanExperience: 9, teamMorale: 10,
      starPlayerFitness: 9, keyPlayerDependence: 4, paceThreat: 9,
      tacticalStyle: 'high_press', pressResistance: 8, midfieldControl: 8,
      counterAttackThreat: 9, setPieceDefense: 8, setPieceAttack: 8, defensiveCompactness: 9,
      managerUCLRecord: 9, managerKnockoutExperience: 9, clubEuropeanPedigree: 10,
      knockoutMentality: 9, clutchVsChoke: 4,
      pressureHandling: 9, teamBelief: 10, underdogMentality: 3
    }
  },
  realMadrid: {
    id: 2,
    name: "Real Madrid",
    shortName: "Real Madrid",
    logo: "https://media.api-sports.io/football/teams/541.png",
    stats: {
      played: 7, won: 4, drawn: 1, lost: 2, goalsFor: 15, goalsAgainst: 10,
      form: ['W','W','L','W','D'], cleanSheets: 2, xG: 13.8, xGA: 9.2,
      comebackAbility: 10, leadProtection: 7, bigTeamPerformance: 9, consistency: 6,
      currentStreak: 0, shotConversionRate: 0.14, chancesCreatedPerMatch: 3.8,
      defensiveErrors: 4, pressurePerformance: 10, lateGoalsScored: 6, lateGoalsConceded: 2,
      avgShots: 16, avgShotsOnTarget: 7, avgPossession: 55, avgCorners: 7, avgFouls: 10, avgYellowCards: 1.8,
      squadDepth: 9, goalkeeperForm: 8, europeanExperience: 10, teamMorale: 7,
      starPlayerFitness: 7, keyPlayerDependence: 6, paceThreat: 9,
      tacticalStyle: 'balanced', pressResistance: 8, midfieldControl: 9,
      counterAttackThreat: 9, setPieceDefense: 6, setPieceAttack: 8, defensiveCompactness: 6,
      managerUCLRecord: 10, managerKnockoutExperience: 10, clubEuropeanPedigree: 10,
      knockoutMentality: 10, clutchVsChoke: 5,
      pressureHandling: 9, teamBelief: 9, underdogMentality: 2
    }
  },
  barcelona: {
    id: 3,
    name: "FC Barcelona",
    shortName: "Barcelona",
    logo: "https://media.api-sports.io/football/teams/529.png",
    stats: {
      played: 7, won: 5, drawn: 1, lost: 1, goalsFor: 18, goalsAgainst: 9,
      form: ['W','W','W','D','W'], cleanSheets: 2, xG: 16.5, xGA: 8.3,
      comebackAbility: 7, leadProtection: 6, bigTeamPerformance: 7, consistency: 7,
      currentStreak: 1, shotConversionRate: 0.16, chancesCreatedPerMatch: 4.2,
      defensiveErrors: 3, pressurePerformance: 7, lateGoalsScored: 3, lateGoalsConceded: 3,
      avgShots: 17, avgShotsOnTarget: 8, avgPossession: 62, avgCorners: 8, avgFouls: 9, avgYellowCards: 1.5,
      squadDepth: 8, goalkeeperForm: 7, europeanExperience: 8, teamMorale: 8,
      starPlayerFitness: 8, keyPlayerDependence: 5, paceThreat: 8,
      tacticalStyle: 'possession', pressResistance: 9, midfieldControl: 9,
      counterAttackThreat: 7, setPieceDefense: 5, setPieceAttack: 7, defensiveCompactness: 6,
      managerUCLRecord: 6, managerKnockoutExperience: 5, clubEuropeanPedigree: 9,
      knockoutMentality: 6, clutchVsChoke: -2,
      pressureHandling: 6, teamBelief: 8, underdogMentality: 3
    }
  },
  bayern: {
    id: 4,
    name: "FC Bayern München",
    shortName: "Bayern",
    logo: "https://media.api-sports.io/football/teams/157.png",
    stats: {
      played: 7, won: 5, drawn: 1, lost: 1, goalsFor: 17, goalsAgainst: 8,
      form: ['W','W','D','W','W'], cleanSheets: 3, xG: 15.8, xGA: 7.2,
      comebackAbility: 8, leadProtection: 7, bigTeamPerformance: 8, consistency: 8,
      currentStreak: 2, shotConversionRate: 0.15, chancesCreatedPerMatch: 4.0,
      defensiveErrors: 2, pressurePerformance: 8, lateGoalsScored: 4, lateGoalsConceded: 2,
      avgShots: 17, avgShotsOnTarget: 8, avgPossession: 60, avgCorners: 8, avgFouls: 9, avgYellowCards: 1.5,
      squadDepth: 9, goalkeeperForm: 8, europeanExperience: 9, teamMorale: 8,
      starPlayerFitness: 9, keyPlayerDependence: 4, paceThreat: 8,
      tacticalStyle: 'high_press', pressResistance: 8, midfieldControl: 8,
      counterAttackThreat: 8, setPieceDefense: 7, setPieceAttack: 8, defensiveCompactness: 7,
      managerUCLRecord: 7, managerKnockoutExperience: 7, clubEuropeanPedigree: 9,
      knockoutMentality: 8, clutchVsChoke: 2,
      pressureHandling: 8, teamBelief: 8, underdogMentality: 2
    }
  },
  inter: {
    id: 5,
    name: "Inter Milan",
    shortName: "Inter",
    logo: "https://media.api-sports.io/football/teams/505.png",
    stats: {
      played: 7, won: 5, drawn: 2, lost: 0, goalsFor: 11, goalsAgainst: 3,
      form: ['W','D','W','W','D'], cleanSheets: 5, xG: 10.2, xGA: 4.1,
      comebackAbility: 6, leadProtection: 9, bigTeamPerformance: 8, consistency: 9,
      currentStreak: 0, shotConversionRate: 0.12, chancesCreatedPerMatch: 3.2,
      defensiveErrors: 1, pressurePerformance: 8, lateGoalsScored: 2, lateGoalsConceded: 0,
      avgShots: 13, avgShotsOnTarget: 5, avgPossession: 52, avgCorners: 5, avgFouls: 11, avgYellowCards: 1.8,
      squadDepth: 8, goalkeeperForm: 9, europeanExperience: 8, teamMorale: 8,
      starPlayerFitness: 8, keyPlayerDependence: 4, paceThreat: 7,
      tacticalStyle: 'defensive', pressResistance: 8, midfieldControl: 7,
      counterAttackThreat: 8, setPieceDefense: 9, setPieceAttack: 7, defensiveCompactness: 9,
      managerUCLRecord: 7, managerKnockoutExperience: 8, clubEuropeanPedigree: 8,
      knockoutMentality: 8, clutchVsChoke: 2,
      pressureHandling: 8, teamBelief: 8, underdogMentality: 4
    }
  },
  manCity: {
    id: 6,
    name: "Manchester City",
    shortName: "Man City",
    logo: "https://media.api-sports.io/football/teams/50.png",
    stats: {
      played: 7, won: 4, drawn: 0, lost: 3, goalsFor: 13, goalsAgainst: 10,
      form: ['W','L','W','W','L'], cleanSheets: 3, xG: 14.5, xGA: 8.8,
      comebackAbility: 7, leadProtection: 6, bigTeamPerformance: 7, consistency: 5,
      currentStreak: -1, shotConversionRate: 0.12, chancesCreatedPerMatch: 4.0,
      defensiveErrors: 4, pressurePerformance: 7, lateGoalsScored: 3, lateGoalsConceded: 3,
      avgShots: 18, avgShotsOnTarget: 8, avgPossession: 65, avgCorners: 8, avgFouls: 8, avgYellowCards: 1.4,
      squadDepth: 9, goalkeeperForm: 7, europeanExperience: 8, teamMorale: 6,
      starPlayerFitness: 7, keyPlayerDependence: 5, paceThreat: 8,
      tacticalStyle: 'possession', pressResistance: 9, midfieldControl: 9,
      counterAttackThreat: 7, setPieceDefense: 6, setPieceAttack: 7, defensiveCompactness: 6,
      managerUCLRecord: 8, managerKnockoutExperience: 7, clubEuropeanPedigree: 6,
      knockoutMentality: 6, clutchVsChoke: -1,
      pressureHandling: 6, teamBelief: 7, underdogMentality: 2
    }
  },
  arsenal: {
    id: 7,
    name: "Arsenal FC",
    shortName: "Arsenal",
    logo: "https://media.api-sports.io/football/teams/42.png",
    stats: {
      played: 7, won: 4, drawn: 2, lost: 1, goalsFor: 12, goalsAgainst: 5,
      form: ['W','D','W','W','D'], cleanSheets: 4, xG: 11.5, xGA: 5.8,
      comebackAbility: 6, leadProtection: 8, bigTeamPerformance: 7, consistency: 7,
      currentStreak: 0, shotConversionRate: 0.13, chancesCreatedPerMatch: 3.5,
      defensiveErrors: 2, pressurePerformance: 7, lateGoalsScored: 2, lateGoalsConceded: 1,
      avgShots: 15, avgShotsOnTarget: 6, avgPossession: 56, avgCorners: 7, avgFouls: 9, avgYellowCards: 1.5,
      squadDepth: 8, goalkeeperForm: 8, europeanExperience: 6, teamMorale: 8,
      starPlayerFitness: 8, keyPlayerDependence: 4, paceThreat: 8,
      tacticalStyle: 'balanced', pressResistance: 7, midfieldControl: 7,
      counterAttackThreat: 7, setPieceDefense: 8, setPieceAttack: 8, defensiveCompactness: 8,
      managerUCLRecord: 5, managerKnockoutExperience: 4, clubEuropeanPedigree: 6,
      knockoutMentality: 5, clutchVsChoke: 0,
      pressureHandling: 6, teamBelief: 8, underdogMentality: 4
    }
  },
  benfica: {
    id: 8,
    name: "SL Benfica",
    shortName: "Benfica",
    logo: "https://media.api-sports.io/football/teams/211.png",
    stats: {
      played: 7, won: 4, drawn: 2, lost: 1, goalsFor: 14, goalsAgainst: 8,
      form: ['W','D','W','W','L'], cleanSheets: 2, xG: 12.8, xGA: 7.5,
      comebackAbility: 7, leadProtection: 6, bigTeamPerformance: 6, consistency: 6,
      currentStreak: -1, shotConversionRate: 0.14, chancesCreatedPerMatch: 3.6,
      defensiveErrors: 3, pressurePerformance: 6, lateGoalsScored: 3, lateGoalsConceded: 2,
      avgShots: 14, avgShotsOnTarget: 6, avgPossession: 54, avgCorners: 6, avgFouls: 11, avgYellowCards: 2.1,
      squadDepth: 7, goalkeeperForm: 7, europeanExperience: 7, teamMorale: 7,
      starPlayerFitness: 8, keyPlayerDependence: 5, paceThreat: 7,
      tacticalStyle: 'balanced', pressResistance: 6, midfieldControl: 6,
      counterAttackThreat: 7, setPieceDefense: 6, setPieceAttack: 7, defensiveCompactness: 6,
      managerUCLRecord: 5, managerKnockoutExperience: 5, clubEuropeanPedigree: 7,
      knockoutMentality: 6, clutchVsChoke: 0,
      pressureHandling: 6, teamBelief: 7, underdogMentality: 6
    }
  },
  dortmund: {
    id: 9,
    name: "Borussia Dortmund",
    shortName: "Dortmund",
    logo: "https://media.api-sports.io/football/teams/165.png",
    stats: {
      played: 7, won: 4, drawn: 1, lost: 2, goalsFor: 14, goalsAgainst: 9,
      form: ['W','L','W','W','D'], cleanSheets: 2, xG: 13.2, xGA: 8.5,
      comebackAbility: 6, leadProtection: 5, bigTeamPerformance: 7, consistency: 5,
      currentStreak: 0, shotConversionRate: 0.13, chancesCreatedPerMatch: 3.8,
      defensiveErrors: 4, pressurePerformance: 7, lateGoalsScored: 4, lateGoalsConceded: 3,
      avgShots: 14, avgShotsOnTarget: 6, avgPossession: 52, avgCorners: 6, avgFouls: 10, avgYellowCards: 1.7,
      squadDepth: 7, goalkeeperForm: 7, europeanExperience: 7, teamMorale: 7,
      starPlayerFitness: 8, keyPlayerDependence: 5, paceThreat: 9,
      tacticalStyle: 'counter', pressResistance: 6, midfieldControl: 6,
      counterAttackThreat: 9, setPieceDefense: 5, setPieceAttack: 6, defensiveCompactness: 5,
      managerUCLRecord: 6, managerKnockoutExperience: 6, clubEuropeanPedigree: 7,
      knockoutMentality: 7, clutchVsChoke: 1,
      pressureHandling: 6, teamBelief: 7, underdogMentality: 5
    }
  },
  psg: {
    id: 10,
    name: "Paris Saint-Germain",
    shortName: "PSG",
    logo: "https://media.api-sports.io/football/teams/85.png",
    stats: {
      played: 7, won: 3, drawn: 2, lost: 2, goalsFor: 8, goalsAgainst: 7,
      form: ['D','W','L','W','D'], cleanSheets: 2, xG: 9.5, xGA: 7.8,
      comebackAbility: 5, leadProtection: 6, bigTeamPerformance: 5, consistency: 5,
      currentStreak: 0, shotConversionRate: 0.10, chancesCreatedPerMatch: 3.2,
      defensiveErrors: 3, pressurePerformance: 5, lateGoalsScored: 1, lateGoalsConceded: 2,
      avgShots: 16, avgShotsOnTarget: 6, avgPossession: 58, avgCorners: 7, avgFouls: 10, avgYellowCards: 1.7,
      squadDepth: 8, goalkeeperForm: 8, europeanExperience: 7, teamMorale: 6,
      starPlayerFitness: 8, keyPlayerDependence: 6, paceThreat: 9,
      tacticalStyle: 'balanced', pressResistance: 7, midfieldControl: 7,
      counterAttackThreat: 8, setPieceDefense: 6, setPieceAttack: 6, defensiveCompactness: 6,
      managerUCLRecord: 5, managerKnockoutExperience: 5, clubEuropeanPedigree: 5,
      knockoutMentality: 4, clutchVsChoke: -3,
      pressureHandling: 4, teamBelief: 6, underdogMentality: 3
    }
  },
  napoli: {
    id: 11,
    name: "SSC Napoli",
    shortName: "Napoli",
    logo: "https://media.api-sports.io/football/teams/492.png",
    stats: {
      played: 7, won: 3, drawn: 2, lost: 2, goalsFor: 10, goalsAgainst: 8,
      form: ['W','D','W','L','D'], cleanSheets: 2, xG: 9.8, xGA: 7.5,
      comebackAbility: 6, leadProtection: 6, bigTeamPerformance: 6, consistency: 6,
      currentStreak: 0, shotConversionRate: 0.12, chancesCreatedPerMatch: 3.0,
      defensiveErrors: 2, pressurePerformance: 6, lateGoalsScored: 2, lateGoalsConceded: 2,
      avgShots: 13, avgShotsOnTarget: 5, avgPossession: 52, avgCorners: 5, avgFouls: 12, avgYellowCards: 2.0,
      squadDepth: 7, goalkeeperForm: 7, europeanExperience: 6, teamMorale: 7,
      starPlayerFitness: 8, keyPlayerDependence: 5, paceThreat: 7,
      tacticalStyle: 'balanced', pressResistance: 6, midfieldControl: 6,
      counterAttackThreat: 7, setPieceDefense: 7, setPieceAttack: 6, defensiveCompactness: 7,
      managerUCLRecord: 6, managerKnockoutExperience: 5, clubEuropeanPedigree: 5,
      knockoutMentality: 5, clutchVsChoke: 0,
      pressureHandling: 6, teamBelief: 7, underdogMentality: 5
    }
  },
  chelsea: {
    id: 12,
    name: "Chelsea FC",
    shortName: "Chelsea",
    logo: "https://media.api-sports.io/football/teams/49.png",
    stats: {
      played: 7, won: 4, drawn: 2, lost: 1, goalsFor: 14, goalsAgainst: 6,
      form: ['W','W','D','W','D'], cleanSheets: 3, xG: 12.5, xGA: 6.8,
      comebackAbility: 6, leadProtection: 7, bigTeamPerformance: 6, consistency: 7,
      currentStreak: 0, shotConversionRate: 0.14, chancesCreatedPerMatch: 3.5,
      defensiveErrors: 2, pressurePerformance: 6, lateGoalsScored: 3, lateGoalsConceded: 1,
      avgShots: 14, avgShotsOnTarget: 6, avgPossession: 55, avgCorners: 6, avgFouls: 10, avgYellowCards: 1.6,
      squadDepth: 9, goalkeeperForm: 7, europeanExperience: 7, teamMorale: 7,
      starPlayerFitness: 8, keyPlayerDependence: 4, paceThreat: 8,
      tacticalStyle: 'balanced', pressResistance: 7, midfieldControl: 7,
      counterAttackThreat: 7, setPieceDefense: 7, setPieceAttack: 7, defensiveCompactness: 7,
      managerUCLRecord: 5, managerKnockoutExperience: 4, clubEuropeanPedigree: 7,
      knockoutMentality: 6, clutchVsChoke: 1,
      pressureHandling: 6, teamBelief: 7, underdogMentality: 4
    }
  },
  psv: {
    id: 13,
    name: "PSV Eindhoven",
    shortName: "PSV",
    logo: "https://media.api-sports.io/football/teams/197.png",
    stats: {
      played: 7, won: 3, drawn: 2, lost: 2, goalsFor: 11, goalsAgainst: 9,
      form: ['W','D','L','W','D'], cleanSheets: 2, xG: 10.5, xGA: 8.5,
      comebackAbility: 5, leadProtection: 5, bigTeamPerformance: 5, consistency: 5,
      currentStreak: 0, shotConversionRate: 0.12, chancesCreatedPerMatch: 3.0,
      defensiveErrors: 3, pressurePerformance: 5, lateGoalsScored: 2, lateGoalsConceded: 2,
      avgShots: 14, avgShotsOnTarget: 6, avgPossession: 53, avgCorners: 6, avgFouls: 11, avgYellowCards: 1.8,
      squadDepth: 6, goalkeeperForm: 6, europeanExperience: 5, teamMorale: 6,
      starPlayerFitness: 7, keyPlayerDependence: 5, paceThreat: 7,
      tacticalStyle: 'balanced', pressResistance: 5, midfieldControl: 6,
      counterAttackThreat: 7, setPieceDefense: 5, setPieceAttack: 6, defensiveCompactness: 5,
      managerUCLRecord: 4, managerKnockoutExperience: 3, clubEuropeanPedigree: 5,
      knockoutMentality: 5, clutchVsChoke: 0,
      pressureHandling: 5, teamBelief: 6, underdogMentality: 7
    }
  },
  newcastle: {
    id: 14,
    name: "Newcastle United",
    shortName: "Newcastle",
    logo: "https://media.api-sports.io/football/teams/34.png",
    stats: {
      played: 7, won: 2, drawn: 3, lost: 2, goalsFor: 7, goalsAgainst: 8,
      form: ['D','W','D','L','W'], cleanSheets: 2, xG: 7.8, xGA: 7.5,
      comebackAbility: 5, leadProtection: 6, bigTeamPerformance: 5, consistency: 5,
      currentStreak: 1, shotConversionRate: 0.10, chancesCreatedPerMatch: 2.5,
      defensiveErrors: 2, pressurePerformance: 5, lateGoalsScored: 1, lateGoalsConceded: 1,
      avgShots: 12, avgShotsOnTarget: 5, avgPossession: 48, avgCorners: 5, avgFouls: 11, avgYellowCards: 1.9,
      squadDepth: 6, goalkeeperForm: 7, europeanExperience: 4, teamMorale: 6,
      starPlayerFitness: 7, keyPlayerDependence: 6, paceThreat: 7,
      tacticalStyle: 'counter', pressResistance: 6, midfieldControl: 5,
      counterAttackThreat: 7, setPieceDefense: 7, setPieceAttack: 6, defensiveCompactness: 7,
      managerUCLRecord: 3, managerKnockoutExperience: 2, clubEuropeanPedigree: 4,
      knockoutMentality: 5, clutchVsChoke: 0,
      pressureHandling: 5, teamBelief: 6, underdogMentality: 7
    }
  },
  galatasaray: {
    id: 15,
    name: "Galatasaray SK",
    shortName: "Galatasaray",
    logo: "https://media.api-sports.io/football/teams/645.png",
    stats: {
      played: 7, won: 2, drawn: 3, lost: 2, goalsFor: 9, goalsAgainst: 8,
      form: ['D','W','D','L','W'], cleanSheets: 2, xG: 8.5, xGA: 8.0,
      comebackAbility: 6, leadProtection: 5, bigTeamPerformance: 5, consistency: 5,
      currentStreak: 1, shotConversionRate: 0.11, chancesCreatedPerMatch: 2.8,
      defensiveErrors: 3, pressurePerformance: 6, lateGoalsScored: 2, lateGoalsConceded: 2,
      avgShots: 12, avgShotsOnTarget: 5, avgPossession: 50, avgCorners: 5, avgFouls: 14, avgYellowCards: 2.5,
      squadDepth: 6, goalkeeperForm: 6, europeanExperience: 6, teamMorale: 7,
      starPlayerFitness: 7, keyPlayerDependence: 5, paceThreat: 7,
      tacticalStyle: 'counter', pressResistance: 5, midfieldControl: 5,
      counterAttackThreat: 7, setPieceDefense: 5, setPieceAttack: 6, defensiveCompactness: 5,
      managerUCLRecord: 4, managerKnockoutExperience: 4, clubEuropeanPedigree: 5,
      knockoutMentality: 6, clutchVsChoke: 0,
      pressureHandling: 6, teamBelief: 7, underdogMentality: 8
    }
  },
  gladbach: {
    id: 16,
    name: "Borussia Mönchengladbach",
    shortName: "Gladbach",
    logo: "https://media.api-sports.io/football/teams/163.png",
    stats: {
      played: 7, won: 2, drawn: 2, lost: 3, goalsFor: 8, goalsAgainst: 11,
      form: ['L','D','W','L','W'], cleanSheets: 1, xG: 7.5, xGA: 10.2,
      comebackAbility: 5, leadProtection: 4, bigTeamPerformance: 4, consistency: 4,
      currentStreak: 1, shotConversionRate: 0.10, chancesCreatedPerMatch: 2.5,
      defensiveErrors: 4, pressurePerformance: 4, lateGoalsScored: 1, lateGoalsConceded: 3,
      avgShots: 11, avgShotsOnTarget: 4, avgPossession: 48, avgCorners: 5, avgFouls: 12, avgYellowCards: 2.2,
      squadDepth: 5, goalkeeperForm: 5, europeanExperience: 4, teamMorale: 5,
      starPlayerFitness: 6, keyPlayerDependence: 5, paceThreat: 6,
      tacticalStyle: 'balanced', pressResistance: 4, midfieldControl: 5,
      counterAttackThreat: 6, setPieceDefense: 5, setPieceAttack: 5, defensiveCompactness: 4,
      managerUCLRecord: 3, managerKnockoutExperience: 2, clubEuropeanPedigree: 4,
      knockoutMentality: 4, clutchVsChoke: -1,
      pressureHandling: 4, teamBelief: 5, underdogMentality: 7
    }
  },
  copenhagen: {
    id: 17,
    name: "FC Copenhagen",
    shortName: "Copenhagen",
    logo: "https://media.api-sports.io/football/teams/400.png",
    stats: {
      played: 7, won: 1, drawn: 2, lost: 4, goalsFor: 5, goalsAgainst: 12,
      form: ['L','D','L','W','L'], cleanSheets: 1, xG: 5.5, xGA: 11.0,
      comebackAbility: 4, leadProtection: 5, bigTeamPerformance: 3, consistency: 4,
      currentStreak: -1, shotConversionRate: 0.08, chancesCreatedPerMatch: 2.0,
      defensiveErrors: 4, pressurePerformance: 4, lateGoalsScored: 1, lateGoalsConceded: 3,
      avgShots: 9, avgShotsOnTarget: 3, avgPossession: 42, avgCorners: 4, avgFouls: 13, avgYellowCards: 2.3,
      squadDepth: 5, goalkeeperForm: 5, europeanExperience: 5, teamMorale: 5,
      starPlayerFitness: 6, keyPlayerDependence: 6, paceThreat: 5,
      tacticalStyle: 'defensive', pressResistance: 4, midfieldControl: 4,
      counterAttackThreat: 5, setPieceDefense: 5, setPieceAttack: 5, defensiveCompactness: 6,
      managerUCLRecord: 3, managerKnockoutExperience: 2, clubEuropeanPedigree: 4,
      knockoutMentality: 4, clutchVsChoke: -1,
      pressureHandling: 4, teamBelief: 5, underdogMentality: 8
    }
  },
  qarabag: {
    id: 18,
    name: "Qarabag FK",
    shortName: "Qarabag",
    logo: "https://media.api-sports.io/football/teams/556.png",
    stats: {
      played: 7, won: 1, drawn: 1, lost: 5, goalsFor: 4, goalsAgainst: 14,
      form: ['L','L','W','L','D'], cleanSheets: 1, xG: 4.2, xGA: 13.0,
      comebackAbility: 3, leadProtection: 4, bigTeamPerformance: 2, consistency: 3,
      currentStreak: 0, shotConversionRate: 0.07, chancesCreatedPerMatch: 1.5,
      defensiveErrors: 5, pressurePerformance: 3, lateGoalsScored: 1, lateGoalsConceded: 4,
      avgShots: 8, avgShotsOnTarget: 3, avgPossession: 38, avgCorners: 3, avgFouls: 15, avgYellowCards: 2.8,
      squadDepth: 4, goalkeeperForm: 5, europeanExperience: 4, teamMorale: 4,
      starPlayerFitness: 6, keyPlayerDependence: 6, paceThreat: 5,
      tacticalStyle: 'defensive', pressResistance: 3, midfieldControl: 3,
      counterAttackThreat: 4, setPieceDefense: 4, setPieceAttack: 4, defensiveCompactness: 5,
      managerUCLRecord: 2, managerKnockoutExperience: 1, clubEuropeanPedigree: 3,
      knockoutMentality: 4, clutchVsChoke: -1,
      pressureHandling: 3, teamBelief: 4, underdogMentality: 9
    }
  },
  clubBrugge: {
    id: 19,
    name: "Club Brugge",
    shortName: "Club Brugge",
    logo: "https://media.api-sports.io/football/teams/569.png",
    stats: {
      played: 7, won: 4, drawn: 1, lost: 2, goalsFor: 9, goalsAgainst: 7,
      form: ['W','W','L','D','W'], cleanSheets: 3, xG: 8.5, xGA: 7.2,
      comebackAbility: 6, leadProtection: 7, bigTeamPerformance: 5, consistency: 6,
      currentStreak: 1, shotConversionRate: 0.11, chancesCreatedPerMatch: 2.8,
      defensiveErrors: 2, pressurePerformance: 6, lateGoalsScored: 2, lateGoalsConceded: 1,
      avgShots: 11, avgShotsOnTarget: 4, avgPossession: 48, avgCorners: 5, avgFouls: 11, avgYellowCards: 1.8,
      squadDepth: 6, goalkeeperForm: 7, europeanExperience: 6, teamMorale: 7,
      starPlayerFitness: 7, keyPlayerDependence: 5, paceThreat: 6,
      tacticalStyle: 'counter', pressResistance: 6, midfieldControl: 5,
      counterAttackThreat: 7, setPieceDefense: 6, setPieceAttack: 6, defensiveCompactness: 7,
      managerUCLRecord: 5, managerKnockoutExperience: 4, clubEuropeanPedigree: 5,
      knockoutMentality: 6, clutchVsChoke: 1,
      pressureHandling: 6, teamBelief: 7, underdogMentality: 8
    }
  },
  marseille: {
    id: 20,
    name: "Olympique Marseille",
    shortName: "Marseille",
    logo: "https://media.api-sports.io/football/teams/81.png",
    stats: {
      played: 7, won: 3, drawn: 2, lost: 2, goalsFor: 10, goalsAgainst: 9,
      form: ['W','D','L','W','D'], cleanSheets: 2, xG: 9.8, xGA: 8.5,
      comebackAbility: 6, leadProtection: 5, bigTeamPerformance: 5, consistency: 5,
      currentStreak: 0, shotConversionRate: 0.11, chancesCreatedPerMatch: 3.0,
      defensiveErrors: 3, pressurePerformance: 5, lateGoalsScored: 2, lateGoalsConceded: 2,
      avgShots: 13, avgShotsOnTarget: 5, avgPossession: 52, avgCorners: 6, avgFouls: 12, avgYellowCards: 2.0,
      squadDepth: 6, goalkeeperForm: 6, europeanExperience: 6, teamMorale: 6,
      starPlayerFitness: 7, keyPlayerDependence: 5, paceThreat: 7,
      tacticalStyle: 'balanced', pressResistance: 5, midfieldControl: 6,
      counterAttackThreat: 6, setPieceDefense: 5, setPieceAttack: 6, defensiveCompactness: 5,
      managerUCLRecord: 4, managerKnockoutExperience: 4, clubEuropeanPedigree: 6,
      knockoutMentality: 5, clutchVsChoke: 0,
      pressureHandling: 5, teamBelief: 6, underdogMentality: 6
    }
  },
  atletico: {
    id: 21,
    name: "Atlético Madrid",
    shortName: "Atlético",
    logo: "https://media.api-sports.io/football/teams/530.png",
    stats: {
      played: 7, won: 5, drawn: 1, lost: 1, goalsFor: 14, goalsAgainst: 7,
      form: ['W','W','D','W','W'], cleanSheets: 3, xG: 12.5, xGA: 7.0,
      comebackAbility: 7, leadProtection: 9, bigTeamPerformance: 8, consistency: 8,
      currentStreak: 2, shotConversionRate: 0.13, chancesCreatedPerMatch: 3.2,
      defensiveErrors: 2, pressurePerformance: 8, lateGoalsScored: 3, lateGoalsConceded: 1,
      avgShots: 12, avgShotsOnTarget: 5, avgPossession: 48, avgCorners: 5, avgFouls: 13, avgYellowCards: 2.2,
      squadDepth: 8, goalkeeperForm: 8, europeanExperience: 9, teamMorale: 8,
      starPlayerFitness: 8, keyPlayerDependence: 4, paceThreat: 7,
      tacticalStyle: 'defensive', pressResistance: 8, midfieldControl: 7,
      counterAttackThreat: 8, setPieceDefense: 9, setPieceAttack: 7, defensiveCompactness: 9,
      managerUCLRecord: 8, managerKnockoutExperience: 9, clubEuropeanPedigree: 7,
      knockoutMentality: 9, clutchVsChoke: 3,
      pressureHandling: 8, teamBelief: 8, underdogMentality: 4
    }
  },
  salzburg: {
    id: 22,
    name: "RB Salzburg",
    shortName: "Salzburg",
    logo: "https://media.api-sports.io/football/teams/571.png",
    stats: {
      played: 7, won: 2, drawn: 1, lost: 4, goalsFor: 7, goalsAgainst: 13,
      form: ['L','W','L','L','W'], cleanSheets: 1, xG: 7.0, xGA: 12.0,
      comebackAbility: 5, leadProtection: 4, bigTeamPerformance: 3, consistency: 4,
      currentStreak: 1, shotConversionRate: 0.09, chancesCreatedPerMatch: 2.5,
      defensiveErrors: 4, pressurePerformance: 5, lateGoalsScored: 2, lateGoalsConceded: 3,
      avgShots: 11, avgShotsOnTarget: 4, avgPossession: 45, avgCorners: 4, avgFouls: 14, avgYellowCards: 2.3,
      squadDepth: 5, goalkeeperForm: 5, europeanExperience: 5, teamMorale: 5,
      starPlayerFitness: 6, keyPlayerDependence: 5, paceThreat: 7,
      tacticalStyle: 'high_press', pressResistance: 5, midfieldControl: 5,
      counterAttackThreat: 6, setPieceDefense: 4, setPieceAttack: 5, defensiveCompactness: 4,
      managerUCLRecord: 4, managerKnockoutExperience: 3, clubEuropeanPedigree: 4,
      knockoutMentality: 5, clutchVsChoke: 0,
      pressureHandling: 5, teamBelief: 5, underdogMentality: 8
    }
  },
  sporting: {
    id: 23,
    name: "Sporting CP",
    shortName: "Sporting",
    logo: "https://media.api-sports.io/football/teams/228.png",
    stats: {
      played: 7, won: 4, drawn: 1, lost: 2, goalsFor: 12, goalsAgainst: 8,
      form: ['W','L','W','W','D'], cleanSheets: 2, xG: 11.2, xGA: 7.8,
      comebackAbility: 6, leadProtection: 6, bigTeamPerformance: 6, consistency: 6,
      currentStreak: 0, shotConversionRate: 0.12, chancesCreatedPerMatch: 3.2,
      defensiveErrors: 3, pressurePerformance: 6, lateGoalsScored: 3, lateGoalsConceded: 2,
      avgShots: 13, avgShotsOnTarget: 5, avgPossession: 54, avgCorners: 6, avgFouls: 11, avgYellowCards: 1.8,
      squadDepth: 6, goalkeeperForm: 7, europeanExperience: 6, teamMorale: 7,
      starPlayerFitness: 7, keyPlayerDependence: 5, paceThreat: 7,
      tacticalStyle: 'balanced', pressResistance: 6, midfieldControl: 6,
      counterAttackThreat: 7, setPieceDefense: 6, setPieceAttack: 6, defensiveCompactness: 6,
      managerUCLRecord: 5, managerKnockoutExperience: 4, clubEuropeanPedigree: 5,
      knockoutMentality: 6, clutchVsChoke: 1,
      pressureHandling: 6, teamBelief: 7, underdogMentality: 7
    }
  },
  bolognaPSG: {
    id: 24,
    name: "Bologna FC",
    shortName: "Bologna",
    logo: "https://media.api-sports.io/football/teams/500.png",
    stats: {
      played: 7, won: 1, drawn: 2, lost: 4, goalsFor: 5, goalsAgainst: 10,
      form: ['L','D','L','W','L'], cleanSheets: 1, xG: 5.5, xGA: 9.5,
      comebackAbility: 4, leadProtection: 5, bigTeamPerformance: 3, consistency: 4,
      currentStreak: -1, shotConversionRate: 0.08, chancesCreatedPerMatch: 2.2,
      defensiveErrors: 4, pressurePerformance: 4, lateGoalsScored: 1, lateGoalsConceded: 3,
      avgShots: 10, avgShotsOnTarget: 3, avgPossession: 46, avgCorners: 4, avgFouls: 12, avgYellowCards: 2.0,
      squadDepth: 5, goalkeeperForm: 5, europeanExperience: 3, teamMorale: 5,
      starPlayerFitness: 6, keyPlayerDependence: 5, paceThreat: 6,
      tacticalStyle: 'balanced', pressResistance: 4, midfieldControl: 5,
      counterAttackThreat: 5, setPieceDefense: 5, setPieceAttack: 5, defensiveCompactness: 5,
      managerUCLRecord: 2, managerKnockoutExperience: 1, clubEuropeanPedigree: 3,
      knockoutMentality: 4, clutchVsChoke: -1,
      pressureHandling: 4, teamBelief: 5, underdogMentality: 8
    }
  },
  juventus: {
    id: 25,
    name: "Juventus",
    shortName: "Juventus",
    logo: "https://media.api-sports.io/football/teams/496.png",
    stats: {
      played: 7, won: 4, drawn: 2, lost: 1, goalsFor: 10, goalsAgainst: 6,
      form: ['W','D','W','D','W'], cleanSheets: 3, xG: 9.5, xGA: 6.2,
      comebackAbility: 6, leadProtection: 8, bigTeamPerformance: 7, consistency: 7,
      currentStreak: 1, shotConversionRate: 0.11, chancesCreatedPerMatch: 2.8,
      defensiveErrors: 2, pressurePerformance: 7, lateGoalsScored: 2, lateGoalsConceded: 1,
      avgShots: 12, avgShotsOnTarget: 5, avgPossession: 52, avgCorners: 5, avgFouls: 11, avgYellowCards: 1.8,
      squadDepth: 7, goalkeeperForm: 7, europeanExperience: 8, teamMorale: 7,
      starPlayerFitness: 7, keyPlayerDependence: 4, paceThreat: 7,
      tacticalStyle: 'defensive', pressResistance: 7, midfieldControl: 7,
      counterAttackThreat: 7, setPieceDefense: 8, setPieceAttack: 6, defensiveCompactness: 8,
      managerUCLRecord: 6, managerKnockoutExperience: 6, clubEuropeanPedigree: 8,
      knockoutMentality: 7, clutchVsChoke: 1,
      pressureHandling: 7, teamBelief: 7, underdogMentality: 3
    }
  },
  monaco: {
    id: 26,
    name: "AS Monaco",
    shortName: "Monaco",
    logo: "https://media.api-sports.io/football/teams/91.png",
    stats: {
      played: 7, won: 4, drawn: 1, lost: 2, goalsFor: 11, goalsAgainst: 8,
      form: ['W','L','W','W','D'], cleanSheets: 2, xG: 10.5, xGA: 7.8,
      comebackAbility: 6, leadProtection: 6, bigTeamPerformance: 5, consistency: 6,
      currentStreak: 0, shotConversionRate: 0.12, chancesCreatedPerMatch: 3.0,
      defensiveErrors: 3, pressurePerformance: 6, lateGoalsScored: 2, lateGoalsConceded: 2,
      avgShots: 13, avgShotsOnTarget: 5, avgPossession: 50, avgCorners: 5, avgFouls: 11, avgYellowCards: 1.8,
      squadDepth: 6, goalkeeperForm: 6, europeanExperience: 5, teamMorale: 7,
      starPlayerFitness: 7, keyPlayerDependence: 5, paceThreat: 8,
      tacticalStyle: 'balanced', pressResistance: 6, midfieldControl: 6,
      counterAttackThreat: 7, setPieceDefense: 5, setPieceAttack: 6, defensiveCompactness: 5,
      managerUCLRecord: 4, managerKnockoutExperience: 4, clubEuropeanPedigree: 5,
      knockoutMentality: 5, clutchVsChoke: 0,
      pressureHandling: 6, teamBelief: 7, underdogMentality: 7
    }
  },
  aston: {
    id: 27,
    name: "Aston Villa",
    shortName: "Aston Villa",
    logo: "https://media.api-sports.io/football/teams/66.png",
    stats: {
      played: 7, won: 4, drawn: 1, lost: 2, goalsFor: 10, goalsAgainst: 7,
      form: ['W','W','L','D','W'], cleanSheets: 2, xG: 9.5, xGA: 7.0,
      comebackAbility: 6, leadProtection: 7, bigTeamPerformance: 6, consistency: 6,
      currentStreak: 1, shotConversionRate: 0.11, chancesCreatedPerMatch: 3.0,
      defensiveErrors: 2, pressurePerformance: 6, lateGoalsScored: 2, lateGoalsConceded: 1,
      avgShots: 12, avgShotsOnTarget: 5, avgPossession: 50, avgCorners: 5, avgFouls: 11, avgYellowCards: 1.8,
      squadDepth: 6, goalkeeperForm: 7, europeanExperience: 4, teamMorale: 7,
      starPlayerFitness: 7, keyPlayerDependence: 5, paceThreat: 7,
      tacticalStyle: 'balanced', pressResistance: 6, midfieldControl: 6,
      counterAttackThreat: 7, setPieceDefense: 6, setPieceAttack: 6, defensiveCompactness: 6,
      managerUCLRecord: 5, managerKnockoutExperience: 4, clubEuropeanPedigree: 4,
      knockoutMentality: 6, clutchVsChoke: 1,
      pressureHandling: 6, teamBelief: 7, underdogMentality: 7
    }
  },
  celtic: {
    id: 28,
    name: "Celtic FC",
    shortName: "Celtic",
    logo: "https://media.api-sports.io/football/teams/247.png",
    stats: {
      played: 7, won: 3, drawn: 1, lost: 3, goalsFor: 10, goalsAgainst: 11,
      form: ['L','W','W','L','W'], cleanSheets: 2, xG: 9.2, xGA: 10.5,
      comebackAbility: 6, leadProtection: 5, bigTeamPerformance: 4, consistency: 5,
      currentStreak: 1, shotConversionRate: 0.11, chancesCreatedPerMatch: 2.8,
      defensiveErrors: 4, pressurePerformance: 5, lateGoalsScored: 2, lateGoalsConceded: 3,
      avgShots: 12, avgShotsOnTarget: 5, avgPossession: 52, avgCorners: 6, avgFouls: 11, avgYellowCards: 1.8,
      squadDepth: 5, goalkeeperForm: 6, europeanExperience: 5, teamMorale: 6,
      starPlayerFitness: 7, keyPlayerDependence: 5, paceThreat: 7,
      tacticalStyle: 'high_press', pressResistance: 5, midfieldControl: 6,
      counterAttackThreat: 6, setPieceDefense: 5, setPieceAttack: 6, defensiveCompactness: 5,
      managerUCLRecord: 4, managerKnockoutExperience: 3, clubEuropeanPedigree: 6,
      knockoutMentality: 5, clutchVsChoke: 0,
      pressureHandling: 5, teamBelief: 7, underdogMentality: 8
    }
  },
  leverkusen: {
    id: 29,
    name: "Bayer Leverkusen",
    shortName: "Leverkusen",
    logo: "https://media.api-sports.io/football/teams/168.png",
    stats: {
      played: 7, won: 5, drawn: 1, lost: 1, goalsFor: 13, goalsAgainst: 7,
      form: ['W','W','D','W','W'], cleanSheets: 3, xG: 12.2, xGA: 7.0,
      comebackAbility: 8, leadProtection: 7, bigTeamPerformance: 8, consistency: 8,
      currentStreak: 2, shotConversionRate: 0.13, chancesCreatedPerMatch: 3.5,
      defensiveErrors: 2, pressurePerformance: 8, lateGoalsScored: 4, lateGoalsConceded: 1,
      avgShots: 15, avgShotsOnTarget: 6, avgPossession: 55, avgCorners: 6, avgFouls: 10, avgYellowCards: 1.5,
      squadDepth: 8, goalkeeperForm: 7, europeanExperience: 7, teamMorale: 9,
      starPlayerFitness: 8, keyPlayerDependence: 4, paceThreat: 8,
      tacticalStyle: 'high_press', pressResistance: 8, midfieldControl: 8,
      counterAttackThreat: 8, setPieceDefense: 7, setPieceAttack: 7, defensiveCompactness: 7,
      managerUCLRecord: 6, managerKnockoutExperience: 5, clubEuropeanPedigree: 6,
      knockoutMentality: 7, clutchVsChoke: 2,
      pressureHandling: 8, teamBelief: 9, underdogMentality: 5
    }
  },
  sparta: {
    id: 30,
    name: "Sparta Prague",
    shortName: "Sparta",
    logo: "https://media.api-sports.io/football/teams/558.png",
    stats: {
      played: 7, won: 2, drawn: 1, lost: 4, goalsFor: 7, goalsAgainst: 12,
      form: ['L','L','W','D','L'], cleanSheets: 1, xG: 6.8, xGA: 11.5,
      comebackAbility: 4, leadProtection: 5, bigTeamPerformance: 3, consistency: 4,
      currentStreak: -1, shotConversionRate: 0.09, chancesCreatedPerMatch: 2.2,
      defensiveErrors: 4, pressurePerformance: 4, lateGoalsScored: 1, lateGoalsConceded: 3,
      avgShots: 10, avgShotsOnTarget: 4, avgPossession: 43, avgCorners: 4, avgFouls: 14, avgYellowCards: 2.3,
      squadDepth: 5, goalkeeperForm: 5, europeanExperience: 4, teamMorale: 5,
      starPlayerFitness: 6, keyPlayerDependence: 5, paceThreat: 6,
      tacticalStyle: 'counter', pressResistance: 4, midfieldControl: 4,
      counterAttackThreat: 6, setPieceDefense: 5, setPieceAttack: 5, defensiveCompactness: 5,
      managerUCLRecord: 3, managerKnockoutExperience: 2, clubEuropeanPedigree: 4,
      knockoutMentality: 4, clutchVsChoke: -1,
      pressureHandling: 4, teamBelief: 5, underdogMentality: 8
    }
  },
  feyenoord: {
    id: 31,
    name: "Feyenoord",
    shortName: "Feyenoord",
    logo: "https://media.api-sports.io/football/teams/215.png",
    stats: {
      played: 7, won: 3, drawn: 1, lost: 3, goalsFor: 12, goalsAgainst: 13,
      form: ['W','L','W','L','D'], cleanSheets: 1, xG: 11.2, xGA: 12.0,
      comebackAbility: 6, leadProtection: 4, bigTeamPerformance: 5, consistency: 5,
      currentStreak: 0, shotConversionRate: 0.12, chancesCreatedPerMatch: 3.2,
      defensiveErrors: 4, pressurePerformance: 5, lateGoalsScored: 3, lateGoalsConceded: 3,
      avgShots: 13, avgShotsOnTarget: 5, avgPossession: 50, avgCorners: 6, avgFouls: 12, avgYellowCards: 2.0,
      squadDepth: 5, goalkeeperForm: 5, europeanExperience: 5, teamMorale: 6,
      starPlayerFitness: 6, keyPlayerDependence: 5, paceThreat: 7,
      tacticalStyle: 'balanced', pressResistance: 5, midfieldControl: 6,
      counterAttackThreat: 7, setPieceDefense: 4, setPieceAttack: 6, defensiveCompactness: 4,
      managerUCLRecord: 4, managerKnockoutExperience: 3, clubEuropeanPedigree: 5,
      knockoutMentality: 5, clutchVsChoke: 0,
      pressureHandling: 5, teamBelief: 6, underdogMentality: 7
    }
  },
  lille: {
    id: 32,
    name: "LOSC Lille",
    shortName: "Lille",
    logo: "https://media.api-sports.io/football/teams/79.png",
    stats: {
      played: 7, won: 4, drawn: 2, lost: 1, goalsFor: 11, goalsAgainst: 6,
      form: ['W','D','W','W','D'], cleanSheets: 3, xG: 10.2, xGA: 6.5,
      comebackAbility: 6, leadProtection: 7, bigTeamPerformance: 6, consistency: 7,
      currentStreak: 0, shotConversionRate: 0.12, chancesCreatedPerMatch: 2.8,
      defensiveErrors: 2, pressurePerformance: 7, lateGoalsScored: 2, lateGoalsConceded: 1,
      avgShots: 11, avgShotsOnTarget: 5, avgPossession: 48, avgCorners: 5, avgFouls: 11, avgYellowCards: 1.8,
      squadDepth: 6, goalkeeperForm: 7, europeanExperience: 6, teamMorale: 7,
      starPlayerFitness: 7, keyPlayerDependence: 5, paceThreat: 7,
      tacticalStyle: 'counter', pressResistance: 6, midfieldControl: 6,
      counterAttackThreat: 7, setPieceDefense: 7, setPieceAttack: 6, defensiveCompactness: 7,
      managerUCLRecord: 5, managerKnockoutExperience: 4, clubEuropeanPedigree: 5,
      knockoutMentality: 6, clutchVsChoke: 1,
      pressureHandling: 6, teamBelief: 7, underdogMentality: 7
    }
  },
  stuttgart: {
    id: 33,
    name: "VfB Stuttgart",
    shortName: "Stuttgart",
    logo: "https://media.api-sports.io/football/teams/172.png",
    stats: {
      played: 7, won: 3, drawn: 1, lost: 3, goalsFor: 10, goalsAgainst: 10,
      form: ['L','W','W','L','W'], cleanSheets: 2, xG: 9.5, xGA: 9.8,
      comebackAbility: 5, leadProtection: 5, bigTeamPerformance: 5, consistency: 5,
      currentStreak: 1, shotConversionRate: 0.11, chancesCreatedPerMatch: 3.0,
      defensiveErrors: 3, pressurePerformance: 5, lateGoalsScored: 2, lateGoalsConceded: 2,
      avgShots: 13, avgShotsOnTarget: 5, avgPossession: 52, avgCorners: 5, avgFouls: 11, avgYellowCards: 1.8,
      squadDepth: 6, goalkeeperForm: 6, europeanExperience: 4, teamMorale: 6,
      starPlayerFitness: 7, keyPlayerDependence: 5, paceThreat: 7,
      tacticalStyle: 'high_press', pressResistance: 5, midfieldControl: 6,
      counterAttackThreat: 6, setPieceDefense: 5, setPieceAttack: 6, defensiveCompactness: 5,
      managerUCLRecord: 3, managerKnockoutExperience: 2, clubEuropeanPedigree: 4,
      knockoutMentality: 5, clutchVsChoke: 0,
      pressureHandling: 5, teamBelief: 6, underdogMentality: 7
    }
  },
  redStar: {
    id: 34,
    name: "Red Star Belgrade",
    shortName: "Red Star",
    logo: "https://media.api-sports.io/football/teams/598.png",
    stats: {
      played: 7, won: 2, drawn: 0, lost: 5, goalsFor: 8, goalsAgainst: 16,
      form: ['L','L','W','L','W'], cleanSheets: 1, xG: 7.5, xGA: 15.0,
      comebackAbility: 4, leadProtection: 4, bigTeamPerformance: 3, consistency: 3,
      currentStreak: 1, shotConversionRate: 0.09, chancesCreatedPerMatch: 2.2,
      defensiveErrors: 5, pressurePerformance: 4, lateGoalsScored: 2, lateGoalsConceded: 4,
      avgShots: 10, avgShotsOnTarget: 4, avgPossession: 40, avgCorners: 4, avgFouls: 15, avgYellowCards: 2.5,
      squadDepth: 4, goalkeeperForm: 5, europeanExperience: 5, teamMorale: 5,
      starPlayerFitness: 6, keyPlayerDependence: 6, paceThreat: 6,
      tacticalStyle: 'counter', pressResistance: 4, midfieldControl: 4,
      counterAttackThreat: 6, setPieceDefense: 4, setPieceAttack: 5, defensiveCompactness: 4,
      managerUCLRecord: 3, managerKnockoutExperience: 2, clubEuropeanPedigree: 5,
      knockoutMentality: 5, clutchVsChoke: -1,
      pressureHandling: 4, teamBelief: 5, underdogMentality: 9
    }
  },
  shakhtarDonetsk: {
    id: 35,
    name: "Shakhtar Donetsk",
    shortName: "Shakhtar",
    logo: "https://media.api-sports.io/football/teams/591.png",
    stats: {
      played: 7, won: 2, drawn: 2, lost: 3, goalsFor: 6, goalsAgainst: 9,
      form: ['D','L','W','D','L'], cleanSheets: 2, xG: 6.2, xGA: 8.5,
      comebackAbility: 5, leadProtection: 5, bigTeamPerformance: 4, consistency: 4,
      currentStreak: -1, shotConversionRate: 0.09, chancesCreatedPerMatch: 2.4,
      defensiveErrors: 3, pressurePerformance: 5, lateGoalsScored: 1, lateGoalsConceded: 2,
      avgShots: 10, avgShotsOnTarget: 4, avgPossession: 48, avgCorners: 5, avgFouls: 12, avgYellowCards: 2.0,
      squadDepth: 5, goalkeeperForm: 6, europeanExperience: 6, teamMorale: 5,
      starPlayerFitness: 6, keyPlayerDependence: 5, paceThreat: 7,
      tacticalStyle: 'balanced', pressResistance: 5, midfieldControl: 5,
      counterAttackThreat: 6, setPieceDefense: 5, setPieceAttack: 5, defensiveCompactness: 5,
      managerUCLRecord: 4, managerKnockoutExperience: 4, clubEuropeanPedigree: 5,
      knockoutMentality: 5, clutchVsChoke: 0,
      pressureHandling: 5, teamBelief: 5, underdogMentality: 7
    }
  },
  brest: {
    id: 36,
    name: "Stade Brestois",
    shortName: "Brest",
    logo: "https://media.api-sports.io/football/teams/106.png",
    stats: {
      played: 7, won: 4, drawn: 2, lost: 1, goalsFor: 10, goalsAgainst: 6,
      form: ['W','D','W','D','W'], cleanSheets: 3, xG: 9.2, xGA: 6.2,
      comebackAbility: 6, leadProtection: 7, bigTeamPerformance: 6, consistency: 7,
      currentStreak: 1, shotConversionRate: 0.11, chancesCreatedPerMatch: 2.8,
      defensiveErrors: 2, pressurePerformance: 7, lateGoalsScored: 2, lateGoalsConceded: 1,
      avgShots: 11, avgShotsOnTarget: 4, avgPossession: 46, avgCorners: 5, avgFouls: 12, avgYellowCards: 1.8,
      squadDepth: 5, goalkeeperForm: 7, europeanExperience: 3, teamMorale: 8,
      starPlayerFitness: 7, keyPlayerDependence: 5, paceThreat: 6,
      tacticalStyle: 'counter', pressResistance: 6, midfieldControl: 5,
      counterAttackThreat: 7, setPieceDefense: 7, setPieceAttack: 6, defensiveCompactness: 7,
      managerUCLRecord: 3, managerKnockoutExperience: 2, clubEuropeanPedigree: 2,
      knockoutMentality: 6, clutchVsChoke: 1,
      pressureHandling: 6, teamBelief: 8, underdogMentality: 9
    }
  }
};

// UCL Round 8 Fixtures - January 28-29, 2026 (All 18 matches)
export const uclRound8Fixtures: UCLFixture[] = [
  {
    id: 1,
    homeTeam: teams.benfica,
    awayTeam: teams.realMadrid,
    date: "2026-01-28",
    time: "21:00",
    venue: "Estádio da Luz",
    round: "League Phase - Round 8"
  },
  {
    id: 2,
    homeTeam: teams.barcelona,
    awayTeam: teams.copenhagen,
    date: "2026-01-28",
    time: "21:00",
    venue: "Camp Nou",
    round: "League Phase - Round 8"
  },
  {
    id: 3,
    homeTeam: teams.manCity,
    awayTeam: teams.galatasaray,
    date: "2026-01-28",
    time: "21:00",
    venue: "Etihad Stadium",
    round: "League Phase - Round 8"
  },
  {
    id: 4,
    homeTeam: teams.liverpool,
    awayTeam: teams.qarabag,
    date: "2026-01-28",
    time: "21:00",
    venue: "Anfield",
    round: "League Phase - Round 8"
  },
  {
    id: 5,
    homeTeam: teams.napoli,
    awayTeam: teams.chelsea,
    date: "2026-01-28",
    time: "21:00",
    venue: "Stadio Diego Armando Maradona",
    round: "League Phase - Round 8"
  },
  {
    id: 6,
    homeTeam: teams.arsenal,
    awayTeam: teams.gladbach,
    date: "2026-01-28",
    time: "21:00",
    venue: "Emirates Stadium",
    round: "League Phase - Round 8"
  },
  {
    id: 7,
    homeTeam: teams.psg,
    awayTeam: teams.newcastle,
    date: "2026-01-28",
    time: "21:00",
    venue: "Parc des Princes",
    round: "League Phase - Round 8"
  },
  {
    id: 8,
    homeTeam: teams.psv,
    awayTeam: teams.bayern,
    date: "2026-01-28",
    time: "21:00",
    venue: "Philips Stadion",
    round: "League Phase - Round 8"
  },
  {
    id: 9,
    homeTeam: teams.dortmund,
    awayTeam: teams.inter,
    date: "2026-01-28",
    time: "21:00",
    venue: "Signal Iduna Park",
    round: "League Phase - Round 8"
  },
  {
    id: 10,
    homeTeam: teams.clubBrugge,
    awayTeam: teams.marseille,
    date: "2026-01-28",
    time: "21:00",
    venue: "Jan Breydel Stadium",
    round: "League Phase - Round 8"
  },
  {
    id: 11,
    homeTeam: teams.atletico,
    awayTeam: teams.salzburg,
    date: "2026-01-28",
    time: "21:00",
    venue: "Metropolitano",
    round: "League Phase - Round 8"
  },
  {
    id: 12,
    homeTeam: teams.sporting,
    awayTeam: teams.bolognaPSG,
    date: "2026-01-28",
    time: "21:00",
    venue: "Estádio José Alvalade",
    round: "League Phase - Round 8"
  },
  {
    id: 13,
    homeTeam: teams.juventus,
    awayTeam: teams.monaco,
    date: "2026-01-28",
    time: "21:00",
    venue: "Allianz Stadium",
    round: "League Phase - Round 8"
  },
  {
    id: 14,
    homeTeam: teams.aston,
    awayTeam: teams.celtic,
    date: "2026-01-28",
    time: "21:00",
    venue: "Villa Park",
    round: "League Phase - Round 8"
  },
  {
    id: 15,
    homeTeam: teams.leverkusen,
    awayTeam: teams.sparta,
    date: "2026-01-28",
    time: "21:00",
    venue: "BayArena",
    round: "League Phase - Round 8"
  },
  {
    id: 16,
    homeTeam: teams.feyenoord,
    awayTeam: teams.lille,
    date: "2026-01-28",
    time: "21:00",
    venue: "De Kuip",
    round: "League Phase - Round 8"
  },
  {
    id: 17,
    homeTeam: teams.stuttgart,
    awayTeam: teams.redStar,
    date: "2026-01-28",
    time: "21:00",
    venue: "MHPArena",
    round: "League Phase - Round 8"
  },
  {
    id: 18,
    homeTeam: teams.shakhtarDonetsk,
    awayTeam: teams.brest,
    date: "2026-01-28",
    time: "21:00",
    venue: "Arena Lviv",
    round: "League Phase - Round 8"
  }
];

export function getTeams() {
  return Object.values(teams);
}

export function getFixtures() {
  return uclRound8Fixtures;
}
