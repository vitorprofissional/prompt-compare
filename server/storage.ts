import { 
  users, 
  projects, 
  promptComparisons,
  type User, 
  type InsertUser, 
  type Project, 
  type InsertProject,
  type PromptComparison,
  type InsertPromptComparison
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  createDemoUser(user: { id: string; username: string; password: string }): Promise<User>;
  
  // Project methods
  getProjectsByUserId(userId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(insertProject: InsertProject & { userId: string }): Promise<Project>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Prompt comparison methods
  getPromptComparisonsByProjectId(projectId: string): Promise<PromptComparison[]>;
  getPromptComparisonsByUserId(userId: string): Promise<PromptComparison[]>;
  getPromptComparison(id: string): Promise<PromptComparison | undefined>;
  createPromptComparison(insertComparison: InsertPromptComparison & { userId: string }): Promise<PromptComparison>;
  updatePromptComparison(id: string, updates: Partial<InsertPromptComparison>): Promise<PromptComparison | undefined>;
  deletePromptComparison(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createDemoUser(user: { id: string; username: string; password: string }): Promise<User> {
    const [createdUser] = await db
      .insert(users)
      .values(user)
      .returning();
    return createdUser;
  }

  // Project methods
  async getProjectsByUserId(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(insertProject: InsertProject & { userId: string }): Promise<Project> {
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
    const result = await db.delete(projects).where(eq(projects.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Prompt comparison methods
  async getPromptComparisonsByProjectId(projectId: string): Promise<PromptComparison[]> {
    return await db
      .select()
      .from(promptComparisons)
      .where(eq(promptComparisons.projectId, projectId))
      .orderBy(desc(promptComparisons.updatedAt));
  }

  async getPromptComparisonsByUserId(userId: string): Promise<PromptComparison[]> {
    return await db
      .select()
      .from(promptComparisons)
      .where(eq(promptComparisons.userId, userId))
      .orderBy(desc(promptComparisons.updatedAt));
  }

  async getPromptComparison(id: string): Promise<PromptComparison | undefined> {
    const [comparison] = await db.select().from(promptComparisons).where(eq(promptComparisons.id, id));
    return comparison || undefined;
  }

  async createPromptComparison(insertComparison: InsertPromptComparison & { userId: string }): Promise<PromptComparison> {
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
    const result = await db.delete(promptComparisons).where(eq(promptComparisons.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
