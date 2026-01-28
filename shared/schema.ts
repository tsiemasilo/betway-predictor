import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const matchScenarios = pgTable("match_scenarios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  competition: text("competition").notNull().default("UEFA Champions League"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  homeTeamStats: jsonb("home_team_stats").notNull(),
  awayTeamStats: jsonb("away_team_stats").notNull(),
  predictionResults: jsonb("prediction_results"),
});

export const insertMatchScenarioSchema = createInsertSchema(matchScenarios).omit({
  id: true,
  createdAt: true,
});

export type InsertMatchScenario = z.infer<typeof insertMatchScenarioSchema>;
export type MatchScenario = typeof matchScenarios.$inferSelect;

export const playerSchema = z.object({
  name: z.string(),
  position: z.string(),
  available: z.boolean(),
  form: z.number().min(1).max(10),
  isStarter: z.boolean(),
});

// Comprehensive TeamStats with all 100 factors organized by category
export const teamStatsSchema = z.object({
  // ============================================
  // 🧠 TEAM FORM & PERFORMANCE (Factors 1-20)
  // ============================================
  
  // Basic season stats
  matchesPlayed: z.number().default(0),
  goalsFor: z.number().default(0),
  goalsAgainst: z.number().default(0),
  cleanSheets: z.number().default(0),
  
  // Form over last 5 matches (Factors 1, 4, 5, 6)
  last5Results: z.array(z.enum(['W', 'D', 'L'])).default([]),
  last5GoalsFor: z.number().default(0),
  last5GoalsAgainst: z.number().default(0),
  
  // Form over last 10 matches (Factor 2)
  last10Results: z.array(z.enum(['W', 'D', 'L'])).default([]),
  last10GoalsFor: z.number().default(0),
  last10GoalsAgainst: z.number().default(0),
  
  // Home/Away form splits (Factor 3)
  homeMatchesPlayed: z.number().default(0),
  homeGoalsFor: z.number().default(0),
  homeGoalsAgainst: z.number().default(0),
  awayMatchesPlayed: z.number().default(0),
  awayGoalsFor: z.number().default(0),
  awayGoalsAgainst: z.number().default(0),
  
  // Advanced form metrics (Factors 7-20)
  comebackAbility: z.number().min(1).max(10).default(5),        // Factor 7: Ability when conceding first
  leadProtection: z.number().min(1).max(10).default(5),          // Factor 8: Ability to hold a lead
  bigTeamPerformance: z.number().min(1).max(10).default(5),      // Factor 9: vs similar-strength opponents
  consistency: z.number().min(1).max(10).default(5),             // Factor 10: Consistency score
  currentStreak: z.number().default(0),                          // Factor 11: Positive = wins, negative = losses
  xG: z.number().optional(),                                     // Factor 13: Expected goals trend
  xGA: z.number().optional(),                                    // Factor 14: Expected goals against trend
  shotConversionRate: z.number().default(0.1),                   // Factor 15: Goals per shot
  chancesCreatedPerMatch: z.number().default(3),                 // Factor 16: Clear chances created
  defensiveErrors: z.number().default(0),                        // Factor 17: Errors leading to goals
  pressurePerformance: z.number().min(1).max(10).default(5),     // Factor 18: Performance in must-win
  lateGoalsScored: z.number().default(0),                        // Factor 19: Goals after 70'
  lateGoalsConceded: z.number().default(0),                      // Factor 20: Conceded after 70'

  // ============================================
  // 🏟️ FIXTURE & CONTEXT (Factors 21-35)
  // ============================================
  
  homeAdvantageStrength: z.number().min(1).max(10).default(7),   // Factor 21: Home advantage in Europe
  travelDistance: z.number().default(0),                         // Factor 22: km traveled
  travelFatigue: z.number().min(0).max(10).default(0),           // Factor 22: Fatigue impact
  weatherImpact: z.number().min(0).max(10).default(0),           // Factor 23: Climate conditions
  pitchQuality: z.number().min(1).max(10).default(7),            // Factor 24: Pitch condition
  kickoffTimeImpact: z.number().min(-2).max(2).default(0),       // Factor 25: Early/late game effect
  stadiumAtmosphere: z.number().min(1).max(10).default(7),       // Factor 26: Hostile venue
  altitude: z.number().default(0),                                // Factor 27: Meters above sea level
  matchCongestion: z.number().default(0),                        // Factor 28: Games in last 7 days
  nextMatchImportance: z.number().min(1).max(10).default(5),     // Factor 29: League match priority
  rotationLikelihood: z.number().min(0).max(100).default(0),     // Factor 30: Rotation %
  restDays: z.number().default(4),                               // Factor 31: Days since last match
  competitionPriority: z.number().min(1).max(10).default(8),     // Factor 32: UCL vs domestic priority
  isSecondLeg: z.boolean().default(false),                       // Factor 33: Second leg context
  firstLegResult: z.string().optional(),                         // Factor 33: First leg score if applicable
  awayGoalPressure: z.number().min(0).max(10).default(0),        // Factor 34: Legacy away goal mindset
  isNeutralVenue: z.boolean().default(false),                    // Factor 35: Neutral venue match

  // ============================================
  // 🧑‍🤝‍🧑 SQUAD & PLAYER FACTORS (Factors 36-55)
  // ============================================
  
  keyPlayerInjuries: z.number().default(0),                      // Factor 36: Number of key injuries
  suspensions: z.number().default(0),                            // Factor 37: Suspended players
  playersReturning: z.number().default(0),                       // Factor 38: Players returning from injury
  squadDepth: z.number().min(1).max(10).default(7),              // Factor 39: Quality of depth
  benchImpact: z.number().min(1).max(10).default(5),             // Factor 40: Bench player quality
  goalkeeperForm: z.number().min(1).max(10).default(6),          // Factor 41: GK current form
  defensiveLeaderAvailable: z.boolean().default(true),           // Factor 42: Key defender fit
  europeanExperience: z.number().min(1).max(10).default(6),      // Factor 43: UCL experience
  newSigningsIntegration: z.number().min(1).max(10).default(7),  // Factor 44: New player chemistry
  captainPresent: z.boolean().default(true),                     // Factor 45: Captain available
  squadAge: z.enum(['young', 'balanced', 'experienced']).default('balanced'), // Factor 46
  teamMorale: z.number().min(1).max(10).default(7),              // Factor 47: Player morale
  internalIssues: z.boolean().default(false),                    // Factor 48: Team drama/issues
  starPlayerFitness: z.number().min(1).max(10).default(8),       // Factor 49: Star player condition
  managerRotationTendency: z.number().min(1).max(10).default(5), // Factor 50: Rotation tendency
  keyPlayerDependence: z.number().min(1).max(10).default(5),     // Factor 51: Reliance on one player
  penaltyTakerAvailable: z.boolean().default(true),              // Factor 52: Penalty taker fit
  setPieceSpecialist: z.boolean().default(true),                 // Factor 53: Set-piece taker fit
  paceThreat: z.number().min(1).max(10).default(6),              // Factor 54: Speed vs defense
  physicalAdvantage: z.number().min(-5).max(5).default(0),       // Factor 55: Physical mismatch

  // Legacy squad fields
  startingXI: z.array(playerSchema).default([]),
  bench: z.array(playerSchema).default([]),
  keyAbsences: z.boolean().default(false),
  absenceImpact: z.number().min(0).max(10).default(0),

  // ============================================
  // 🎯 TACTICS & MATCHUPS (Factors 56-70)
  // ============================================
  
  tacticalStyle: z.enum(['high_press', 'possession', 'counter', 'defensive', 'balanced']).default('balanced'), // Factor 56
  pressResistance: z.number().min(1).max(10).default(6),         // Factor 68: Handle opponent press
  highLineVulnerability: z.number().min(1).max(10).default(5),   // Factor 57: High line risk
  fullbackVsWingerMismatch: z.number().min(-5).max(5).default(0), // Factor 58: Flank battle
  midfieldControl: z.number().min(1).max(10).default(6),         // Factor 59: Midfield dominance
  formationFlexibility: z.number().min(1).max(10).default(5),    // Factor 61: Can change formation
  inGameAdjustments: z.number().min(1).max(10).default(6),       // Factor 62: Tactical changes
  buildUpQuality: z.number().min(1).max(10).default(6),          // Factor 69: Build-up under pressure
  counterAttackThreat: z.number().min(1).max(10).default(6),     // Factor 70: Counter danger
  setPieceDefense: z.number().min(1).max(10).default(6),         // Factor 71: Defending set pieces
  setPieceAttack: z.number().min(1).max(10).default(6),          // Factor 72: Attacking set pieces
  overlappingRuns: z.number().min(1).max(10).default(5),         // Factor 73: Fullback overlaps
  defensiveCompactness: z.number().min(1).max(10).default(6),    // Factor 74: Defensive shape
  tacticalDiscipline: z.number().min(1).max(10).default(6),      // Factor 75: Following game plan

  // Playing style metrics
  avgShots: z.number().default(12),
  avgShotsOnTarget: z.number().default(5),
  avgPossession: z.number().default(50),
  avgCorners: z.number().default(5),
  avgFouls: z.number().default(11),
  avgYellowCards: z.number().default(1.8),
  avgRedCards: z.number().default(0.05),
  crossingTendency: z.number().min(1).max(10).default(5),
  defensivePressure: z.number().min(1).max(10).default(5),
  discipline: z.number().min(1).max(10).default(6),

  // ============================================
  // 🧑‍🏫 MANAGER & CLUB DNA (Factors 71-80)
  // ============================================
  
  managerUCLRecord: z.number().min(1).max(10).default(5),        // Factor 71: UCL track record
  managerKnockoutExperience: z.number().min(1).max(10).default(5), // Factor 72: Knockout experience
  managerH2H: z.number().min(-5).max(5).default(0),              // Factor 73: vs opposing manager
  clubEuropeanPedigree: z.number().min(1).max(10).default(6),    // Factor 74: Club UCL history
  knockoutMentality: z.number().min(1).max(10).default(6),       // Factor 75: Big game mentality
  clutchVsChoke: z.number().min(-5).max(5).default(0),           // Factor 76: History of clutching/choking
  clubPressureExpectations: z.number().min(1).max(10).default(5), // Factor 77: Board/fan pressure
  boardPressureOnManager: z.number().min(1).max(10).default(3),  // Factor 78: Manager job security
  tacticalConservatism: z.number().min(1).max(10).default(5),    // Factor 79: Risk-taking tendency
  substitutionTiming: z.number().min(1).max(10).default(6),      // Factor 80: Sub timing quality
  managerForm: z.number().min(1).max(10).default(5),
  tacticalStability: z.number().min(1).max(10).default(5),

  // ============================================
  // 📊 BETTING & MARKET FACTORS (Factors 81-90)
  // ============================================
  
  oddsMovement: z.number().min(-10).max(10).default(0),          // Factor 81: Opening vs current odds
  sharpMoneyDirection: z.number().min(-5).max(5).default(0),     // Factor 82: Smart money
  publicBettingBias: z.number().min(-5).max(5).default(0),       // Factor 83: Public perception
  lastResultOverreaction: z.number().min(-5).max(5).default(0),  // Factor 84: Market overreaction
  defensiveUnderrating: z.number().min(0).max(5).default(0),     // Factor 85: Underrated defense
  mediaHypeImpact: z.number().min(-5).max(5).default(0),         // Factor 86: Media narrative
  impliedProbability: z.number().min(0).max(100).default(33),    // Factor 87: Bookmaker odds %
  bookmakerMargin: z.number().default(0.05),                     // Factor 88: Juice/vig
  bigNameOverconfidence: z.number().min(0).max(5).default(0),    // Factor 89: Market loves big teams
  trapOddsRisk: z.boolean().default(false),                      // Factor 90: Too good to be true

  // ============================================
  // 🧠 PSYCHOLOGICAL & MOTIVATION (Factors 91-100)
  // ============================================
  
  mustWin: z.boolean().default(false),                           // Factor 91: Must-win situation
  qualificationScenario: z.enum(['safe', 'tight', 'must_win', 'eliminated']).default('safe'), // Factor 92
  revengeNarrative: z.boolean().default(false),                  // Factor 93: Revenge motivation
  underdogMentality: z.number().min(1).max(10).default(5),       // Factor 94: Underdog boost
  pressureHandling: z.number().min(1).max(10).default(6),        // Factor 95: Handle pressure
  confidenceAfterBigResult: z.number().min(-5).max(5).default(0), // Factor 96: Post-big-win confidence
  eliminationFear: z.number().min(1).max(10).default(3),         // Factor 97: Fear impact
  crowdRefereeBias: z.number().min(-3).max(3).default(0),        // Factor 98: Ref influenced by crowd
  teamBelief: z.number().min(1).max(10).default(7),              // Factor 99: Collective belief
  emotionalFatigue: z.number().min(1).max(10).default(3),        // Factor 100: Mental tiredness

  // Context
  importanceLevel: z.number().min(1).max(10).default(8),
  refereeStrictness: z.number().min(1).max(10).default(5),

  // Head-to-head
  h2hMeetings: z.number().default(0),
  h2hWins: z.number().default(0),
  h2hDraws: z.number().default(0),
  h2hLosses: z.number().default(0),
  h2hGoalsFor: z.number().default(0),
  h2hGoalsAgainst: z.number().default(0),
});

