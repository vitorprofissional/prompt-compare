import { sql } from "drizzle-orm";
import { pgTable, text, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const promptComparisons = pgTable("prompt_comparisons", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  promptA: text("prompt_a").notNull(),
  promptB: text("prompt_b").notNull(),
  metadata: jsonb("metadata"), // For storing stats, similarity, etc.
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Relations
export const projectsRelations = relations(projects, ({ many }) => ({
  promptComparisons: many(promptComparisons),
}));

export const promptComparisonsRelations = relations(promptComparisons, ({ one }) => ({
  project: one(projects, {
    fields: [promptComparisons.projectId],
    references: [projects.id],
  }),
}));

// Schemas for validation
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
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertPromptComparison = z.infer<typeof insertPromptComparisonSchema>;
export type PromptComparison = typeof promptComparisons.$inferSelect;

// Legacy support (can be removed later)
export type InsertPrompt = InsertPromptComparison;
export type Prompt = PromptComparison;
