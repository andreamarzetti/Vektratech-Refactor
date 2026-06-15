import { pgTable, text, serial, integer, numeric, json, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { businessesTable } from "./businesses";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businessesTable.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  customerEmail: text("customer_email"),
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
  deliveryType: text("delivery_type", {
    enum: ["local", "pickup", "delivery"],
  }).notNull().default("pickup"),
  deliveryAddress: json("delivery_address").$type<{
    street: string;
    number: string;
    floor?: string;
    apt?: string;
    city: string;
    zip?: string;
  } | null>(),
  paymentMethod: text("payment_method", {
    enum: ["cash", "transfer", "mercadopago", "debit", "credit"],
  }).notNull().default("cash"),
  couponCode: text("coupon_code"),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }),
  shippingAmount: numeric("shipping_amount", { precision: 10, scale: 2 }),
  needsInvoice: boolean("needs_invoice").notNull().default(false),
  invoiceData: json("invoice_data").$type<{
    razonSocial: string;
    cuit: string;
    address: string;
  } | null>(),
  mpPaymentId: text("mp_payment_id"),
  mpStatus: text("mp_status"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
