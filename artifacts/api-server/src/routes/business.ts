import { Router } from "express";
import { db, businessesTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

async function getUserBusiness(clerkId: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
  if (!user) return null;
  const [business] = await db.select().from(businessesTable).where(eq(businessesTable.ownerId, user.id));
  return business ?? null;
}

function mapConfig(biz: any) {
  return {
    id: biz.id,
    name: biz.name,
    sector: biz.sector,
    plan: biz.plan,
    status: biz.status,
    slug: biz.slug,
    whatsappNumber: biz.whatsappNumber,
    shippingCost: biz.shippingCost ? parseFloat(biz.shippingCost) : null,
    cashDiscount: biz.cashDiscount,
    bankAlias: biz.bankAlias,
    bankHolder: biz.bankHolder,
    hasMpToken: !!biz.mpAccessToken,
  };
}

router.get("/me/business", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const biz = await getUserBusiness(clerkId);
    if (!biz) { res.status(404).json({ error: "Negocio no encontrado" }); return; }
    res.json(mapConfig(biz));
  } catch (err) {
    req.log.error({ err }, "Error en GET /me/business");
    res.status(500).json({ error: "Error interno" });
  }
});

router.patch("/me/business", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const biz = await getUserBusiness(clerkId);
    if (!biz) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    const { slug, whatsappNumber, shippingCost, cashDiscount, bankAlias, bankHolder, mpAccessToken } = req.body;

    const update: Record<string, any> = {};
    if (slug !== undefined) update.slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    if (whatsappNumber !== undefined) update.whatsappNumber = whatsappNumber;
    if (shippingCost !== undefined) update.shippingCost = shippingCost !== null ? String(shippingCost) : null;
    if (cashDiscount !== undefined) update.cashDiscount = cashDiscount;
    if (bankAlias !== undefined) update.bankAlias = bankAlias;
    if (bankHolder !== undefined) update.bankHolder = bankHolder;
    if (mpAccessToken !== undefined) update.mpAccessToken = mpAccessToken;

    const [updated] = await db.update(businessesTable).set(update).where(eq(businessesTable.id, biz.id)).returning();
    res.json(mapConfig(updated));
  } catch (err) {
    req.log.error({ err }, "Error en PATCH /me/business");
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
