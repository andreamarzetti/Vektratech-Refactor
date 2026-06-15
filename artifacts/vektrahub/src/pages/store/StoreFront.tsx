import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Bot, X, Minus, Plus, Send, Sparkles, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Checkout from "./Checkout";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  stock: number | null;
  imageUrl: string | null;
  active: boolean;
};

type StoreInfo = {
  name: string;
  sector: string;
  whatsappNumber: string | null;
  shippingCost: number | null;
  cashDiscount: number | null;
  bankAlias: string | null;
  bankHolder: string | null;
  plan: string;
  hasMpEnabled: boolean;
};

type CartItem = { product: Product; quantity: number };

const SECTOR_SUGGESTIONS: Record<string, string[]> = {
  restaurante: ["Recomendame algo rico", "Tengo $10.000, ¿qué como?", "¿Cuál es el más pedido?", "¿Hacen envío?"],
  kiosco: ["¿Qué tienen para compartir?", "¿Cuál es el más barato?", "¿Aceptan tarjeta?", "¿Tienen algo sin azúcar?"],
  dietetica: ["Tengo $20.000 para proteína", "Soy principiante, ¿qué me recomendás?", "¿Qué me sirve para bajar de peso?", "¿Tienen vegano?"],
  ferreteria: ["¿Qué necesito para pintar?", "¿Tienen herramientas eléctricas?", "¿Hacen envío?", "Necesito arreglar una pérdida"],
  ropa: ["¿Qué tienen para una fiesta?", "Busco algo económico", "¿Tienen talles grandes?", "¿Cuáles son las novedades?"],
  distribuidora: ["¿Precio por mayor?", "¿Pedido mínimo?", "¿Hacen factura?", "¿Los más vendidos?"],
  otro: ["¿Qué me recomendás?", "¿Cuáles son los más vendidos?", "¿Hacen envío?", "¿Tienen descuentos?"],
};

const PROACTIVE_MESSAGES = [
  "¿Necesitás ayuda para elegir algún producto?",
  "¿Querés que te recomiende algo según tu presupuesto?",
  "¿Buscás algo en particular? Te ayudo a encontrarlo.",
];

function generateSmartReply(msg: string, products: Product[], store: StoreInfo): string {
  const m = msg.toLowerCase();
  const prices = products.map((p) => p.price);
  if (prices.length === 0) return `Hola! Soy el asistente de ${store.name}. En breve vas a ver nuestro catálogo completo.`;
  const minPrice = Math.min(...prices);

  const budgetMatch = m.match(/\$?\s*(\d[\d.,]*)/);
  if (budgetMatch && (m.includes("tengo") || m.includes("presupuesto") || m.includes("gasto"))) {
    const budget = parseFloat(budgetMatch[1].replace(/[.,]/g, ""));
    const affordable = [...products].filter((p) => p.price <= budget).sort((a, b) => b.price - a.price).slice(0, 3);
    if (affordable.length > 0) {
      return `Con $${budget.toLocaleString("es-AR")} te recomiendo: ${affordable.map((p) => `${p.name} ($${p.price.toLocaleString("es-AR")})`).join(", ")}. ¿Querés alguno?`;
    }
    return `Con ese presupuesto los más económicos empiezan en $${minPrice.toLocaleString("es-AR")}. ¿Querés ver las opciones?`;
  }

  if (m.includes("económic") || m.includes("barato") || m.includes("accesible")) {
    const cheap = [...products].sort((a, b) => a.price - b.price).slice(0, 3);
    return `Los más económicos: ${cheap.map((p) => `${p.name} ($${p.price.toLocaleString("es-AR")})`).join(", ")}. ¿Te interesa alguno?`;
  }
  if (m.includes("recomendar") || m.includes("mejor") || m.includes("cuál") || m.includes("cual")) {
    const top = products.slice(0, 2);
    return `Te recomiendo ${top[0]?.name} ($${top[0]?.price.toLocaleString("es-AR")}). ${top[0]?.description ?? ""} ${top[1] ? `También está ${top[1].name}.` : ""} ¿Lo agregás?`;
  }
  if (m.includes("envío") || m.includes("delivery") || m.includes("entrega")) {
    const shipping = store.shippingCost ? `El envío cuesta $${store.shippingCost.toLocaleString("es-AR")}.` : "Consultanos por el envío.";
    return `Sí, hacemos envíos y también podés retirar gratis. ${shipping} ¿Cuál preferís?`;
  }
  if (m.includes("pago") || m.includes("efectivo") || m.includes("tarjeta") || m.includes("mercado")) {
    const methods = ["efectivo", "transferencia"];
    if (store.hasMpEnabled) methods.push("Mercado Pago");
    methods.push("débito y crédito");
    return `Aceptamos: ${methods.join(", ")}. ${store.cashDiscount ? `¡Con efectivo tenés ${store.cashDiscount}% de descuento!` : ""} ¿Cómo preferís pagar?`;
  }

  const words = m.split(/\s+/).filter((w) => w.length > 3);
  const match = products.find((p) => words.some((w) => p.name.toLowerCase().includes(w) || (p.category ?? "").toLowerCase().includes(w)));
  if (match) return `${match.name} cuesta $${match.price.toLocaleString("es-AR")}. ${match.description ?? ""} ¿Lo agregás al carrito?`;

  return `Tenemos ${products.length} productos desde $${minPrice.toLocaleString("es-AR")}. ¿Qué estás buscando?`;
}

