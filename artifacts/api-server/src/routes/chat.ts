import { Router } from "express";
import { db, productsTable, businessesTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

async function getUserBusiness(clerkId: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
  if (!user) return null;
  const [business] = await db.select().from(businessesTable).where(eq(businessesTable.ownerId, user.id));
  return business ?? null;
}

const SECTOR_SUGGESTIONS: Record<string, string[]> = {
  restaurante: ["¿Cuál es el plato más vendido?", "¿Qué opciones tienen sin TACC?", "¿Cuánto cuesta el menú del día?", "¿Tienen opciones vegetarianas?", "¿Hacen delivery?"],
  kiosco: ["¿Cuál es el producto más barato?", "¿Tienen bebidas sin azúcar?", "¿Aceptan tarjeta de débito?", "¿Tienen cigarrillos?", "¿Cuál es el snack más vendido?"],
  dietetica: ["Tengo presupuesto de $10.000, ¿qué me recomendás?", "¿Cuál tiene más proteína?", "¿Qué me recomendás para bajar de peso?", "¿Tienen productos veganos?", "¿Cuál tiene mejor relación precio/calidad?"],
  ferreteria: ["¿Qué necesito para pintar una habitación?", "¿Tienen caños de PVC?", "¿Cuál es el taladro más vendido?", "¿Tienen herramientas para jardín?", "¿Hacen envío?"],
  ropa: ["¿Qué talles tienen disponibles?", "¿Tienen descuentos?", "¿Cuáles son las novedades?", "¿Aceptan cambios?", "¿Tienen ropa deportiva?"],
  distribuidora: ["¿Cuál es el precio por mayor?", "¿Cuánto es el mínimo de compra?", "¿Hacen factura?", "¿Tienen entrega a domicilio?", "¿Cuáles son sus productos más pedidos?"],
  otro: ["¿Cuál es el producto más vendido?", "¿Cuál me recomendás?", "¿Cuáles son los precios?", "¿Hacen envío?", "¿Tienen descuentos?"],
};

function buildSystemPrompt(business: any, products: any[]) {
  const productList = products
    .filter(p => p.active)
    .map(p => `- ${p.name} (${p.category ?? "General"}): $${parseFloat(p.price).toLocaleString("es-AR")}${p.stock ? `, stock: ${p.stock}` : ""}${p.description ? ` — ${p.description}` : ""}`)
    .join("\n");

  return `Sos el asistente virtual de "${business.name}", un negocio de ${business.sector} en Argentina.
Respondé en español argentino, de forma natural y amigable.
Usá la información del catálogo para responder preguntas sobre productos, precios y recomendaciones.
Si no sabés algo, decilo honestamente.
No inventes precios ni productos que no estén en el catálogo.

CATÁLOGO DE PRODUCTOS:
${productList || "No hay productos cargados aún."}

Respondé de forma concisa (máximo 3-4 oraciones) y siempre ofrecé ayuda adicional.`;
}

router.post("/chat", requireAuth, async (req, res) => {
  try {
    const clerkId = (req as any).clerkId as string;
    const business = await getUserBusiness(clerkId);
    if (!business) { res.status(404).json({ error: "Negocio no encontrado" }); return; }

    const { message, history = [] } = req.body;
    const products = await db.select().from(productsTable).where(eq(productsTable.businessId, business.id));
    const systemPrompt = buildSystemPrompt(business, products);

    const activeProducts = products.filter(p => p.active);
    const reply = generateSmartReply(message, activeProducts, business);

    const suggestions = SECTOR_SUGGESTIONS[business.sector] ?? SECTOR_SUGGESTIONS.otro;

    res.json({ reply, suggestions: suggestions.slice(0, 4) });
  } catch (err) {
    req.log.error({ err }, "Error en POST /chat");
    res.status(500).json({ error: "Error interno" });
  }
});

function generateSmartReply(message: string, products: any[], business: any): string {
  const msg = message.toLowerCase();
  const prices = products.map(p => parseFloat(p.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (products.length === 0) {
    return `Hola! Soy el asistente de ${business.name}. Todavía no tenemos productos cargados en el catálogo. ¡Pronto vas a poder consultar nuestros productos por acá!`;
  }

  if (msg.includes("económic") || msg.includes("barato") || msg.includes("precio") || msg.includes("presupuesto")) {
    const cheap = [...products].sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).slice(0, 3);
    return `Las opciones más económicas que tenemos son: ${cheap.map(p => `**${p.name}** ($${parseFloat(p.price).toLocaleString("es-AR")})`).join(", ")}. ¿Querés más info de alguno?`;
  }

  if (msg.includes("premium") || msg.includes("mejor") || msg.includes("calidad")) {
    const best = [...products].sort((a, b) => parseFloat(b.price) - parseFloat(a.price)).slice(0, 3);
    return `Nuestros productos premium son: ${best.map(p => `**${p.name}** ($${parseFloat(p.price).toLocaleString("es-AR")})`).join(", ")}. Son nuestros artículos de mayor calidad.`;
  }

  if (msg.includes("recomendar") || msg.includes("conviene") || msg.includes("elegir") || msg.includes("cuál")) {
    const top = products.slice(0, 2);
    return `Te recomiendo especialmente: ${top.map(p => `**${p.name}** ($${parseFloat(p.price).toLocaleString("es-AR")})`).join(" y ")}. ${top[0]?.description ?? "Son nuestros más solicitados."} ¿Querés más detalles?`;
  }

  if (msg.includes("stock") || msg.includes("disponible") || msg.includes("hay")) {
    const withStock = products.filter(p => p.stock && p.stock > 0);
    if (withStock.length > 0) {
      return `Tenemos stock disponible de: ${withStock.slice(0, 3).map(p => `**${p.name}** (${p.stock} unidades)`).join(", ")}. ¡Hacé tu pedido!`;
    }
    return `Por ahora no tenemos información de stock actualizada. Contactanos para confirmar disponibilidad.`;
  }

  if (msg.includes("todo") || msg.includes("catálogo") || msg.includes("productos")) {
    return `Tenemos **${products.length} productos** disponibles, con precios desde $${minPrice.toLocaleString("es-AR")} hasta $${maxPrice.toLocaleString("es-AR")}. ¿Buscás algo en particular?`;
  }

  const matchingProduct = products.find(p =>
    p.name.toLowerCase().includes(msg.split(" ").find(w => w.length > 3) ?? "")
  );
  if (matchingProduct) {
    return `**${matchingProduct.name}** cuesta $${parseFloat(matchingProduct.price).toLocaleString("es-AR")}. ${matchingProduct.description ?? ""} ¿Te interesa?`;
  }

  return `Gracias por tu consulta sobre "${message}". Tenemos **${products.length} productos** disponibles. ¿Podés ser más específico sobre qué estás buscando?`;
}

export default router;
