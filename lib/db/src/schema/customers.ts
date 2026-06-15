import { pgTable, text, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { businessesTable } from "./businesses";

export const customersTable = pgTable("customers", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businessesTable.id),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  totalOrders: integer("total_orders").notNull().default(0),
  totalSpent: numeric("total_spent", { precision: 12, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCustomerSchema = createInsertSchema(customersTable).omit({ id: true, createdAt: true });
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customersTable.$inferSelect;
