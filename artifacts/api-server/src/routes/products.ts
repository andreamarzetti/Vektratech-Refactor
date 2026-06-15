import { Router } from "express";
import { db, productsTable, businessesTable, usersTable } from "@workspace/db";
import { eq, and, ilike } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

async function getUserBusiness(clerkId: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
  if (!user) return null;
  const [business] = await db.select().from(businessesTable).where(eq(businessesTable.ownerId, user.id));
  return business ?? null;
}

router.get("/products", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }
    if (business.status === "suspended") { res.status(403).json({ error: "Cuenta suspendida" }); return; }

    const { category, search } = req.query as Record<string, string>;
    let query = db.select().from(productsTable).where(eq(productsTable.businessId, business.id)).$dynamic();
    if (category) query = query.where(eq(productsTable.category, category)) as any;
    if (search) query = query.where(ilike(productsTable.name, `%${search}%`)) as any;

    const products = await db.select().from(productsTable).where(
      and(
        eq(productsTable.businessId, business.id),
        category ? eq(productsTable.category, category) : undefined,
        search ? ilike(productsTable.name, `%${search}%`) : undefined,
      )
    );
    res.json(products.map(p => ({
      ...p,
      price: parseFloat(p.price as any),
    })));
  } catch (err) {
    req.log.error({ err }, "Error en GET /products");
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/products", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    const { name, description, price, category, stock, imageUrl, active } = req.body;
    const [product] = await db.insert(productsTable).values({
      businessId: business.id,
      name,
      description,
      price: String(price),
      category,
      stock,
      imageUrl,
      active: active !== undefined ? active : true,
    }).returning();

    res.status(201).json({ ...product, price: parseFloat(product.price as any) });
  } catch (err) {
    req.log.error({ err }, "Error en POST /products");
    res.status(500).json({ error: "Error interno" });
  }
});

router.get("/products/:id", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    const [product] = await db.select().from(productsTable).where(
      and(eq(productsTable.id, Number(req.params.id)), eq(productsTable.businessId, business.id))
    );
    if (!product) { res.status(404).json({ error: "Producto no encontrado" }); return; }
    res.json({ ...product, price: parseFloat(product.price as any) });
  } catch (err) {
    req.log.error({ err }, "Error en GET /products/:id");
    res.status(500).json({ error: "Error interno" });
  }
});

router.patch("/products/:id", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    const { name, description, price, category, stock, imageUrl, active } = req.body;
    const update: Record<string, any> = {};
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (price !== undefined) update.price = String(price);
    if (category !== undefined) update.category = category;
    if (stock !== undefined) update.stock = stock;
    if (imageUrl !== undefined) update.imageUrl = imageUrl;
    if (active !== undefined) update.active = active;

    const [product] = await db.update(productsTable)
      .set(update)
      .where(and(eq(productsTable.id, Number(req.params.id)), eq(productsTable.businessId, business.id)))
      .returning();
    if (!product) { res.status(404).json({ error: "Producto no encontrado" }); return; }
    res.json({ ...product, price: parseFloat(product.price as any) });
  } catch (err) {
    req.log.error({ err }, "Error en PATCH /products/:id");
    res.status(500).json({ error: "Error interno" });
  }
});

router.delete("/products/:id", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    await db.delete(productsTable).where(
      and(eq(productsTable.id, Number(req.params.id)), eq(productsTable.businessId, business.id))
    );
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error en DELETE /products/:id");
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
