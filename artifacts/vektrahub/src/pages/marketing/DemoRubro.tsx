import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Send, Bot, X, Minus, Plus, ArrowLeft, Tag, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Product = { id: number; name: string; price: number; category: string; description: string; badge?: string };
type RubroData = {
  name: string;
  sector: string;
  banner: string;
  products: Product[];
  suggestions: string[];
};

const RUBROS: Record<string, RubroData> = {
  restaurante: {
    name: "Burger House",
    sector: "Restaurante",
    banner: "Hamburguesas artesanales y combos irresistibles",
    products: [
      { id: 1, name: "Burger clasica", price: 4800, category: "Hamburguesas", description: "200g de carne angus, lechuga, tomate, queso cheddar y salsa especial", badge: "Mas vendida" },
      { id: 2, name: "Burger BBQ bacon", price: 6200, category: "Hamburguesas", description: "Doble medallón, bacon crocante, cheddar y salsa BBQ ahumada" },
      { id: 3, name: "Burger veggie", price: 5400, category: "Hamburguesas", description: "Medallón de garbanzos, aguacate, lechuga y mostaza dijon" },
      { id: 4, name: "Combo burger + papas + gaseosa", price: 8900, category: "Combos", description: "Cualquier burger + papas fritas medianas + gaseosa 500ml", badge: "Promo" },
      { id: 5, name: "Papas fritas medianas", price: 2200, category: "Acompañamientos", description: "Papas cortadas a mano, crocantes, con sal marina" },
      { id: 6, name: "Papas con cheddar y bacon", price: 3100, category: "Acompañamientos", description: "Papas fritas bañadas en salsa cheddar y bacon crocante" },
      { id: 7, name: "Coca Cola 500ml", price: 900, category: "Bebidas", description: "Fría, con o sin azucar" },
      { id: 8, name: "Agua mineral", price: 700, category: "Bebidas", description: "Con o sin gas, 500ml" },
      { id: 9, name: "Porcion de nuggets x8", price: 3600, category: "Acompañamientos", description: "Nuggets de pollo con salsa de tu elección" },
    ],
    suggestions: ["Tengo hambre y quiero gastar menos de $10.000", "Recomendame un combo", "¿Que hamburguesa es la mas vendida?", "¿Hacen envio?"],
  },
  dietetica: {
    name: "NutriLife Market",
    sector: "Dietetica",
    banner: "Suplementos, organicos y snacks saludables",
    products: [
      { id: 1, name: "Proteina whey 1kg chocolate", price: 18500, category: "Proteinas", description: "25g de proteina por porcion, baja en lactosa, sabor chocolate belga", badge: "Top ventas" },
      { id: 2, name: "Proteina whey 1kg vainilla", price: 18500, category: "Proteinas", description: "25g de proteina por porcion, sabor vainilla suave" },
      { id: 3, name: "Creatina monohidrato 300g", price: 9800, category: "Rendimiento", description: "Creatina pura, 3g por porcion, sin sabor, mezcla facil" },
      { id: 4, name: "BCAA 2:1:1 200g", price: 7200, category: "Rendimiento", description: "Aminoacidos ramificados para recuperacion muscular, sabor citrico" },
      { id: 5, name: "Avena organica sin TACC 1kg", price: 3200, category: "Alimentos", description: "Copos finos, certificado organico y sin gluten" },
      { id: 6, name: "Granola artesanal 400g", price: 2800, category: "Alimentos", description: "Miel, avena tostada, frutos secos y arandanos, sin azucar agregada" },
      { id: 7, name: "Barra proteica x12", price: 8400, category: "Snacks", description: "20g de proteina por barra, varios sabores, sin azucar" },
      { id: 8, name: "Colageno hidrolizado 300g", price: 6500, category: "Suplementos", description: "Peptidos de colageno tipo I y III, sin sabor, disuelve en frio" },
      { id: 9, name: "Omega 3 1000mg x60", price: 4200, category: "Suplementos", description: "EPA y DHA en proporciones optimas, capsulas blandas" },
    ],
    suggestions: ["Tengo $20.000 para proteina", "Soy principiante, ¿que me recomendan?", "Quiero aumentar masa muscular", "¿Tienen productos veganos?"],
  },
  ferreteria: {
    name: "FerreMax",
    sector: "Ferreteria",
    banner: "Herramientas, pinturas y materiales de construccion",
    products: [
      { id: 1, name: "Taladro percutor 750W", price: 28500, category: "Electricos", description: "Con reversa, mandril 13mm, maletin incluido, ideal mamposteria", badge: "Mas vendido" },
      { id: 2, name: "Amoladora angular 4.5\"", price: 22000, category: "Electricos", description: "850W, disco de corte incluido, protector ajustable" },
      { id: 3, name: "Pintura latex interior blanca 10L", price: 9800, category: "Pinturas", description: "Alto rendimiento, lavable, secado rapido, 10m2/litro" },
      { id: 4, name: "Esmalte sintetico brillante 1L", price: 4200, category: "Pinturas", description: "Para madera y metal, excelente cobertura, varios colores" },
      { id: 5, name: "Sellador siliconado transparente", price: 2100, category: "Adhesivos", description: "Resistente al agua, uso interior/exterior, 280ml" },
      { id: 6, name: "Cano PVC 4\" x 3m", price: 2800, category: "Plomeria", description: "Para desague, cedula 20, con extremo biselado" },
      { id: 7, name: "Llave combinada 17mm", price: 1800, category: "Manuales", description: "Acero cromo vanadio, extremos pulidos, tratamiento anticorrosion" },
      { id: 8, name: "Nivel digital 60cm", price: 4500, category: "Medicion", description: "Pantalla LCD, precision 0.1°, con estuche" },
      { id: 9, name: "Set de brocas HSS x19", price: 3200, category: "Accesorios", description: "Para metal, madera y plastico, estuche organizador incluido" },
    ],
    suggestions: ["Necesito pintar una habitacion, ¿que necesito?", "¿Que taladro me recomiendan?", "Tengo una perdida de agua", "¿Hacen envio?"],
  },
  ropa: {
    name: "Urban Style",
    sector: "Indumentaria",
    banner: "Moda urbana para hombre y mujer",
    products: [
      { id: 1, name: "Remera oversize premium", price: 6500, category: "Remeras", description: "100% algodon peinado, corte relaxed, disponible S-XXL", badge: "Novedad" },
      { id: 2, name: "Jean slim fit elastizado", price: 15800, category: "Pantalones", description: "Denim premium con 2% elastano, talle 28-38, varios lavados" },
      { id: 3, name: "Campera de abrigo relleno", price: 22500, category: "Abrigos", description: "Relleno fibra sintetica, impermeable, capucha desmontable" },
      { id: 4, name: "Zapatillas lifestyle blancas", price: 26000, category: "Calzado", description: "Suela EVA, capellada cuero ecologico, talle 36-45" },
      { id: 5, name: "Buzo canguro con capucha", price: 12500, category: "Buzos", description: "Interior afelpado, bolsillo frontal, colores neutros y vivos" },
      { id: 6, name: "Jogger cargo tela", price: 11000, category: "Pantalones", description: "Bolsillos laterales con cierre, elastico en tobillo" },
      { id: 7, name: "Gorra panel plano bordada", price: 5200, category: "Accesorios", description: "Cierre snapback, tela ripstop, logotipo bordado" },
      { id: 8, name: "Camiseta de lino slim", price: 8900, category: "Camisas", description: "Fresca y liviana, ideal verano, talle S-XL" },
    ],
    suggestions: ["Necesito un outfit para una fiesta", "Busco algo economico", "¿Tienen talles grandes?", "¿Que hay de nuevo?"],
  },
  kiosco: {
    name: "Kiosco 24",
    sector: "Kiosco",
    banner: "Bebidas, golosinas y snacks - abierto las 24hs",
    products: [
      { id: 1, name: "Coca Cola 500ml", price: 950, category: "Bebidas", description: "Classic o sin azucar, bien fria" },
      { id: 2, name: "Agua mineral 500ml", price: 650, category: "Bebidas", description: "Con o sin gas, marca premium" },
      { id: 3, name: "Alfajor Milka triple", price: 850, category: "Chocolates", description: "Triple con dulce de leche y cobertura de chocolate con leche" },
      { id: 4, name: "Alfajor Havanna clasico", price: 1100, category: "Chocolates", description: "Marino bañado en chocolate negro, el autentico" },
      { id: 5, name: "Papas fritas Lay's 45g", price: 680, category: "Snacks", description: "Sabor clasico, sal y pimienta o BBQ" },
      { id: 6, name: "Chicles Trident sin azucar", price: 450, category: "Golosinas", description: "Varios sabores: menta, sandia, frutilla" },
      { id: 7, name: "Caramelos masticables x10", price: 350, category: "Golosinas", description: "Surtido de sabores, sin conservantes artificiales" },
      { id: 8, name: "Red Bull 250ml", price: 1400, category: "Bebidas", description: "Energizante original o sugar free" },
    ],
    suggestions: ["¿Que tienen para compartir?", "Tengo $3.000, ¿que me alcanzan?", "¿Tienen algo sin azucar?", "¿Cual es la promo?"],
  },
  distribuidora: {
    name: "Distrib. Central",
    sector: "Distribuidora",
    banner: "Mayorista de productos de limpieza y bazar",
    products: [
      { id: 1, name: "Lavandina 5L x6 unid.", price: 8400, category: "Limpieza", description: "Concentrada 55g/L, pack x6, ideal comercios" },
      { id: 2, name: "Detergente 3L x6 unid.", price: 11200, category: "Limpieza", description: "Desengrasante premium, varios aromas, pack mayorista" },
      { id: 3, name: "Escoba pvc cerda dura x12", price: 14400, category: "Bazar", description: "Mango de madera 120cm, ideal para negocios" },
      { id: 4, name: "Trapo de piso algodón x6", price: 7200, category: "Bazar", description: "400g, alta absorcion, refuerzo en los bordes" },
      { id: 5, name: "Bolsas residuos 80x110 x100", price: 4800, category: "Descartables", description: "Negras, alta resistencia, rollo x100" },
      { id: 6, name: "Papel higienico x48 rollos", price: 18600, category: "Papel", description: "Triple hoja, 30m por rollo, blanco" },
    ],
    suggestions: ["¿Cual es el precio por mayor?", "¿Cuanto es el pedido minimo?", "¿Hacen factura?", "¿Hacen envio a domicilio?"],
  },
};