export type TeamStats = z.infer<typeof teamStatsSchema>;
export type Player = z.infer<typeof playerSchema>;

// Prediction result schema
export const predictionResultSchema = z.object({
  probabilities: z.object({
    home: z.number(),
    draw: z.number(),
    away: z.number(),
  }),
  expectedGoals: z.object({
    home: z.number(),
    away: z.number(),
  }),
  topScorelines: z.array(z.object({
    score: z.string(),
    probability: z.number(),
  })),
  predictedStats: z.object({
    totalGoals: z.object({ mean: z.number(), min: z.number(), max: z.number() }),
    corners: z.object({
      home: z.object({ mean: z.number(), min: z.number(), max: z.number() }),
      away: z.object({ mean: z.number(), min: z.number(), max: z.number() }),
      total: z.object({ mean: z.number(), min: z.number(), max: z.number() }),
    }),
    shots: z.object({
      home: z.object({ mean: z.number(), min: z.number(), max: z.number() }),
      away: z.object({ mean: z.number(), min: z.number(), max: z.number() }),
    }),
    shotsOnTarget: z.object({
      home: z.object({ mean: z.number(), min: z.number(), max: z.number() }),
      away: z.object({ mean: z.number(), min: z.number(), max: z.number() }),
    }),
    fouls: z.object({
      home: z.object({ mean: z.number(), min: z.number(), max: z.number() }),
      away: z.object({ mean: z.number(), min: z.number(), max: z.number() }),
    }),
    cards: z.object({
      homeYellow: z.object({ mean: z.number(), min: z.number(), max: z.number() }),
      awayYellow: z.object({ mean: z.number(), min: z.number(), max: z.number() }),
      homeRed: z.object({ mean: z.number(), min: z.number(), max: z.number() }),
      awayRed: z.object({ mean: z.number(), min: z.number(), max: z.number() }),
    }),
  }),
  explainability: z.array(z.object({
    factor: z.string(),
    weight: z.number(),
    explanation: z.string(),
  })),
  insights: z.object({
    over25: z.string(),
    btts: z.string(),
    doubleChance: z.string(),
    confidence: z.enum(['Low', 'Medium', 'High']),
  }),
  volatility: z.enum(['Low', 'Medium', 'High']),
  simulationCount: z.number(),
});

export type PredictionResult = z.infer<typeof predictionResultSchema>;
