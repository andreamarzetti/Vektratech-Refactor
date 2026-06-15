import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const businessesTable = pgTable("businesses", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").notNull().references(() => usersTable.id),
  name: text("name").notNull(),
  sector: text("sector", {
    enum: ["restaurante", "kiosco", "dietetica", "ferreteria", "ropa", "distribuidora", "otro"],
  }).notNull(),
  plan: text("plan", { enum: ["starter", "pro"] }).notNull().default("starter"),
  status: text("status", { enum: ["active", "suspended", "trial"] }).notNull().default("trial"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBusinessSchema = createInsertSchema(businessesTable).omit({ id: true, createdAt: true });
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Business = typeof businessesTable.$inferSelect;
