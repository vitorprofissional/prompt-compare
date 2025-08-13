import { 
  projects, 
  promptComparisons,
  type Project, 
  type InsertProject,
  type PromptComparison,
  type InsertPromptComparison
} from "@shared/schema";
import { db } from "./db.js";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Project methods
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(insertProject: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Prompt comparison methods
  getAllPromptComparisons(): Promise<PromptComparison[]>;
  getPromptComparisonsByProjectId(projectId: string): Promise<PromptComparison[]>;
  getPromptComparison(id: string): Promise<PromptComparison | undefined>;
  createPromptComparison(insertComparison: InsertPromptComparison): Promise<PromptComparison>;
  updatePromptComparison(id: string, updates: Partial<InsertPromptComparison>): Promise<PromptComparison | undefined>;
  deletePromptComparison(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .orderBy(desc(projects.updatedAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning({ id: projects.id });
    return result.length > 0;
  }

  // Prompt comparison methods
  async getAllPromptComparisons(): Promise<PromptComparison[]> {
    return await db
      .select()
      .from(promptComparisons)
      .orderBy(desc(promptComparisons.updatedAt));
  }

  async getPromptComparisonsByProjectId(projectId: string): Promise<PromptComparison[]> {
    return await db
      .select()
      .from(promptComparisons)
      .where(eq(promptComparisons.projectId, projectId))
      .orderBy(desc(promptComparisons.updatedAt));
  }

  async getPromptComparison(id: string): Promise<PromptComparison | undefined> {
    const [comparison] = await db.select().from(promptComparisons).where(eq(promptComparisons.id, id));
    return comparison || undefined;
  }

  async createPromptComparison(insertComparison: InsertPromptComparison): Promise<PromptComparison> {
    const [comparison] = await db
      .insert(promptComparisons)
      .values(insertComparison)
      .returning();
    return comparison;
  }

  async updatePromptComparison(id: string, updates: Partial<InsertPromptComparison>): Promise<PromptComparison | undefined> {
    const [comparison] = await db
      .update(promptComparisons)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(promptComparisons.id, id))
      .returning();
    return comparison || undefined;
  }

  async deletePromptComparison(id: string): Promise<boolean> {
    const result = await db.delete(promptComparisons).where(eq(promptComparisons.id, id)).returning({ id: promptComparisons.id });
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
