import { Router } from "express";
import { db, usersTable, businessesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

async function getOrCreateUser(clerkId: string, email?: string) {
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
  if (existing) return existing;
  const [created] = await db.insert(usersTable).values({
    clerkId,
    email: email ?? "",
    role: "client",
  }).returning();
  return created;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

async function generateUniqueSlug(name: string): Promise<string> {
  const base = generateSlug(name);
  let slug = base;
  let attempt = 0;
  while (attempt < 10) {
    const [existing] = await db.select({ id: businessesTable.id }).from(businessesTable).where(eq(businessesTable.slug, slug));
    if (!existing) return slug;
    attempt++;
    slug = `${base}-${attempt}`;
  }
  return `${base}-${Date.now()}`;
}

router.get("/me", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const user = await getOrCreateUser(clerkId);

    let business = null;
    if (user.role === "client") {
      const [biz] = await db.select().from(businessesTable).where(eq(businessesTable.ownerId, user.id));
      business = biz ?? null;
    }

    res.json({
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      role: user.role,
      business: business ? {
        id: business.id,
        name: business.name,
        sector: business.sector,
        plan: business.plan,
        status: business.status,
        slug: business.slug,
        createdAt: business.createdAt,
      } : null,
    });
  } catch (err) {
    req.log.error({ err }, "Error en GET /me");
    res.status(500).json({ error: "Error interno" });
  }
});

router.patch("/me", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const { name } = req.body;
    const [user] = await db.update(usersTable)
      .set({ name })
      .where(eq(usersTable.clerkId, clerkId))
      .returning();

    let business = null;
    if (user.role === "client") {
      const [biz] = await db.select().from(businessesTable).where(eq(businessesTable.ownerId, user.id));
      business = biz ?? null;
    }

    res.json({
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      role: user.role,
      business,
    });
  } catch (err) {
    req.log.error({ err }, "Error en PATCH /me");
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/me/onboard", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const { businessName, sector, plan } = req.body;

    let [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
    if (!user) {
      [user] = await db.insert(usersTable).values({ clerkId, email: "", role: "client" }).returning();
    }

    const existing = await db.select().from(businessesTable).where(eq(businessesTable.ownerId, user.id));
    if (existing.length > 0) {
      res.status(400).json({ error: "El negocio ya existe" });
      return;
    }

    const slug = await generateUniqueSlug(businessName);

    const [business] = await db.insert(businessesTable).values({
      ownerId: user.id,
      name: businessName,
      sector,
      plan: plan ?? "starter",
      status: "trial",
      slug,
    }).returning();

    res.status(201).json({
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      role: user.role,
      business: {
        id: business.id,
        name: business.name,
        sector: business.sector,
        plan: business.plan,
        status: business.status,
        slug: business.slug,
        createdAt: business.createdAt,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Error en POST /me/onboard");
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
