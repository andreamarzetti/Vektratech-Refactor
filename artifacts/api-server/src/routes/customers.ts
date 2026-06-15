import { Router } from "express";
import { db, customersTable, businessesTable, usersTable } from "@workspace/db";
import { eq, and, ilike, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

async function getUserBusiness(clerkId: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
  if (!user) return null;
  const [business] = await db.select().from(businessesTable).where(eq(businessesTable.ownerId, user.id));
  return business ?? null;
}

function mapCustomer(c: any) {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    totalOrders: c.totalOrders,
    totalSpent: parseFloat(c.totalSpent ?? "0"),
    createdAt: c.createdAt,
  };
}

router.get("/customers", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }
    if (business.status === "suspended") { res.status(403).json({ error: "Cuenta suspendida" }); return; }

    const { search } = req.query as Record<string, string>;
    const customers = await db.select().from(customersTable).where(
      and(
        eq(customersTable.businessId, business.id),
        search ? ilike(customersTable.name, `%${search}%`) : undefined,
      )
    ).orderBy(desc(customersTable.createdAt));

    res.json(customers.map(mapCustomer));
  } catch (err) {
    req.log.error({ err }, "Error en GET /customers");
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/customers", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    const { name, email, phone } = req.body;
    const [customer] = await db.insert(customersTable).values({
      businessId: business.id,
      name,
      email,
      phone,
    }).returning();
    res.status(201).json(mapCustomer(customer));
  } catch (err) {
    req.log.error({ err }, "Error en POST /customers");
    res.status(500).json({ error: "Error interno" });
  }
});

router.patch("/customers/:id", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    const { name, email, phone } = req.body;
    const update: Record<string, any> = {};
    if (name !== undefined) update.name = name;
    if (email !== undefined) update.email = email;
    if (phone !== undefined) update.phone = phone;

    const [customer] = await db.update(customersTable)
      .set(update)
      .where(and(eq(customersTable.id, Number(req.params.id)), eq(customersTable.businessId, business.id)))
      .returning();
    if (!customer) { res.status(404).json({ error: "Cliente no encontrado" }); return; }
    res.json(mapCustomer(customer));
  } catch (err) {
    req.log.error({ err }, "Error en PATCH /customers/:id");
    res.status(500).json({ error: "Error interno" });
  }
});

router.delete("/customers/:id", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    await db.delete(customersTable).where(
      and(eq(customersTable.id, Number(req.params.id)), eq(customersTable.businessId, business.id))
    );
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error en DELETE /customers/:id");
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
