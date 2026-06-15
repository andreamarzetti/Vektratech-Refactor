import { pgTable, text, serial, integer, numeric, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { businessesTable } from "./businesses";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businessesTable.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  items: json("items").notNull().$type<Array<{
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>>(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  status: text("status", {
    enum: ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"],
  }).notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
