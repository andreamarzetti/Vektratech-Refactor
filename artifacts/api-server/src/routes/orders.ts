import { Router } from "express";
import { db, ordersTable, businessesTable, usersTable, customersTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

async function getUserBusiness(clerkId: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
  if (!user) return null;
  const [business] = await db.select().from(businessesTable).where(eq(businessesTable.ownerId, user.id));
  return business ?? null;
}

function mapOrder(o: any) {
  return {
    id: o.id,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    items: o.items,
    total: parseFloat(o.total),
    status: o.status,
    notes: o.notes,
    createdAt: o.createdAt,
  };
}

router.get("/orders", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }
    if (business.status === "suspended") { res.status(403).json({ error: "Cuenta suspendida" }); return; }

    const { status } = req.query as Record<string, string>;
    const orders = await db.select().from(ordersTable).where(
      and(
        eq(ordersTable.businessId, business.id),
        status ? eq(ordersTable.status, status as any) : undefined,
      )
    ).orderBy(desc(ordersTable.createdAt));

    res.json(orders.map(mapOrder));
  } catch (err) {
    req.log.error({ err }, "Error en GET /orders");
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/orders", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    const { customerName, customerPhone, items, notes } = req.body;
    const total = items.reduce((acc: number, i: any) => acc + i.quantity * i.unitPrice, 0);

    const [order] = await db.insert(ordersTable).values({
      businessId: business.id,
      customerName,
      customerPhone,
      items,
      total: String(total),
      status: "pending",
      notes,
    }).returning();

    res.status(201).json(mapOrder(order));
  } catch (err) {
    req.log.error({ err }, "Error en POST /orders");
    res.status(500).json({ error: "Error interno" });
  }
});

router.get("/orders/:id", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    const [order] = await db.select().from(ordersTable).where(
      and(eq(ordersTable.id, Number(req.params.id)), eq(ordersTable.businessId, business.id))
    );
    if (!order) { res.status(404).json({ error: "Pedido no encontrado" }); return; }
    res.json(mapOrder(order));
  } catch (err) {
    req.log.error({ err }, "Error en GET /orders/:id");
    res.status(500).json({ error: "Error interno" });
  }
});

router.patch("/orders/:id", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    const { status, notes } = req.body;
    const update: Record<string, any> = {};
    if (status !== undefined) update.status = status;
    if (notes !== undefined) update.notes = notes;

    const [order] = await db.update(ordersTable)
      .set(update)
      .where(and(eq(ordersTable.id, Number(req.params.id)), eq(ordersTable.businessId, business.id)))
      .returning();
    if (!order) { res.status(404).json({ error: "Pedido no encontrado" }); return; }
    res.json(mapOrder(order));
  } catch (err) {
    req.log.error({ err }, "Error en PATCH /orders/:id");
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
