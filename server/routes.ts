import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { predictionEngine } from "./prediction-engine";
import { insertMatchScenarioSchema, teamStatsSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Create a new match scenario
  app.post("/api/scenarios", async (req, res) => {
    try {
      const validatedData = insertMatchScenarioSchema.parse(req.body);
      
      // Validate team stats
      teamStatsSchema.parse(validatedData.homeTeamStats);
      teamStatsSchema.parse(validatedData.awayTeamStats);
      
      const scenario = await storage.createMatchScenario(validatedData);
      res.status(201).json(scenario);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Get all scenarios
  app.get("/api/scenarios", async (req, res) => {
    try {
      const scenarios = await storage.getAllMatchScenarios();
      res.json(scenarios);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get a specific scenario
  app.get("/api/scenarios/:id", async (req, res) => {
    try {
      const scenario = await storage.getMatchScenario(req.params.id);
      if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" });
      }
      res.json(scenario);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete a scenario
  app.delete("/api/scenarios/:id", async (req, res) => {
    try {
      await storage.deleteMatchScenario(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Run prediction for a scenario
  app.post("/api/predict", async (req, res) => {
    try {
      const schema = z.object({
        scenarioId: z.string().optional(),
        homeTeamStats: teamStatsSchema,
        awayTeamStats: teamStatsSchema,
      });

      const { scenarioId, homeTeamStats, awayTeamStats } = schema.parse(req.body);

      // Run the prediction
      const prediction = predictionEngine.predict(homeTeamStats, awayTeamStats);

      // If scenarioId is provided, update the scenario with the prediction
      if (scenarioId) {
        await storage.updateMatchScenarioPrediction(scenarioId, prediction);
      }

      res.json(prediction);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", engine: "Monte Carlo (20k sims)", version: "1.0.0" });
  });

  return httpServer;
}