function AIWidget({ store, products, slug }: { store: StoreInfo; products: Product[]; slug: string }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: `Hola! Soy la IA de ${store.name}. ¿En qué te puedo ayudar?` },
  ]);
  const [proactiveVisible, setProactiveVisible] = useState(false);
  const proactiveMsg = PROACTIVE_MESSAGES[Math.floor(Math.random() * PROACTIVE_MESSAGES.length)];
  const proactiveShown = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);
  const suggestions = SECTOR_SUGGESTIONS[store.sector] ?? SECTOR_SUGGESTIONS.otro;

  useEffect(() => {
    if (proactiveShown.current) return;
    const t = setTimeout(() => {
      if (!open) { setProactiveVisible(true); proactiveShown.current = true; }
    }, 30000);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function send(text?: string) {
    const msg = text ?? input;
    if (!msg.trim()) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: msg }];
    setMessages(next);
    setTimeout(() => {
      const reply = generateSmartReply(msg, products, store);
      setMessages((p) => [...p, { role: "assistant" as const, content: reply }]);
    }, 350);
  }

  return (
    <>
      <AnimatePresence>
        {proactiveVisible && !open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-24 right-6 z-50 bg-card border border-primary/30 rounded-2xl shadow-2xl p-4 max-w-xs"
          >
            <button onClick={() => setProactiveVisible(false)} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-primary mb-1">Asistente IA</p>
                <p className="text-sm">{proactiveMsg}</p>
                <button onClick={() => { setProactiveVisible(false); setOpen(true); }} className="mt-2 text-xs text-primary font-medium hover:underline">
                  Sí, quiero ayuda
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => { setOpen(true); setProactiveVisible(false); }} className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all z-50">
        <Bot className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="fixed bottom-24 right-6 w-[340px] bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            style={{ height: 460 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Asistente IA</p>
                  <p className="text-xs text-primary">En linea</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground p-1">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {suggestions.slice(0, 3).map((s) => (
                  <button key={s} onClick={() => send(s)} className="text-xs px-2.5 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20 hover:bg-primary/20 transition-colors text-left">
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="p-3 border-t border-border flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Escribí tu consulta..." className="text-sm bg-background h-9" />
              <Button size="icon" onClick={() => send()} className="bg-primary text-primary-foreground shrink-0 h-9 w-9">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function StoreFront() {
  const [, params] = useRoute("/tienda/:slug");
  const slug = params?.slug ?? "";

  const [store, setStore] = useState<StoreInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(`cart_${slug}`) ?? "[]"); } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      fetch(`/api/store/${slug}`).then((r) => r.ok ? r.json() : Promise.reject(r.status)),
      fetch(`/api/store/${slug}/products`).then((r) => r.ok ? r.json() : []),
    ])
      .then(([info, prods]) => { setStore(info); setProducts(prods); })
      .catch((e) => { if (e === 404) setNotFound(true); })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    localStorage.setItem(`cart_${slug}`, JSON.stringify(cart));
  }, [cart, slug]);

  function addToCart(product: Product) {
    setCart((c) => {
      const idx = c.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) { const n = [...c]; n[idx] = { ...n[idx], quantity: n[idx].quantity + 1 }; return n; }
      return [...c, { product, quantity: 1 }];
    });
  }

  function updateQty(id: number, delta: number) {
    setCart((c) => c.map((i) => i.product.id === id ? { ...i, quantity: i.quantity + delta } : i).filter((i) => i.quantity > 0));
  }

  const cartTotal = cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean) as string[]))];
  const filtered = activeCategory === "Todos" ? products : products.filter((p) => p.category === activeCategory);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound || !store) return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-xl font-bold mb-2">Tienda no encontrada</h1>
        <p className="text-muted-foreground text-sm">La tienda que buscás no existe o fue desactivada.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-bold text-lg leading-tight">{store.name}</h1>
            <p className="text-xs text-muted-foreground capitalize">{store.sector}</p>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:block">Carrito</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 pb-32">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium mb-1">Catalogo en construccion</p>
            <p className="text-sm">El negocio todavia no cargó productos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => {
              const inCart = cart.find((c) => c.product.id === p.id);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors group"
                >
                  <div className="w-full h-40 bg-muted/30 flex items-center justify-center text-4xl overflow-hidden">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl opacity-30">📦</span>
                    )}
                  </div>
                  <div className="p-4">
                    {p.category && <Badge variant="secondary" className="text-xs mb-2">{p.category}</Badge>}
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
                    {p.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-primary text-base">${p.price.toLocaleString("es-AR")}</span>
                      {inCart ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(p.id, -1)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-semibold w-5 text-center">{inCart.quantity}</span>
                          <button onClick={() => addToCart(p)} className="w-7 h-7 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80">
                            <Plus className="h-3 w-3 text-primary-foreground" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(p)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors">
                          <ShoppingCart className="h-3 w-3" />
                          Agregar
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} className="fixed inset-0 bg-black/50 z-40" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-card border-l border-border z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-semibold">Tu carrito ({cartCount})</h2>
                <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">El carrito esta vacío</p>
                ) : cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">${item.product.price.toLocaleString("es-AR")} c/u</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => updateQty(item.product.id, -1)} className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button onClick={() => addToCart(item.product)} className="w-6 h-6 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80">
                        <Plus className="h-3 w-3 text-primary-foreground" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-primary shrink-0 w-20 text-right">
                      ${(item.product.price * item.quantity).toLocaleString("es-AR")}
                    </p>
                  </div>
                ))}
              </div>

              {cart.length > 0 && (
                <div className="p-4 border-t border-border space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-bold text-lg">${cartTotal.toLocaleString("es-AR")}</span>
                  </div>
                  <Button
                    className="w-full bg-primary text-primary-foreground gap-2"
                    onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                  >
                    Finalizar pedido <ChevronRight className="h-4 w-4" />
                  </Button>
                  {store.whatsappNumber && (
                    <a
                      href={`https://wa.me/${store.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola! Quiero hacer un pedido en ${store.name}.\n\n${cart.map((i) => `• ${i.quantity}x ${i.product.name} - $${(i.product.price * i.quantity).toLocaleString("es-AR")}`).join("\n")}\n\nTotal: $${cartTotal.toLocaleString("es-AR")}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                    >
                      Pedir por WhatsApp
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {checkoutOpen && (
        <Checkout
          cart={cart}
          store={store}
          slug={slug}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => { setCart([]); setCheckoutOpen(false); }}
        />
      )}

      <AIWidget store={store} products={products} slug={slug} />
    </div>
  );
}
