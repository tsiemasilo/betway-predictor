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
  
  // Team stats
  homeTeamStats: jsonb("home_team_stats").notNull(),
  awayTeamStats: jsonb("away_team_stats").notNull(),
  
  // Prediction results
  predictionResults: jsonb("prediction_results"),
});

export const insertMatchScenarioSchema = createInsertSchema(matchScenarios).omit({
  id: true,
  createdAt: true,
});

export type InsertMatchScenario = z.infer<typeof insertMatchScenarioSchema>;
export type MatchScenario = typeof matchScenarios.$inferSelect;

// Validation schemas for team stats
export const playerSchema = z.object({
  name: z.string(),
  position: z.string(),
  available: z.boolean(),
  form: z.number().min(1).max(10),
  isStarter: z.boolean(),
});

export const teamStatsSchema = z.object({
  // Season stats
  matchesPlayed: z.number().default(0),
  goalsFor: z.number().default(0),
  goalsAgainst: z.number().default(0),
  xG: z.number().optional(),
  xGA: z.number().optional(),
  cleanSheets: z.number().default(0),
  
  // Recent form
  last5Results: z.array(z.enum(['W', 'D', 'L'])).default([]),
  last5GoalsFor: z.number().default(0),
  last5GoalsAgainst: z.number().default(0),
  last10Results: z.array(z.enum(['W', 'D', 'L'])).default([]),
  last10GoalsFor: z.number().default(0),
  last10GoalsAgainst: z.number().default(0),
  
  // Home/Away form splits
  homeMatchesPlayed: z.number().default(0),
  homeGoalsFor: z.number().default(0),
  homeGoalsAgainst: z.number().default(0),
  awayMatchesPlayed: z.number().default(0),
  awayGoalsFor: z.number().default(0),
  awayGoalsAgainst: z.number().default(0),
  
  // Head-to-head
  h2hMeetings: z.number().default(0),
  h2hWins: z.number().default(0),
  h2hDraws: z.number().default(0),
  h2hLosses: z.number().default(0),
  h2hGoalsFor: z.number().default(0),
  h2hGoalsAgainst: z.number().default(0),
  
  // Squad
  startingXI: z.array(playerSchema).default([]),
  bench: z.array(playerSchema).default([]),
  keyAbsences: z.boolean().default(false),
  absenceImpact: z.number().min(0).max(10).default(0),
  
  // Manager
  managerForm: z.number().min(1).max(10).default(5),
  tacticalStability: z.number().min(1).max(10).default(5),
  
  // Context
  importanceLevel: z.number().min(1).max(10).default(5),
  mustWin: z.boolean().default(false),
  restDays: z.number().default(3),
  travelFatigue: z.number().min(0).max(10).default(0),
  weatherImpact: z.number().min(0).max(10).default(0),
  refereeStrictness: z.number().min(1).max(10).default(5),
  
  // Playing style metrics
  avgShots: z.number().default(12),
  avgShotsOnTarget: z.number().default(5),
  avgPossession: z.number().default(50),
  avgCorners: z.number().default(5),
  avgFouls: z.number().default(10),
  avgYellowCards: z.number().default(2),
  avgRedCards: z.number().default(0),
  crossingTendency: z.number().min(1).max(10).default(5),
  defensivePressure: z.number().min(1).max(10).default(5),
  discipline: z.number().min(1).max(10).default(5),
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