const CATEGORY_ICONS: Record<string, string> = {
  Hamburguesas: "🍔", Combos: "🎁", Acompañamientos: "🍟", Bebidas: "🥤",
  Proteinas: "💪", Rendimiento: "⚡", Alimentos: "🌾", Snacks: "🍫", Suplementos: "💊",
  Electricos: "🔌", Pinturas: "🎨", Adhesivos: "🔧", Plomeria: "🚿", Manuales: "🔨", Medicion: "📏", Accesorios: "🗜️",
  Remeras: "👕", Pantalones: "👖", Abrigos: "🧥", Calzado: "👟", Buzos: "🧣", Accesorios2: "🧢", Camisas: "👔",
  Chocolates: "🍫", Golosinas: "🍬",
  Limpieza: "🧹", Bazar: "🪣", Descartables: "🛍️", Papel: "📦",
};

function getIcon(category: string): string {
  return CATEGORY_ICONS[category] ?? "📦";
}

const PROACTIVE_MESSAGES = [
  "¿Necesitas ayuda para elegir?",
  "¿Querés que te recomiende algo según tu presupuesto?",
  "¿Buscás algo en particular o querés ver lo más vendido?",
];

function ChatWidget({ sector, name, products, suggestions }: { sector: string; name: string; products: Product[]; suggestions: string[] }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: `Hola! Soy la IA vendedora de **${name}**. ¿En qué te puedo ayudar hoy?` },
  ]);
  const [proactiveVisible, setProactiveVisible] = useState(false);
  const [proactiveMsg] = useState(() => PROACTIVE_MESSAGES[Math.floor(Math.random() * PROACTIVE_MESSAGES.length)]);
  const proactiveShownRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (proactiveShownRef.current) return;
    const timer = setTimeout(() => {
      if (!open) {
        setProactiveVisible(true);
        proactiveShownRef.current = true;
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function generateReply(msg: string, history: typeof messages): string {
    const m = msg.toLowerCase();
    const prices = products.map((p) => p.price);
    const minPrice = Math.min(...prices);

    const budgetMatch = m.match(/\$?\s*(\d[\d.,]*)/);
    if (budgetMatch && (m.includes("tengo") || m.includes("presupuesto") || m.includes("gasto") || m.includes("alcanza"))) {
      const budget = parseFloat(budgetMatch[1].replace(/[.,]/g, ""));
      const affordable = [...products].filter((p) => p.price <= budget).sort((a, b) => b.price - a.price).slice(0, 3);
      if (affordable.length > 0) {
        return `Con $${budget.toLocaleString("es-AR")} te alcanza para: ${affordable.map((p) => `**${p.name}** ($${p.price.toLocaleString("es-AR")})`).join(", ")}. ¿Cuál te interesa?`;
      }
      return `Con ese presupuesto el rango está un poco ajustado. Los más accesibles empiezan en $${minPrice.toLocaleString("es-AR")}. ¿Querés ver opciones?`;
    }

    if (m.includes("económic") || m.includes("barato") || m.includes("accesible") || m.includes("precio bajo")) {
      const cheap = [...products].sort((a, b) => a.price - b.price).slice(0, 3);
      return `Las opciones más económicas son: ${cheap.map((p) => `**${p.name}** ($${p.price.toLocaleString("es-AR")})`).join(", ")}. ¿Te interesa alguno?`;
    }

    if (m.includes("premium") || m.includes("mejor") || m.includes("top") || m.includes("lo mejor")) {
      const top = [...products].sort((a, b) => b.price - a.price).slice(0, 3);
      return `Los productos premium son: ${top.map((p) => `**${p.name}** ($${p.price.toLocaleString("es-AR")})`).join(", ")}. Son los de mayor calidad.`;
    }

    if (m.includes("recomendar") || m.includes("conviene") || m.includes("elegir") || m.includes("cuál") || m.includes("cual")) {
      const featured = products.filter((p) => p.badge).slice(0, 2);
      const recs = featured.length > 0 ? featured : products.slice(0, 2);
      return `Te recomiendo especialmente **${recs[0]?.name}** ($${recs[0]?.price.toLocaleString("es-AR")}) — ${recs[0]?.description}. ${recs[1] ? `También está buenísimo **${recs[1].name}**.` : ""} ¿Lo agregás?`;
    }

    if (m.includes("combo") || m.includes("juntos") || m.includes("complemento") || m.includes("además")) {
      const combo = products.slice(0, 3);
      return `Podés combinar: ${combo.map((p) => `**${p.name}**`).join(", ")}. ¡Una gran combinación! ¿Armamos el pedido?`;
    }

    if (m.includes("vendido") || m.includes("popular") || m.includes("pedido") || m.includes("estrella")) {
      const star = products.find((p) => p.badge) ?? products[0];
      return `El más pedido es **${star.name}** ($${star.price.toLocaleString("es-AR")}). ${star.description}. ¡Lo eligen la mayoría de los clientes!`;
    }

    if (m.includes("principiante") || m.includes("empezar") || m.includes("inicio") || m.includes("primera")) {
      const starter = [...products].sort((a, b) => a.price - b.price).slice(0, 2);
      return `Para empezar, te recomiendo **${starter[0]?.name}** ($${starter[0]?.price.toLocaleString("es-AR")}). Es ideal para quienes están dando sus primeros pasos. ¿Querés más info?`;
    }

    if (m.includes("vegano") || m.includes("vegetariano") || m.includes("sin tacc") || m.includes("gluten")) {
      const veg = products.filter((p) => p.description.toLowerCase().includes("vegano") || p.description.toLowerCase().includes("orgánico") || p.description.toLowerCase().includes("organico") || p.name.toLowerCase().includes("veggie"));
      if (veg.length > 0) {
        return `Tenemos opciones para vos: ${veg.map((p) => `**${p.name}** ($${p.price.toLocaleString("es-AR")})`).join(", ")}. ¿Querés más detalles?`;
      }
      return `Consultanos por opciones especiales, siempre tratamos de tener algo para cada necesidad.`;
    }

    if (m.includes("envío") || m.includes("delivery") || m.includes("llega")) {
      return `Sí, hacemos envíos y también podés pasar a retirar sin costo. ¿Querés que te calcule el costo según tu zona?`;
    }

    const words = m.split(/\s+/).filter((w) => w.length > 3);
    const match = products.find((p) =>
      words.some((w) => p.name.toLowerCase().includes(w) || p.category.toLowerCase().includes(w)),
    );
    if (match) {
      return `**${match.name}** cuesta $${match.price.toLocaleString("es-AR")}. ${match.description}. ¿Lo querés agregar al carrito?`;
    }

    const catList = [...new Set(products.map((p) => p.category))].slice(0, 4);
    return `Tenemos **${products.length} productos** en ${catList.join(", ")} y más. Precios desde $${minPrice.toLocaleString("es-AR")}. ¿Buscás algo en particular?`;
  }

  function send(text?: string) {
    const msg = text ?? input;
    if (!msg.trim()) return;
    setInput("");
    const newHistory = [...messages, { role: "user" as const, content: msg }];
    setMessages(newHistory);
    setTimeout(() => {
      const reply = generateReply(msg, newHistory);
      setMessages((prev) => [...prev, { role: "assistant" as const, content: reply }]);
    }, 400);
  }

  const showSuggestions = messages.length <= 1;

  return (
    <>
      <AnimatePresence>
        {proactiveVisible && !open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 bg-card border border-primary/30 rounded-2xl shadow-2xl p-4 max-w-xs"
          >
            <button
              onClick={() => setProactiveVisible(false)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-primary mb-1">IA Vendedora</p>
                <p className="text-sm text-foreground">{proactiveMsg}</p>
                <button
                  onClick={() => { setProactiveVisible(false); setOpen(true); }}
                  className="mt-2 text-xs text-primary font-medium hover:underline"
                >
                  Sí, necesito ayuda
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => { setOpen(true); setProactiveVisible(false); }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all z-50"
      >
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
                  <p className="text-sm font-semibold leading-tight">IA Vendedora</p>
                  <p className="text-xs text-primary">En linea · {name}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground p-1">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {m.content.replace(/\*\*(.*?)\*\*/g, "$1")}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {showSuggestions && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {suggestions.slice(0, 3).map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-2.5 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20 hover:bg-primary/20 transition-colors text-left"
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
                placeholder="Consultá lo que quieras..."
                className="text-sm bg-background h-9"
              />
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

export default function DemoRubro() {
  const [, params] = useRoute("/demos/:rubro");
  const rubro = params?.rubro ?? "";
  const data = RUBROS[rubro];
  const [cart, setCart] = useState<Record<number, number>>({});
  const [activeCategory, setActiveCategory] = useState("Todos");

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

  const categories = ["Todos", ...Array.from(new Set(data.products.map((p) => p.category)))];
  const filtered = activeCategory === "Todos" ? data.products : data.products.filter((p) => p.category === activeCategory);

  const addToCart = (id: number) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const removeFromCart = (id: number) =>
    setCart((c) => {
      const n = (c[id] ?? 0) - 1;
      if (n <= 0) { const { [id]: _, ...rest } = c; return rest; }
      return { ...c, [id]: n };
    });
  const cartTotal = Object.entries(cart).reduce((acc, [id, qty]) => {
    const p = data.products.find((p) => p.id === Number(id));
    return acc + (p?.price ?? 0) * qty;
  }, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20 pb-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pt-4">
            <Link href="/demos">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" /> Volver
              </Button>
            </Link>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 mb-8">
            <Badge className="bg-primary/15 text-primary border-primary/30 mb-2">{data.sector}</Badge>
            <h1 className="text-3xl font-bold mb-1">{data.name}</h1>
            <p className="text-muted-foreground">{data.banner}</p>
          </div>

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat !== "Todos" && getIcon(cat)} {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors group"
              >
                <div className="w-full h-36 bg-muted/30 flex items-center justify-center text-4xl relative">
                  {getIcon(p.category)}
                  {p.badge && (
                    <span className="absolute top-2 left-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="text-xs mb-2">{p.category}</Badge>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary text-base">${p.price.toLocaleString("es-AR")}</span>
                    {cart[p.id] ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(p.id)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center">{cart[p.id]}</span>
                        <button onClick={() => addToCart(p.id)} className="w-7 h-7 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors">
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
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="bg-card border border-border rounded-2xl px-5 py-3 flex items-center gap-5 shadow-2xl">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">{cartCount}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Carrito</p>
                  <p className="font-bold text-primary text-sm">${cartTotal.toLocaleString("es-AR")}</p>
                </div>
              </div>
              <Button size="sm" className="bg-primary text-primary-foreground">
                Confirmar pedido
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatWidget sector={data.sector} name={data.name} products={data.products} suggestions={data.suggestions} />
    </div>
  );
}
