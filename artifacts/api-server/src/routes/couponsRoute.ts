import { Router } from "express";
import { db, couponsTable, businessesTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

async function getUserBusiness(clerkId: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
  if (!user) return null;
  const [business] = await db.select().from(businessesTable).where(eq(businessesTable.ownerId, user.id));
  return business ?? null;
}

function mapCoupon(c: any) {
  return {
    id: c.id,
    code: c.code,
    type: c.type,
    value: parseFloat(c.value),
    active: c.active,
    maxUses: c.maxUses,
    usedCount: c.usedCount,
    expiresAt: c.expiresAt,
    createdAt: c.createdAt,
  };
}

router.get("/me/coupons", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const biz = await getUserBusiness(clerkId);
    if (!biz) { res.status(404).json({ error: "Negocio no encontrado" }); return; }
    const coupons = await db.select().from(couponsTable).where(eq(couponsTable.businessId, biz.id));
    res.json(coupons.map(mapCoupon));
  } catch (err) {
    req.log.error({ err }, "Error en GET /me/coupons");
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/me/coupons", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const biz = await getUserBusiness(clerkId);
    if (!biz) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    const { code, type, value, maxUses, expiresAt } = req.body;
    const [coupon] = await db.insert(couponsTable).values({
      businessId: biz.id,
      code: code.toUpperCase(),
      type,
      value: String(value),
      active: true,
      maxUses: maxUses ?? null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    }).returning();

    res.status(201).json(mapCoupon(coupon));
  } catch (err) {
    req.log.error({ err }, "Error en POST /me/coupons");
    res.status(500).json({ error: "Error interno" });
  }
});

router.patch("/me/coupons/:id", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const biz = await getUserBusiness(clerkId);
    if (!biz) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    const { code, type, value, active, maxUses, expiresAt } = req.body;
    const update: Record<string, any> = {};
    if (code !== undefined) update.code = code.toUpperCase();
    if (type !== undefined) update.type = type;
    if (value !== undefined) update.value = String(value);
    if (active !== undefined) update.active = active;
    if (maxUses !== undefined) update.maxUses = maxUses;
    if (expiresAt !== undefined) update.expiresAt = expiresAt ? new Date(expiresAt) : null;

    const [updated] = await db.update(couponsTable)
      .set(update)
      .where(and(eq(couponsTable.id, Number(req.params.id)), eq(couponsTable.businessId, biz.id)))
      .returning();

    if (!updated) { res.status(404).json({ error: "Cupón no encontrado" }); return; }
    res.json(mapCoupon(updated));
  } catch (err) {
    req.log.error({ err }, "Error en PATCH /me/coupons/:id");
    res.status(500).json({ error: "Error interno" });
  }
});

router.delete("/me/coupons/:id", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const biz = await getUserBusiness(clerkId);
    if (!biz) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    await db.delete(couponsTable).where(
      and(eq(couponsTable.id, Number(req.params.id)), eq(couponsTable.businessId, biz.id))
    );
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Error en DELETE /me/coupons/:id");
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
