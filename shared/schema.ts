import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const promptComparisons = pgTable("prompt_comparisons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  promptA: text("prompt_a").notNull(),
  promptB: text("prompt_b").notNull(),
  metadata: json("metadata"), // For storing stats, similarity, etc.
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  promptComparisons: many(promptComparisons),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  promptComparisons: many(promptComparisons),
}));

export const promptComparisonsRelations = relations(promptComparisons, ({ one }) => ({
  user: one(users, {
    fields: [promptComparisons.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [promptComparisons.projectId],
    references: [projects.id],
  }),
}));

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
});

export const insertPromptComparisonSchema = createInsertSchema(promptComparisons).pick({
  title: true,
  promptA: true,
  promptB: true,
  metadata: true,
  projectId: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertPromptComparison = z.infer<typeof insertPromptComparisonSchema>;
export type PromptComparison = typeof promptComparisons.$inferSelect;

// Legacy support (can be removed later)
export type InsertPrompt = InsertPromptComparison;
export type Prompt = PromptComparison;
