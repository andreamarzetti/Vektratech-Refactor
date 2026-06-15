import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Send, Bot, X, Minus, Plus, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const RUBROS: Record<string, {
  name: string;
  sector: string;
  products: Array<{ id: number; name: string; price: number; category: string; description: string }>;
  suggestions: string[];
}> = {
  restaurante: {
    name: "La Parrilla del Centro",
    sector: "Restaurante",
    products: [
      { id: 1, name: "Milanesa napolitana", price: 3500, category: "Platos principales", description: "Milanesa de ternera con jamón, mozzarella y salsa de tomate" },
      { id: 2, name: "Bife de chorizo 300g", price: 5200, category: "Parrilla", description: "Corte premium a la parrilla con chimichurri casero" },
      { id: 3, name: "Ensalada mixta", price: 1800, category: "Ensaladas", description: "Lechuga, tomate, zanahoria, aceitunas y vinagreta" },
      { id: 4, name: "Empanadas x6", price: 2400, category: "Entradas", description: "Empanadas de carne cortada a cuchillo, al horno" },
      { id: 5, name: "Gaseosa 500ml", price: 800, category: "Bebidas", description: "Coca Cola, Sprite o Fanta" },
      { id: 6, name: "Agua mineral", price: 600, category: "Bebidas", description: "Agua con o sin gas 500ml" },
    ],
    suggestions: ["¿Cuál es el plato más vendido?", "¿Tienen opciones vegetarianas?", "¿Hacen delivery?", "¿Qué me recomendás para empezar?"],
  },
  ropa: {
    name: "Urban Style",
    sector: "Tienda de ropa",
    products: [
      { id: 1, name: "Remera básica", price: 4500, category: "Remeras", description: "100% algodón, disponible en S, M, L, XL" },
      { id: 2, name: "Jean slim fit", price: 12000, category: "Pantalones", description: "Denim premium con elastano, 28 al 36" },
      { id: 3, name: "Campera de abrigo", price: 18500, category: "Abrigos", description: "Relleno de pluma sintética, impermeable" },
      { id: 4, name: "Zapatillas urbanas", price: 22000, category: "Calzado", description: "Suela de goma, talle 38 al 45" },
      { id: 5, name: "Buzo con capucha", price: 9500, category: "Buzos", description: "Frisa por dentro, disponible en varios colores" },
      { id: 6, name: "Bermuda de tela", price: 7800, category: "Pantalones", description: "Tela ripstop, con bolsillos laterales" },
    ],
    suggestions: ["¿Qué talles tienen disponibles?", "¿Tienen descuentos?", "¿Cuáles son las novedades?", "¿Cuál es el producto más vendido?"],
  },
  dietetica: {
    name: "Sabores Naturales",
    sector: "Dietética",
    products: [
      { id: 1, name: "Proteína whey 1kg", price: 15000, category: "Suplementos", description: "25g proteína por porción, sabor chocolate o vainilla" },
      { id: 2, name: "Avena orgánica 500g", price: 1800, category: "Cereales", description: "Sin gluten certificado, copos finos" },
      { id: 3, name: "Creatina 300g", price: 8500, category: "Suplementos", description: "Creatina monohidrato pura, 3g por porción" },
      { id: 4, name: "Granola artesanal 400g", price: 2200, category: "Cereales", description: "Miel, avena y frutos secos sin azúcar agregada" },
      { id: 5, name: "Aceite de coco 500ml", price: 3500, category: "Aceites", description: "Extra virgen, prensado en frío" },
      { id: 6, name: "Semillas de chía 500g", price: 1200, category: "Semillas", description: "Ricas en omega-3 y fibra dietaria" },
    ],
    suggestions: ["Tengo $15.000, ¿qué me recomendás?", "¿Cuál tiene más proteína?", "¿Qué me recomendás para bajar de peso?", "¿Tienen productos veganos?"],
  },
  ferreteria: {
    name: "FerreMax",
    sector: "Ferretería",
    products: [
      { id: 1, name: "Taladro percutor 750W", price: 25000, category: "Herramientas eléctricas", description: "Con reversa, maletín incluido, brocas hasta 13mm" },
      { id: 2, name: "Pintura látex interior 10L", price: 8500, category: "Pinturas", description: "Rendimiento 10m² por litro, base agua" },
      { id: 3, name: "Sellador siliconado", price: 1800, category: "Adhesivos", description: "Transparente, resistente al agua, 280ml" },
      { id: 4, name: "Caño PVC 4\" x 3m", price: 2400, category: "Plomería", description: "Para desagüe, cédula 20" },
      { id: 5, name: "Discos de corte x10", price: 3200, category: "Abrasivos", description: "Para amoladora 4.5\", metal y acero inox" },
      { id: 6, name: "Llave inglesa 12\"", price: 4500, category: "Herramientas manuales", description: "Acero cromo vanadio, apertura 30mm" },
    ],
    suggestions: ["¿Qué necesito para pintar una habitación?", "¿Tienen caños de PVC?", "¿Cuál es el taladro más vendido?", "¿Hacen envío?"],
  },
  kiosco: {
    name: "Kiosco Don Jorge",
    sector: "Kiosco",
    products: [
      { id: 1, name: "Coca Cola 500ml", price: 850, category: "Bebidas", description: "Gaseosa sin azúcar disponible" },
      { id: 2, name: "Alfajor Milka", price: 650, category: "Chocolates", description: "Triple con dulce de leche" },
      { id: 3, name: "Papas fritas chicas", price: 500, category: "Snacks", description: "Bolsa 35g, varios sabores" },
      { id: 4, name: "Agua mineral 500ml", price: 500, category: "Bebidas", description: "Con o sin gas" },
      { id: 5, name: "Cigarrillos Marlboro", price: 2200, category: "Tabaco", description: "Atado x20" },
      { id: 6, name: "Chicles Trident", price: 350, category: "Golosinas", description: "Varios sabores, sin azúcar" },
    ],
    suggestions: ["¿Cuál es el más barato?", "¿Tienen bebidas sin azúcar?", "¿Aceptan tarjeta?", "¿Cuál es el snack más vendido?"],
  },
};

