import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { 
  insertProjectSchema, 
  insertPromptComparisonSchema 
} from "@shared/schema";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add logging middleware for API routes
  app.use("/api", (req, res, next) => {
    console.log(`[API] ${req.method} ${req.path}`, req.body);
    next();
  });

  // Test endpoint
  app.get("/api/test", (req, res) => {
    console.log("[API] Test endpoint called");
    res.json({ message: "API is working!", timestamp: new Date().toISOString() });
  });

  // Projects API
  app.get("/api/projects", async (req, res) => {
    try {
      console.log("[API] Fetching projects...");
      const projects = await storage.getAllProjects();
      console.log("[API] Projects found:", projects.length);
      res.json(projects);
    } catch (error) {
      console.error("[API] Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      console.log("[API] Creating project with data:", req.body);
      const validatedData = insertProjectSchema.parse(req.body);
      console.log("[API] Validated data:", validatedData);
      const project = await storage.createProject(validatedData);
      console.log("[API] Project created:", project);
      res.status(201).json(project);
    } catch (error) {
      console.error("[API] Error creating project:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid project data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create project" });
      }
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, validatedData);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid project data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update project" });
      }
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProject(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Prompt Comparisons API
  app.get("/api/prompt-comparisons", async (req, res) => {
    try {
      const projectId = req.query.projectId as string;
      
      let comparisons;
      if (projectId) {
        comparisons = await storage.getPromptComparisonsByProjectId(projectId);
      } else {
        comparisons = await storage.getAllPromptComparisons();
      }
      
      res.json(comparisons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prompt comparisons" });
    }
  });

  app.post("/api/prompt-comparisons", async (req, res) => {
    try {
      const validatedData = insertPromptComparisonSchema.parse(req.body);
      const comparison = await storage.createPromptComparison(validatedData);
      res.status(201).json(comparison);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid comparison data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create comparison" });
      }
    }
  });

  app.get("/api/prompt-comparisons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const comparison = await storage.getPromptComparison(id);
      
      if (!comparison) {
        return res.status(404).json({ error: "Comparison not found" });
      }
      
      res.json(comparison);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comparison" });
    }
  });

  app.put("/api/prompt-comparisons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertPromptComparisonSchema.partial().parse(req.body);
      const comparison = await storage.updatePromptComparison(id, validatedData);
      
      if (!comparison) {
        return res.status(404).json({ error: "Comparison not found" });
      }
      
      res.json(comparison);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid comparison data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update comparison" });
      }
    }
  });

  app.delete("/api/prompt-comparisons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePromptComparison(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Comparison not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete comparison" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
