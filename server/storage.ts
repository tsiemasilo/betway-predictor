import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import type { InsertMatchScenario, MatchScenario } from "@shared/schema";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle({ client: pool, schema });

export interface IStorage {
  // Match scenarios
  createMatchScenario(scenario: InsertMatchScenario): Promise<MatchScenario>;
  getMatchScenario(id: string): Promise<MatchScenario | undefined>;
  getAllMatchScenarios(): Promise<MatchScenario[]>;
  updateMatchScenarioPrediction(id: string, predictionResults: any): Promise<MatchScenario | undefined>;
  deleteMatchScenario(id: string): Promise<void>;
}

export class DbStorage implements IStorage {
  async createMatchScenario(scenario: InsertMatchScenario): Promise<MatchScenario> {
    const [created] = await db.insert(schema.matchScenarios).values(scenario).returning();
    return created;
  }

  async getMatchScenario(id: string): Promise<MatchScenario | undefined> {
    const [scenario] = await db.select().from(schema.matchScenarios).where(eq(schema.matchScenarios.id, id));
    return scenario;
  }

  async getAllMatchScenarios(): Promise<MatchScenario[]> {
    return db.select().from(schema.matchScenarios).orderBy(schema.matchScenarios.createdAt);
  }

  async updateMatchScenarioPrediction(id: string, predictionResults: any): Promise<MatchScenario | undefined> {
    const [updated] = await db
      .update(schema.matchScenarios)
      .set({ predictionResults })
      .where(eq(schema.matchScenarios.id, id))
      .returning();
    return updated;
  }

  async deleteMatchScenario(id: string): Promise<void> {
    await db.delete(schema.matchScenarios).where(eq(schema.matchScenarios.id, id));
  }
}

export const storage = new DbStorage();
