import { Router } from "express";
import { db, ordersTable, productsTable, customersTable, businessesTable, usersTable } from "@workspace/db";
import { eq, desc, count, sum, and, gte } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

async function getUserBusiness(clerkId: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
  if (!user) return null;
  const [business] = await db.select().from(businessesTable).where(eq(businessesTable.ownerId, user.id));
  return business ?? null;
}

router.get("/dashboard/stats", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    const allOrders = await db.select().from(ordersTable).where(eq(ordersTable.businessId, business.id));
    const allProducts = await db.select({ id: productsTable.id }).from(productsTable).where(eq(productsTable.businessId, business.id));
    const allCustomers = await db.select({ id: customersTable.id }).from(customersTable).where(eq(customersTable.businessId, business.id));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ordersToday = allOrders.filter(o => new Date(o.createdAt) >= today);
    const pendingOrders = allOrders.filter(o => o.status === "pending").length;
    const totalRevenue = allOrders.reduce((acc, o) => acc + parseFloat(o.total as any), 0);
    const revenueToday = ordersToday.reduce((acc, o) => acc + parseFloat(o.total as any), 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const ordersYesterday = allOrders.filter(o => {
      const d = new Date(o.createdAt);
      return d >= yesterday && d < today;
    });
    const revenueYesterday = ordersYesterday.reduce((acc, o) => acc + parseFloat(o.total as any), 0);
    const growthPercent = revenueYesterday === 0 ? 100 : ((revenueToday - revenueYesterday) / revenueYesterday) * 100;

    res.json({
      totalOrders: allOrders.length,
      totalRevenue,
      totalProducts: allProducts.length,
      totalCustomers: allCustomers.length,
      ordersToday: ordersToday.length,
      revenueToday,
      pendingOrders,
      growthPercent: Math.round(growthPercent * 10) / 10,
    });
  } catch (err) {
    req.log.error({ err }, "Error en GET /dashboard/stats");
    res.status(500).json({ error: "Error interno" });
  }
});

router.get("/dashboard/recent-orders", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    const orders = await db.select().from(ordersTable)
      .where(eq(ordersTable.businessId, business.id))
      .orderBy(desc(ordersTable.createdAt))
      .limit(10);

    res.json(orders.map(o => ({
      id: o.id,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      items: o.items,
      total: parseFloat(o.total as any),
      status: o.status,
      notes: o.notes,
      createdAt: o.createdAt,
    })));
  } catch (err) {
    req.log.error({ err }, "Error en GET /dashboard/recent-orders");
    res.status(500).json({ error: "Error interno" });
  }
});

router.get("/dashboard/top-products", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    const orders = await db.select().from(ordersTable).where(eq(ordersTable.businessId, business.id));
    const productMap: Record<number, { id: number; name: string; totalSold: number; revenue: number }> = {};

    for (const order of orders) {
      for (const item of (order.items as any[]) ?? []) {
        if (!productMap[item.productId]) {
          productMap[item.productId] = { id: item.productId, name: item.productName, totalSold: 0, revenue: 0 };
        }
        productMap[item.productId].totalSold += item.quantity;
        productMap[item.productId].revenue += item.quantity * item.unitPrice;
      }
    }

    const top = Object.values(productMap)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    res.json(top);
  } catch (err) {
    req.log.error({ err }, "Error en GET /dashboard/top-products");
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