function ChatWidget({ sector, products, suggestions }: { sector: string; products: any[]; suggestions: string[] }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: `Hola! Soy el asistente de ${sector}. ¿En qué te puedo ayudar?` },
  ]);

  function generateReply(msg: string): string {
    const m = msg.toLowerCase();
    const sorted = [...products].sort((a, b) => a.price - b.price);
    if (m.includes("económic") || m.includes("barato") || m.includes("precio") || m.includes("presupuesto")) {
      const cheap = sorted.slice(0, 2);
      return `Las opciones más económicas son: ${cheap.map(p => `**${p.name}** ($${p.price.toLocaleString("es-AR")})`).join(", ")}. ¿Te interesa alguno?`;
    }
    if (m.includes("recomendar") || m.includes("mejor") || m.includes("conviene")) {
      const top = products.slice(0, 2);
      return `Te recomiendo: ${top.map(p => `**${p.name}** ($${p.price.toLocaleString("es-AR")})`).join(" o ")}. Son los más pedidos. ¿Querés más info?`;
    }
    return `Gracias por tu consulta. Tenemos **${products.length} productos** disponibles desde $${sorted[0]?.price.toLocaleString("es-AR")}. ¿Buscás algo en particular?`;
  }

  function send(text?: string) {
    const msg = text ?? input;
    if (!msg.trim()) return;
    const newMessages = [...messages, { role: "user" as const, content: msg }];
    const reply = generateReply(msg);
    setMessages([...newMessages, { role: "assistant", content: reply }]);
    setInput("");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors z-50"
      >
        <Bot className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            style={{ height: 420 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Asistente IA</p>
                  <p className="text-xs text-muted-foreground">En línea</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}>
                    {m.content.replace(/\*\*(.*?)\*\*/g, "$1")}
                  </div>
                </div>
              ))}
            </div>

            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {suggestions.slice(0, 2).map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full border border-primary/20 hover:bg-primary/20 transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="p-3 border-t border-border flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Escribí tu pregunta..."
                className="text-sm bg-background"
              />
              <Button size="icon" onClick={() => send()} className="bg-primary text-primary-foreground shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function DemoRubro() {
  const [, params] = useRoute("/demos/:rubro");
  const rubro = params?.rubro ?? "";
  const data = RUBROS[rubro];
  const [cart, setCart] = useState<Record<number, number>>({});

  if (!data) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Demo no encontrada</h1>
          <Link href="/demos"><Button>Ver todas las demos</Button></Link>
        </div>
      </div>
    );
  }

  const addToCart = (id: number) => setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const removeFromCart = (id: number) => setCart(c => {
    const n = (c[id] ?? 0) - 1;
    if (n <= 0) { const { [id]: _, ...rest } = c; return rest; }
    return { ...c, [id]: n };
  });
  const cartTotal = Object.entries(cart).reduce((acc, [id, qty]) => {
    const p = data.products.find(p => p.id === Number(id));
    return acc + (p?.price ?? 0) * qty;
  }, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20 pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pt-4">
            <Link href="/demos">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" /> Volver
              </Button>
            </Link>
          </div>

          <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
            <div>
              <Badge className="bg-primary/15 text-primary border-primary/30 mb-2">{data.sector}</Badge>
              <h1 className="text-3xl font-bold">{data.name}</h1>
              <p className="text-muted-foreground mt-1">Demo interactiva — probá la experiencia de tus clientes</p>
            </div>
            {cartCount > 0 && (
              <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Carrito ({cartCount} items)</p>
                  <p className="font-bold text-primary">${cartTotal.toLocaleString("es-AR")}</p>
                </div>
                <Button size="sm" className="bg-primary text-primary-foreground">Confirmar pedido</Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
              >
                <div className="w-full h-32 bg-muted/30 rounded-lg mb-3 flex items-center justify-center text-3xl">
                  🛍️
                </div>
                <Badge variant="secondary" className="text-xs mb-2">{p.category}</Badge>
                <h3 className="font-semibold text-sm mb-1">{p.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">${p.price.toLocaleString("es-AR")}</span>
                  {cart[p.id] ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(p.id)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{cart[p.id]}</span>
                      <button onClick={() => addToCart(p.id)} className="w-7 h-7 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80">
                        <Plus className="h-3 w-3 text-primary-foreground" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(p.id)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      Agregar
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <ChatWidget sector={data.name} products={data.products} suggestions={data.suggestions} />
    </div>
  );
}
