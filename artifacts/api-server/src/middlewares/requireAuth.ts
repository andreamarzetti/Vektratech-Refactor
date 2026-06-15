import { getAuth } from "@clerk/express";
import { type Request, type Response, type NextFunction } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const clerkId = auth?.userId;
  if (!clerkId) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }
  (req as any).clerkId = clerkId;
  next();
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const clerkId = auth?.userId;
  if (!clerkId) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Acceso denegado" });
    return;
  }
  (req as any).clerkId = clerkId;
  (req as any).dbUser = user;
  next();
}

export async function loadUser(req: Request, res: Response, next: NextFunction) {
  const clerkId = (req as any).clerkId as string;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
  (req as any).dbUser = user ?? null;
  next();
}
