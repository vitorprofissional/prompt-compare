import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertProjectSchema, 
  insertPromptComparisonSchema 
} from "@shared/schema";
import { storage } from "./storage";

// Ensure demo user exists
async function ensureDemoUser() {
  const userId = "demo-user";
  try {
    let user = await storage.getUser(userId);
    if (!user) {
      // Create demo user with fixed ID
      await storage.createDemoUser({
        id: userId,
        username: "demo",
        password: "demo"
      });
    }
  } catch (error) {
    console.log("Demo user setup:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize demo user
  await ensureDemoUser();
  
  // Projects API
  app.get("/api/projects", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(401).json({ error: "User ID required" });
      }
      
      const projects = await storage.getProjectsByUserId(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(401).json({ error: "User ID required" });
      }

      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject({ ...validatedData, userId });
      res.status(201).json(project);
    } catch (error) {
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
      const userId = req.headers['x-user-id'] as string;
      const projectId = req.query.projectId as string;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID required" });
      }

      let comparisons;
      if (projectId) {
        comparisons = await storage.getPromptComparisonsByProjectId(projectId);
      } else {
        comparisons = await storage.getPromptComparisonsByUserId(userId);
      }
      
      res.json(comparisons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prompt comparisons" });
    }
  });

  app.post("/api/prompt-comparisons", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(401).json({ error: "User ID required" });
      }

      const validatedData = insertPromptComparisonSchema.parse(req.body);
      const comparison = await storage.createPromptComparison({ ...validatedData, userId });
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
