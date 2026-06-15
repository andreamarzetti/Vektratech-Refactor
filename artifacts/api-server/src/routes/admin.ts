import { Router } from "express";
import { db, businessesTable, usersTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAuth";
import { productsTable, ordersTable } from "@workspace/db";

const router = Router();

router.get("/admin/stats", requireAdmin, async (req, res) => {
  try {
    const businesses = await db.select().from(businessesTable);
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    res.json({
      totalBusinesses: businesses.length,
      activeBusinesses: businesses.filter(b => b.status === "active").length,
      suspendedBusinesses: businesses.filter(b => b.status === "suspended").length,
      trialBusinesses: businesses.filter(b => b.status === "trial").length,
      starterPlan: businesses.filter(b => b.plan === "starter").length,
      proPlan: businesses.filter(b => b.plan === "pro").length,
      newThisMonth: businesses.filter(b => new Date(b.createdAt) >= firstOfMonth).length,
    });
  } catch (err) {
    req.log.error({ err }, "Error en GET /admin/stats");
    res.status(500).json({ error: "Error interno" });
  }
});

router.get("/admin/businesses", requireAdmin, async (req, res) => {
  try {
    const { status } = req.query as Record<string, string>;
    const businesses = await db.select().from(businessesTable).orderBy(businessesTable.createdAt);
    const filtered = status ? businesses.filter(b => b.status === status) : businesses;

    const result = await Promise.all(filtered.map(async (b) => {
      const [owner] = await db.select().from(usersTable).where(eq(usersTable.id, b.ownerId));
      const [{ value: productsCount }] = await db.select({ value: count() }).from(productsTable).where(eq(productsTable.businessId, b.id));
      const [{ value: ordersCount }] = await db.select({ value: count() }).from(ordersTable).where(eq(ordersTable.businessId, b.id));
      return {
        id: b.id,
        name: b.name,
        sector: b.sector,
        plan: b.plan,
        status: b.status,
        ownerEmail: owner?.email ?? "",
        ownerName: owner?.name ?? null,
        productsCount: Number(productsCount),
        ordersCount: Number(ordersCount),
        createdAt: b.createdAt,
      };
    }));

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error en GET /admin/businesses");
    res.status(500).json({ error: "Error interno" });
  }
});

router.patch("/admin/businesses/:id", requireAdmin, async (req, res) => {
  try {
    const { status, plan } = req.body;
    const update: Record<string, any> = {};
    if (status !== undefined) update.status = status;
    if (plan !== undefined) update.plan = plan;

    const [business] = await db.update(businessesTable)
      .set(update)
      .where(eq(businessesTable.id, Number(req.params.id)))
      .returning();
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    const [owner] = await db.select().from(usersTable).where(eq(usersTable.id, business.ownerId));
    const [{ value: productsCount }] = await db.select({ value: count() }).from(productsTable).where(eq(productsTable.businessId, business.id));
    const [{ value: ordersCount }] = await db.select({ value: count() }).from(ordersTable).where(eq(ordersTable.businessId, business.id));

    res.json({
      id: business.id,
      name: business.name,
      sector: business.sector,
      plan: business.plan,
      status: business.status,
      ownerEmail: owner?.email ?? "",
      ownerName: owner?.name ?? null,
      productsCount: Number(productsCount),
      ordersCount: Number(ordersCount),
      createdAt: business.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Error en PATCH /admin/businesses/:id");
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
