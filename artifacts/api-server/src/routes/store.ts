import { Router } from "express";
import { db, productsTable, businessesTable, ordersTable, couponsTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";

const router = Router();

async function findBusinessBySlug(slug: string) {
  const [biz] = await db.select().from(businessesTable).where(eq(businessesTable.slug, slug));
  return biz ?? null;
}

function generateOwnerWhatsappUrl(
  whatsappNumber: string | null | undefined,
  orderId: number,
  customerName: string,
  customerPhone: string | null | undefined,
  items: Array<{ productName: string; quantity: number; unitPrice: number }>,
  total: number,
  paymentMethod: string,
  deliveryType: string,
  deliveryAddress?: { street: string; number: string; floor?: string; apt?: string; city: string } | null,
): string | null {
  if (!whatsappNumber) return null;
  const phone = whatsappNumber.replace(/\D/g, "");
  const itemsList = items
    .map((i) => `• ${i.quantity}x ${i.productName} ($${(i.unitPrice * i.quantity).toLocaleString("es-AR")})`)
    .join("\n");
  const paymentText: Record<string, string> = {
    cash: "Efectivo",
    transfer: "Transferencia bancaria",
    mercadopago: "Mercado Pago",
    debit: "Tarjeta de débito",
    credit: "Tarjeta de crédito",
  };
  const deliveryText =
    deliveryType === "local"
      ? "Consumo en local"
      : deliveryType === "pickup"
        ? "Retiro en sucursal"
        : deliveryAddress
          ? `Envío: ${deliveryAddress.street} ${deliveryAddress.number}${deliveryAddress.floor ? `, piso ${deliveryAddress.floor}` : ""}${deliveryAddress.apt ? ` depto ${deliveryAddress.apt}` : ""}, ${deliveryAddress.city}`
          : "Envío a domicilio";

  const msg =
    `NUEVO PEDIDO #${orderId}\n\n` +
    `Cliente: ${customerName}\n` +
    `Telefono: ${customerPhone ?? "-"}\n\n` +
    `Productos:\n${itemsList}\n\n` +
    `Total: $${total.toLocaleString("es-AR")}\n` +
    `Pago: ${paymentText[paymentMethod] ?? paymentMethod}\n` +
    `Entrega: ${deliveryText}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

function generateSmartReply(message: string, products: any[], business: any, history: any[]): string {
  const msg = message.toLowerCase();
  const prices = products.map((p) => parseFloat(p.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (products.length === 0) {
    return `Hola! Soy el asistente de ${business.name}. Todavía no tenemos productos cargados. ¡Pronto vas a poder consultar el catálogo por acá!`;
  }

  const budgetMatch = msg.match(/\$?\s*(\d[\d.,]*)/);
  if (budgetMatch && (msg.includes("tengo") || msg.includes("presupuesto") || msg.includes("gasto"))) {
    const budget = parseFloat(budgetMatch[1].replace(/[.,]/g, ""));
    const affordable = [...products]
      .filter((p) => parseFloat(p.price) <= budget)
      .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
      .slice(0, 3);
    if (affordable.length > 0) {
      return `Con $${budget.toLocaleString("es-AR")} te alcanzan: ${affordable.map((p) => `**${p.name}** ($${parseFloat(p.price).toLocaleString("es-AR")})`).join(", ")}. ¿Querés que te cuente más de alguno?`;
    }
    return `Con $${budget.toLocaleString("es-AR")} el rango está un poco justo. Los más económicos empiezan en $${minPrice.toLocaleString("es-AR")}. ¿Querés ver opciones?`;
  }

  if (msg.includes("económic") || msg.includes("barato") || msg.includes("precio bajo") || msg.includes("accesible")) {
    const cheap = [...products].sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).slice(0, 3);
    return `Las opciones más económicas son: ${cheap.map((p) => `**${p.name}** ($${parseFloat(p.price).toLocaleString("es-AR")})`).join(", ")}. ¿Te interesa alguno?`;
  }

  if (msg.includes("premium") || msg.includes("mejor") || msg.includes("calidad") || msg.includes("lo mejor")) {
    const best = [...products].sort((a, b) => parseFloat(b.price) - parseFloat(a.price)).slice(0, 3);
    return `Nuestros productos top son: ${best.map((p) => `**${p.name}** ($${parseFloat(p.price).toLocaleString("es-AR")})`).join(", ")}. Son los de mayor calidad. ¿Querés más info?`;
  }

  if (msg.includes("recomendar") || msg.includes("conviene") || msg.includes("elegir") || msg.includes("cuál") || msg.includes("cual")) {
    const prevProducts = history
      .filter((m) => m.role === "user")
      .map((m) => m.content.toLowerCase());
    const sector = business.sector;
    const top = products.slice(0, 2);
    return `Te recomiendo **${top[0]?.name}** ($${parseFloat(top[0]?.price).toLocaleString("es-AR")}) — ${top[0]?.description ?? "uno de los más pedidos"}. ${top[1] ? `También está **${top[1].name}** si buscás otra opción.` : ""} ¿Querés agregar uno al carrito?`;
  }

  if (msg.includes("combo") || msg.includes("junto") || msg.includes("complemento") || msg.includes("además")) {
    const items = products.slice(0, 3);
    return `Podés combinar: ${items.map((p) => `**${p.name}**`).join(", ")}. ¡Juntos quedan genial! ¿Te armo el pedido?`;
  }

  if (msg.includes("stock") || msg.includes("disponible") || msg.includes("hay")) {
    const withStock = products.filter((p) => p.stock && p.stock > 0);
    if (withStock.length > 0) {
      return `Tenemos stock de: ${withStock.slice(0, 3).map((p) => `**${p.name}** (${p.stock} unidades)`).join(", ")}. ¡Hacé tu pedido!`;
    }
    return `Contactanos para confirmar disponibilidad. Generalmente tenemos todo en stock.`;
  }

  if (msg.includes("envío") || msg.includes("entrega") || msg.includes("delivery") || msg.includes("llega")) {
    const shippingInfo = business.shippingCost
      ? `El envío tiene un costo de $${parseFloat(business.shippingCost).toLocaleString("es-AR")}.`
      : "Consultanos por el envío.";
    return `Sí, hacemos envíos. ${shippingInfo} También podés pasar a retirar sin costo. ¿Qué preferís?`;
  }

  if (msg.includes("pago") || msg.includes("efectivo") || msg.includes("tarjeta") || msg.includes("mercado pago") || msg.includes("transferencia")) {
    const methods = ["efectivo", "transferencia bancaria"];
    if (business.mpAccessToken) methods.push("Mercado Pago");
    methods.push("débito y crédito");
    return `Aceptamos: ${methods.join(", ")}. ${business.cashDiscount ? `¡Con efectivo tenés un ${business.cashDiscount}% de descuento!` : ""} ¿Cómo preferís pagar?`;
  }

  if (msg.includes("todo") || msg.includes("catálogo") || msg.includes("qué tienen") || msg.includes("productos")) {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return `Tenemos **${products.length} productos** disponibles${cats.length ? `, en categorías: ${cats.slice(0, 4).join(", ")}` : ""}. Precios desde $${minPrice.toLocaleString("es-AR")}. ¿Buscás algo en particular?`;
  }

  const words = msg.split(/\s+/).filter((w) => w.length > 3);
  const matchingProduct = products.find((p) =>
    words.some(
      (w) => p.name.toLowerCase().includes(w) || (p.category ?? "").toLowerCase().includes(w),
    ),
  );
  if (matchingProduct) {
    return `**${matchingProduct.name}** cuesta $${parseFloat(matchingProduct.price).toLocaleString("es-AR")}. ${matchingProduct.description ?? ""} ¿Lo agregás al carrito?`;
  }

  return `Gracias por tu consulta. Tenemos **${products.length} productos** desde $${minPrice.toLocaleString("es-AR")}. ¿Qué estás buscando exactamente?`;
}

const SECTOR_SUGGESTIONS: Record<string, string[]> = {
  restaurante: ["¿Cuál es el plato más vendido?", "Tengo $10.000, ¿qué pedido?", "¿Hacen delivery?", "Recomendame un combo"],
  kiosco: ["¿Qué tienen para compartir?", "¿Cuál es el más barato?", "¿Tienen promociones?", "¿Aceptan tarjeta?"],
  dietetica: ["Tengo $20.000 para proteína", "Soy principiante, ¿qué me recomendás?", "¿Qué me sirve para bajar de peso?", "¿Tienen productos veganos?"],
  ferreteria: ["¿Qué necesito para pintar una habitación?", "¿Tienen herramientas eléctricas?", "¿Hacen envío?", "Necesito arreglar una pérdida"],
  ropa: ["¿Qué tienen para una fiesta?", "Busco algo económico", "¿Tienen talles grandes?", "¿Cuáles son las novedades?"],
  distribuidora: ["¿Cuál es el precio por mayor?", "¿Cuánto es el pedido mínimo?", "¿Hacen factura?", "¿Cuáles son los más vendidos?"],
  otro: ["¿Qué me recomendás?", "¿Cuáles son los más vendidos?", "¿Hacen envío?", "¿Tienen descuentos?"],
};

router.get("/store/:slug", async (req, res) => {
  try {
    const biz = await findBusinessBySlug(req.params.slug);
    if (!biz) { res.status(404).json({ error: "Tienda no encontrada" }); return; }
    res.json({
      name: biz.name,
      sector: biz.sector,
      whatsappNumber: biz.whatsappNumber,
      shippingCost: biz.shippingCost ? parseFloat(biz.shippingCost) : null,
      cashDiscount: biz.cashDiscount,
      bankAlias: biz.bankAlias,
      bankHolder: biz.bankHolder,
      plan: biz.plan,
      hasMpEnabled: !!biz.mpAccessToken,
    });
  } catch (err) {
    req.log.error({ err }, "Error en GET /store/:slug");
    res.status(500).json({ error: "Error interno" });
  }
});

router.get("/store/:slug/products", async (req, res) => {
  try {
    const biz = await findBusinessBySlug(req.params.slug);
    if (!biz) { res.status(404).json({ error: "Tienda no encontrada" }); return; }
    const products = await db
      .select()
      .from(productsTable)
      .where(and(eq(productsTable.businessId, biz.id), eq(productsTable.active, true)));
    res.json(
      products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: parseFloat(p.price),
        category: p.category,
        stock: p.stock,
        imageUrl: p.imageUrl,
        active: p.active,
        createdAt: p.createdAt,
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Error en GET /store/:slug/products");
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/store/:slug/orders", async (req, res) => {
  try {
    const biz = await findBusinessBySlug(req.params.slug);
    if (!biz) { res.status(404).json({ error: "Tienda no encontrada" }); return; }

    const {
      customerName,
      customerPhone,
      customerEmail,
      items,
      deliveryType = "pickup",
      deliveryAddress,
      paymentMethod = "cash",
      couponCode,
      discountAmount,
      shippingAmount,
      needsInvoice = false,
      invoiceData,
      notes,
    } = req.body;

    const subtotal = items.reduce((acc: number, i: any) => acc + i.quantity * i.unitPrice, 0);
    const discount = discountAmount ?? 0;
    const shipping = shippingAmount ?? 0;
    const total = subtotal - discount + shipping;

    if (couponCode) {
      const [coupon] = await db
        .select()
        .from(couponsTable)
        .where(
          and(
            eq(couponsTable.businessId, biz.id),
            eq(couponsTable.code, couponCode.toUpperCase()),
            eq(couponsTable.active, true),
          ),
        );
      if (coupon) {
        await db
          .update(couponsTable)
          .set({ usedCount: coupon.usedCount + 1 })
          .where(eq(couponsTable.id, coupon.id));
      }
    }

    const [order] = await db
      .insert(ordersTable)
      .values({
        businessId: biz.id,
        customerName,
        customerPhone,
        customerEmail,
        items,
        total: String(total),
        status: "pending",
        notes,
        deliveryType,
        deliveryAddress: deliveryAddress ?? null,
        paymentMethod,
        couponCode: couponCode ?? null,
        discountAmount: discountAmount ? String(discountAmount) : null,
        shippingAmount: shippingAmount ? String(shippingAmount) : null,
        needsInvoice,
        invoiceData: invoiceData ?? null,
      })
      .returning();

    const ownerWhatsappUrl = generateOwnerWhatsappUrl(
      biz.whatsappNumber,
      order.id,
      order.customerName,
      order.customerPhone,
      items,
      total,
      paymentMethod,
      deliveryType,
      deliveryAddress,
    );

    res.status(201).json({
      id: order.id,
      customerName: order.customerName,
      total,
      status: order.status,
      ownerWhatsappUrl,
      createdAt: order.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Error en POST /store/:slug/orders");
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/store/:slug/chat", async (req, res) => {
  try {
    const biz = await findBusinessBySlug(req.params.slug);
    if (!biz) { res.status(404).json({ error: "Tienda no encontrada" }); return; }

    const { message, history = [] } = req.body;
    const products = await db
      .select()
      .from(productsTable)
      .where(and(eq(productsTable.businessId, biz.id), eq(productsTable.active, true)));

    const reply = generateSmartReply(message, products, biz, history);
    const suggestions = (SECTOR_SUGGESTIONS[biz.sector] ?? SECTOR_SUGGESTIONS.otro).slice(0, 4);
    res.json({ reply, suggestions });
  } catch (err) {
    req.log.error({ err }, "Error en POST /store/:slug/chat");
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/store/:slug/validate-coupon", async (req, res) => {
  try {
    const biz = await findBusinessBySlug(req.params.slug);
    if (!biz) { res.status(404).json({ error: "Tienda no encontrada" }); return; }

    const { code, subtotal } = req.body;
    const now = new Date();

    const [coupon] = await db
      .select()
      .from(couponsTable)
      .where(
        and(
          eq(couponsTable.businessId, biz.id),
          eq(couponsTable.code, (code as string).toUpperCase()),
          eq(couponsTable.active, true),
        ),
      );

    if (!coupon) {
      res.json({ valid: false, message: "Cupón no válido o inactivo." });
      return;
    }
    if (coupon.expiresAt && coupon.expiresAt < now) {
      res.json({ valid: false, message: "El cupón venció." });
      return;
    }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      res.json({ valid: false, message: "El cupón ya alcanzó el máximo de usos." });
      return;
    }

    const value = parseFloat(coupon.value);
    const discountAmount =
      coupon.type === "percentage"
        ? Math.round(subtotal * (value / 100))
        : Math.min(value, subtotal);

    res.json({
      valid: true,
      type: coupon.type,
      value,
      discountAmount,
      message: `Descuento aplicado correctamente. Ahorrás $${discountAmount.toLocaleString("es-AR")}.`,
    });
  } catch (err) {
    req.log.error({ err }, "Error en POST /store/:slug/validate-coupon");
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/store/:slug/mp/preference", async (req, res) => {
  try {
    const biz = await findBusinessBySlug(req.params.slug);
    if (!biz) { res.status(404).json({ error: "Tienda no encontrada" }); return; }
    if (!biz.mpAccessToken) {
      res.status(400).json({ error: "Mercado Pago no configurado para este negocio" });
      return;
    }

    const { items, backUrl } = req.body;

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${biz.mpAccessToken}`,
      },
      body: JSON.stringify({
        items: items.map((i: any) => ({
          id: String(i.productId),
          title: i.productName,
          quantity: Number(i.quantity),
          unit_price: Number(i.unitPrice),
          currency_id: "ARS",
        })),
        back_urls: {
          success: `${backUrl}?mp=success`,
          failure: `${backUrl}?mp=failure`,
          pending: `${backUrl}?mp=pending`,
        },
        auto_return: "approved",
      }),
    });

    if (!mpResponse.ok) {
      const errBody = await mpResponse.text();
      req.log.error({ errBody }, "Error de Mercado Pago");
      res.status(502).json({ error: "Error al crear la preferencia de pago" });
      return;
    }

    const pref = (await mpResponse.json()) as any;
    res.json({ initPoint: pref.init_point, preferenceId: pref.id });
  } catch (err) {
    req.log.error({ err }, "Error en POST /store/:slug/mp/preference");
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
