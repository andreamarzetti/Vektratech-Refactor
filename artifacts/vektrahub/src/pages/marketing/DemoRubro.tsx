import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Send, Bot, X, Minus, Plus, ArrowLeft, Sparkles,
  Search, MapPin, Clock, Phone, Star, MessageCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  badge?: string;
  stock?: number;
  image?: string;
};

type RubroData = {
  name: string;
  sector: string;
  banner: string;
  bannerImg: string;
  primaryColor: string;
  address: string;
  hours: string;
  whatsapp: string;
  products: Product[];
  suggestions: string[];
};

const PRODUCT_IMAGES: Record<string, string> = {
  Hamburguesas: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=280&fit=crop&auto=format",
  Combos: "https://images.unsplash.com/photo-1561758033-48d52648ae8e?w=400&h=280&fit=crop&auto=format",
  Acompañamientos: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=280&fit=crop&auto=format",
  Bebidas: "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400&h=280&fit=crop&auto=format",
  Proteinas: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400&h=280&fit=crop&auto=format",
  Rendimiento: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=280&fit=crop&auto=format",
  Alimentos: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=280&fit=crop&auto=format",
  Snacks: "https://images.unsplash.com/photo-1559181567-c3190958d3e4?w=400&h=280&fit=crop&auto=format",
  Suplementos: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=280&fit=crop&auto=format",
  Electricos: "https://images.unsplash.com/photo-1504328803780-eda012c6f0d3?w=400&h=280&fit=crop&auto=format",
  Pinturas: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=280&fit=crop&auto=format",
  Adhesivos: "https://images.unsplash.com/photo-1504328803780-eda012c6f0d3?w=400&h=280&fit=crop&auto=format",
  Plomeria: "https://images.unsplash.com/photo-1504328803780-eda012c6f0d3?w=400&h=280&fit=crop&auto=format",
  Manuales: "https://images.unsplash.com/photo-1581578593718-b9c0c5f30168?w=400&h=280&fit=crop&auto=format",
  Medicion: "https://images.unsplash.com/photo-1581578593718-b9c0c5f30168?w=400&h=280&fit=crop&auto=format",
  Accesorios: "https://images.unsplash.com/photo-1504328803780-eda012c6f0d3?w=400&h=280&fit=crop&auto=format",
  Remeras: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=280&fit=crop&auto=format",
  Pantalones: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=280&fit=crop&auto=format",
  Abrigos: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=280&fit=crop&auto=format",
  Calzado: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=280&fit=crop&auto=format",
  Buzos: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=280&fit=crop&auto=format",
  Camisas: "https://images.unsplash.com/photo-1596463269096-5f09ec640d00?w=400&h=280&fit=crop&auto=format",
  Chocolates: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&h=280&fit=crop&auto=format",
  Golosinas: "https://images.unsplash.com/photo-1582004531534-a7cc2817e53b?w=400&h=280&fit=crop&auto=format",
  Limpieza: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=280&fit=crop&auto=format",
  Bazar: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=280&fit=crop&auto=format",
  Descartables: "https://images.unsplash.com/photo-1592414846235-7bdb0a5b99bb?w=400&h=280&fit=crop&auto=format",
  Papel: "https://images.unsplash.com/photo-1567598508481-65985588e295?w=400&h=280&fit=crop&auto=format",
};

const CAT_COLORS: Record<string, string> = {
  Hamburguesas: "from-amber-400 to-orange-500",
  Combos: "from-orange-400 to-red-500",
  Acompañamientos: "from-yellow-400 to-amber-500",
  Bebidas: "from-cyan-400 to-blue-500",
  Proteinas: "from-blue-500 to-violet-600",
  Rendimiento: "from-emerald-400 to-green-600",
  Alimentos: "from-lime-400 to-emerald-500",
  Snacks: "from-rose-400 to-pink-500",
  Suplementos: "from-violet-500 to-purple-700",
  Electricos: "from-slate-500 to-slate-700",
  Pinturas: "from-pink-400 to-rose-500",
  Adhesivos: "from-gray-500 to-gray-700",
  Plomeria: "from-blue-400 to-cyan-600",
  Manuales: "from-amber-500 to-yellow-600",
  Medicion: "from-teal-400 to-cyan-600",
  Accesorios: "from-zinc-400 to-zinc-600",
  Remeras: "from-slate-400 to-slate-600",
  Pantalones: "from-indigo-400 to-blue-600",
  Abrigos: "from-stone-400 to-stone-600",
  Calzado: "from-amber-600 to-orange-700",
  Buzos: "from-gray-400 to-gray-600",
  Camisas: "from-sky-400 to-blue-600",
  Chocolates: "from-amber-700 to-brown-800",
  Golosinas: "from-pink-400 to-rose-500",
  Limpieza: "from-cyan-400 to-teal-600",
  Bazar: "from-orange-400 to-amber-600",
  Descartables: "from-slate-400 to-zinc-500",
  Papel: "from-gray-300 to-slate-400",
};

const CATEGORY_ICONS: Record<string, string> = {
  Hamburguesas: "🍔", Combos: "🎁", Acompañamientos: "🍟", Bebidas: "🥤",
  Proteinas: "💪", Rendimiento: "⚡", Alimentos: "🌾", Snacks: "🍫", Suplementos: "💊",
  Electricos: "🔌", Pinturas: "🎨", Adhesivos: "🔧", Plomeria: "🚿", Manuales: "🔨", Medicion: "📏", Accesorios: "🗜️",
  Remeras: "👕", Pantalones: "👖", Abrigos: "🧥", Calzado: "👟", Buzos: "🧣", Camisas: "👔",
  Chocolates: "🍫", Golosinas: "🍬",
  Limpieza: "🧹", Bazar: "🪣", Descartables: "🛍️", Papel: "📦",
};

const RUBROS: Record<string, RubroData> = {
  restaurante: {
    name: "Burger House",
    sector: "Restaurante",
    banner: "Hamburguesas artesanales y combos irresistibles",
    bannerImg: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&h=500&fit=crop&auto=format",
    primaryColor: "#EA580C",
    address: "Av. Corrientes 1234, CABA",
    hours: "Lun-Dom: 11:00 - 00:00",
    whatsapp: "5491100000001",
    products: [
      { id: 1, name: "Burger clasica", price: 4800, category: "Hamburguesas", description: "200g de carne angus, lechuga, tomate, queso cheddar y salsa especial", badge: "Mas vendida", stock: 20 },
      { id: 2, name: "Burger BBQ bacon", price: 6200, category: "Hamburguesas", description: "Doble medallón, bacon crocante, cheddar y salsa BBQ ahumada", stock: 15 },
      { id: 3, name: "Burger veggie", price: 5400, category: "Hamburguesas", description: "Medallón de garbanzos, aguacate, lechuga y mostaza dijon", stock: 8 },
      { id: 4, name: "Combo burger + papas + gaseosa", price: 8900, category: "Combos", description: "Cualquier burger + papas fritas medianas + gaseosa 500ml", badge: "Promo", stock: 30 },
      { id: 5, name: "Papas fritas medianas", price: 2200, category: "Acompañamientos", description: "Papas cortadas a mano, crocantes, con sal marina", stock: 50 },
      { id: 6, name: "Papas con cheddar y bacon", price: 3100, category: "Acompañamientos", description: "Papas fritas bañadas en salsa cheddar y bacon crocante", stock: 25 },
      { id: 7, name: "Coca Cola 500ml", price: 900, category: "Bebidas", description: "Fría, con o sin azucar", stock: 100 },
      { id: 8, name: "Agua mineral", price: 700, category: "Bebidas", description: "Con o sin gas, 500ml", stock: 80 },
      { id: 9, name: "Porcion de nuggets x8", price: 3600, category: "Acompañamientos", description: "Nuggets de pollo con salsa de tu elección", stock: 4 },
    ],
    suggestions: ["Tengo hambre y quiero gastar menos de $10.000", "Recomendame un combo", "¿Que hamburguesa es la mas vendida?", "¿Hacen envio?"],
  },
  dietetica: {
    name: "NutriLife Market",
    sector: "Dietética",
    banner: "Suplementos, orgánicos y snacks saludables",
    bannerImg: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1400&h=500&fit=crop&auto=format",
    primaryColor: "#16A34A",
    address: "Av. Santa Fe 2890, Palermo",
    hours: "Lun-Sáb: 09:00 - 20:00",
    whatsapp: "5491100000002",
    products: [
      { id: 1, name: "Proteina whey 1kg chocolate", price: 18500, category: "Proteinas", description: "25g de proteina por porcion, baja en lactosa, sabor chocolate belga", badge: "Top ventas", stock: 12 },
      { id: 2, name: "Proteina whey 1kg vainilla", price: 18500, category: "Proteinas", description: "25g de proteina por porcion, sabor vainilla suave", stock: 8 },
      { id: 3, name: "Creatina monohidrato 300g", price: 9800, category: "Rendimiento", description: "Creatina pura, 3g por porcion, sin sabor, mezcla facil", stock: 20 },
      { id: 4, name: "BCAA 2:1:1 200g", price: 7200, category: "Rendimiento", description: "Aminoacidos ramificados para recuperacion muscular, sabor citrico", stock: 15 },
      { id: 5, name: "Avena organica sin TACC 1kg", price: 3200, category: "Alimentos", description: "Copos finos, certificado organico y sin gluten", stock: 30 },
      { id: 6, name: "Granola artesanal 400g", price: 2800, category: "Alimentos", description: "Miel, avena tostada, frutos secos y arandanos, sin azucar agregada", stock: 25 },
      { id: 7, name: "Barra proteica x12", price: 8400, category: "Snacks", description: "20g de proteina por barra, varios sabores, sin azucar", badge: "Promo", stock: 3 },
      { id: 8, name: "Colageno hidrolizado 300g", price: 6500, category: "Suplementos", description: "Peptidos de colageno tipo I y III, sin sabor, disuelve en frio", stock: 18 },
      { id: 9, name: "Omega 3 1000mg x60", price: 4200, category: "Suplementos", description: "EPA y DHA en proporciones optimas, capsulas blandas", stock: 22 },
    ],
    suggestions: ["Tengo $20.000 para proteina", "Soy principiante, ¿que me recomendan?", "Quiero aumentar masa muscular", "¿Tienen productos veganos?"],
  },
  ferreteria: {
    name: "FerreMax",
    sector: "Ferretería",
    banner: "Herramientas, pinturas y materiales de construcción",
    bannerImg: "https://images.unsplash.com/photo-1504328803780-eda012c6f0d3?w=1400&h=500&fit=crop&auto=format",
    primaryColor: "#1D4ED8",
    address: "Av. Rivadavia 5600, Caballito",
    hours: "Lun-Sáb: 08:00 - 19:00",
    whatsapp: "5491100000003",
    products: [
      { id: 1, name: "Taladro percutor 750W", price: 28500, category: "Electricos", description: "Con reversa, mandril 13mm, maletin incluido, ideal mamposteria", badge: "Mas vendido", stock: 6 },
      { id: 2, name: "Amoladora angular 4.5\"", price: 22000, category: "Electricos", description: "850W, disco de corte incluido, protector ajustable", stock: 4 },
      { id: 3, name: "Pintura latex interior blanca 10L", price: 9800, category: "Pinturas", description: "Alto rendimiento, lavable, secado rapido, 10m2/litro", stock: 30 },
      { id: 4, name: "Esmalte sintetico brillante 1L", price: 4200, category: "Pinturas", description: "Para madera y metal, excelente cobertura, varios colores", stock: 50 },
      { id: 5, name: "Sellador siliconado transparente", price: 2100, category: "Adhesivos", description: "Resistente al agua, uso interior/exterior, 280ml", stock: 40 },
      { id: 6, name: "Cano PVC 4\" x 3m", price: 2800, category: "Plomeria", description: "Para desague, cedula 20, con extremo biselado", stock: 20 },
      { id: 7, name: "Llave combinada 17mm", price: 1800, category: "Manuales", description: "Acero cromo vanadio, extremos pulidos, tratamiento anticorrosion", stock: 35 },
      { id: 8, name: "Nivel digital 60cm", price: 4500, category: "Medicion", description: "Pantalla LCD, precision 0.1°, con estuche", stock: 10 },
      { id: 9, name: "Set de brocas HSS x19", price: 3200, category: "Accesorios", description: "Para metal, madera y plastico, estuche organizador incluido", stock: 25 },
    ],
    suggestions: ["Necesito pintar una habitacion, ¿que necesito?", "¿Que taladro me recomiendan?", "Tengo una perdida de agua", "¿Hacen envio?"],
  },
  ropa: {
    name: "Urban Style",
    sector: "Indumentaria",
    banner: "Moda urbana para hombre y mujer",
    bannerImg: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&h=500&fit=crop&auto=format",
    primaryColor: "#0F172A",
    address: "Florida 850, Microcentro",
    hours: "Lun-Sáb: 10:00 - 20:00",
    whatsapp: "5491100000004",
    products: [
      { id: 1, name: "Remera oversize premium", price: 6500, category: "Remeras", description: "100% algodon peinado, corte relaxed, disponible S-XXL", badge: "Novedad", stock: 18 },
      { id: 2, name: "Jean slim fit elastizado", price: 15800, category: "Pantalones", description: "Denim premium con 2% elastano, talle 28-38, varios lavados", stock: 12 },
      { id: 3, name: "Campera de abrigo relleno", price: 22500, category: "Abrigos", description: "Relleno fibra sintetica, impermeable, capucha desmontable", stock: 5 },
      { id: 4, name: "Zapatillas lifestyle blancas", price: 26000, category: "Calzado", description: "Suela EVA, capellada cuero ecologico, talle 36-45", badge: "Top", stock: 3 },
      { id: 5, name: "Buzo canguro con capucha", price: 12500, category: "Buzos", description: "Interior afelpado, bolsillo frontal, colores neutros y vivos", stock: 20 },
      { id: 6, name: "Jogger cargo tela", price: 11000, category: "Pantalones", description: "Bolsillos laterales con cierre, elastico en tobillo", stock: 15 },
      { id: 7, name: "Gorra panel plano bordada", price: 5200, category: "Accesorios", description: "Cierre snapback, tela ripstop, logotipo bordado", stock: 25 },
      { id: 8, name: "Camiseta de lino slim", price: 8900, category: "Camisas", description: "Fresca y liviana, ideal verano, talle S-XL", stock: 10 },
    ],
    suggestions: ["Necesito un outfit para una fiesta", "Busco algo economico", "¿Tienen talles grandes?", "¿Que hay de nuevo?"],
  },
  kiosco: {
    name: "Kiosco 24",
    sector: "Kiosco",
    banner: "Bebidas, golosinas y snacks — abierto las 24hs",
    bannerImg: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&h=500&fit=crop&auto=format",
    primaryColor: "#DC2626",
    address: "Cabildo 1850, Belgrano",
    hours: "Las 24 horas, todos los días",
    whatsapp: "5491100000005",
    products: [
      { id: 1, name: "Coca Cola 500ml", price: 950, category: "Bebidas", description: "Classic o sin azucar, bien fria", stock: 60 },
      { id: 2, name: "Agua mineral 500ml", price: 650, category: "Bebidas", description: "Con o sin gas, marca premium", stock: 80 },
      { id: 3, name: "Alfajor Milka triple", price: 850, category: "Chocolates", description: "Triple con dulce de leche y cobertura de chocolate con leche", badge: "Novedad", stock: 40 },
      { id: 4, name: "Alfajor Havanna clasico", price: 1100, category: "Chocolates", description: "Marino bañado en chocolate negro, el autentico", stock: 30 },
      { id: 5, name: "Papas fritas Lay's 45g", price: 680, category: "Snacks", description: "Sabor clasico, sal y pimienta o BBQ", stock: 50 },
      { id: 6, name: "Chicles Trident sin azucar", price: 450, category: "Golosinas", description: "Varios sabores: menta, sandia, frutilla", stock: 70 },
      { id: 7, name: "Caramelos masticables x10", price: 350, category: "Golosinas", description: "Surtido de sabores, sin conservantes artificiales", stock: 100 },
      { id: 8, name: "Red Bull 250ml", price: 1400, category: "Bebidas", description: "Energizante original o sugar free", stock: 5 },
    ],
    suggestions: ["¿Que tienen para compartir?", "Tengo $3.000, ¿que me alcanzan?", "¿Tienen algo sin azucar?", "¿Cual es la promo?"],
  },
  distribuidora: {
    name: "Distrib. Central",
    sector: "Distribuidora",
    banner: "Mayorista de productos de limpieza y bazar",
    bannerImg: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=1400&h=500&fit=crop&auto=format",
    primaryColor: "#1E40AF",
    address: "Av. Gral. Paz 2450, GBA",
    hours: "Lun-Vie: 08:00 - 17:00",
    whatsapp: "5491100000006",
    products: [
      { id: 1, name: "Lavandina 5L x6 unid.", price: 8400, category: "Limpieza", description: "Concentrada 55g/L, pack x6, ideal comercios", stock: 15 },
      { id: 2, name: "Detergente 3L x6 unid.", price: 11200, category: "Limpieza", description: "Desengrasante premium, varios aromas, pack mayorista", stock: 10 },
      { id: 3, name: "Escoba pvc cerda dura x12", price: 14400, category: "Bazar", description: "Mango de madera 120cm, ideal para negocios", stock: 8 },
      { id: 4, name: "Trapo de piso algodón x6", price: 7200, category: "Bazar", description: "400g, alta absorcion, refuerzo en los bordes", stock: 20 },
      { id: 5, name: "Bolsas residuos 80x110 x100", price: 4800, category: "Descartables", description: "Negras, alta resistencia, rollo x100", stock: 40 },
      { id: 6, name: "Papel higienico x48 rollos", price: 18600, category: "Papel", description: "Triple hoja, 30m por rollo, blanco", badge: "Mas pedido", stock: 6 },
    ],
    suggestions: ["¿Cual es el precio por mayor?", "¿Cuanto es el pedido minimo?", "¿Hacen factura?", "¿Hacen envio a domicilio?"],
  },
};

const PROACTIVE_MESSAGES = [
  "¿Necesitas ayuda para elegir?",
  "¿Querés que te recomiende algo según tu presupuesto?",
  "¿Buscás algo en particular o querés ver lo más vendido?",
];

function ProductImage({ category, name }: { category: string; name: string }) {
  const [errored, setErrored] = useState(false);
  const url = PRODUCT_IMAGES[category];
  const gradient = CAT_COLORS[category] ?? "from-blue-400 to-blue-600";
  const icon = CATEGORY_ICONS[category] ?? "📦";

  if (!url || errored) {
    return (
      <div className={`w-full h-44 bg-gradient-to-br ${gradient} flex items-center justify-center text-4xl`}>
        {icon}
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={name}
      className="w-full h-44 object-cover"
      onError={() => setErrored(true)}
      loading="lazy"
    />
  );
}

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
      if (!open) { setProactiveVisible(true); proactiveShownRef.current = true; }
    }, 30000);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function generateReply(msg: string): string {
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
      return `Con ese presupuesto está un poco ajustado. Los más accesibles empiezan en $${minPrice.toLocaleString("es-AR")}. ¿Querés ver opciones?`;
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
      return `Te recomiendo **${recs[0]?.name}** ($${recs[0]?.price.toLocaleString("es-AR")}) — ${recs[0]?.description}. ${recs[1] ? `También está buenísimo **${recs[1].name}**.` : ""} ¿Lo agregás?`;
    }
    if (m.includes("combo") || m.includes("juntos") || m.includes("complemento")) {
      const combo = products.slice(0, 3);
      return `Podés combinar: ${combo.map((p) => `**${p.name}**`).join(", ")}. ¡Una gran combinación! ¿Armamos el pedido?`;
    }
    if (m.includes("vendido") || m.includes("popular") || m.includes("pedido") || m.includes("estrella")) {
      const star = products.find((p) => p.badge) ?? products[0];
      return `El más pedido es **${star.name}** ($${star.price.toLocaleString("es-AR")}). ${star.description}. ¡Lo eligen la mayoría!`;
    }
    if (m.includes("principiante") || m.includes("empezar") || m.includes("inicio") || m.includes("primera")) {
      const starter = [...products].sort((a, b) => a.price - b.price).slice(0, 2);
      return `Para empezar, te recomiendo **${starter[0]?.name}** ($${starter[0]?.price.toLocaleString("es-AR")}). Es ideal para quienes están comenzando. ¿Querés más info?`;
    }
    if (m.includes("vegano") || m.includes("vegetariano") || m.includes("sin tacc") || m.includes("gluten")) {
      const veg = products.filter((p) => p.description.toLowerCase().includes("organico") || p.name.toLowerCase().includes("veggie"));
      if (veg.length > 0) return `Tenemos opciones para vos: ${veg.map((p) => `**${p.name}** ($${p.price.toLocaleString("es-AR")})`).join(", ")}. ¿Querés más detalles?`;
      return `Consultanos por opciones especiales, siempre tratamos de tener algo para cada necesidad.`;
    }
    if (m.includes("envío") || m.includes("delivery") || m.includes("llega") || m.includes("mandan")) {
      return `Sí, hacemos envíos y también podés pasar a retirar sin costo. ¿Querés que te calcule el envío según tu zona?`;
    }
    if (m.includes("hora") || m.includes("abierto") || m.includes("horario")) {
      return `Nuestros horarios son: Lunes a Domingo de 11:00 a 23:00. ¿En qué más te puedo ayudar?`;
    }
    if (m.includes("pago") || m.includes("cobro") || m.includes("mercado pago") || m.includes("transferencia")) {
      return `Aceptamos efectivo, transferencia bancaria y Mercado Pago. ¿Querés armar tu pedido?`;
    }
    const words = m.split(/\s+/).filter((w) => w.length > 3);
    const match = products.find((p) => words.some((w) => p.name.toLowerCase().includes(w) || p.category.toLowerCase().includes(w)));
    if (match) return `**${match.name}** cuesta $${match.price.toLocaleString("es-AR")}. ${match.description}. ¿Lo querés agregar al carrito?`;
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
      const reply = generateReply(msg);
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
            className="fixed bottom-24 right-6 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 max-w-xs"
          >
            <button onClick={() => setProactiveVisible(false)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-700">
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600 mb-1">IA Vendedora</p>
                <p className="text-sm text-slate-700">{proactiveMsg}</p>
                <button onClick={() => { setProactiveVisible(false); setOpen(true); }} className="mt-2 text-xs text-blue-600 font-semibold hover:underline">
                  Sí, necesito ayuda
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => { setOpen(true); setProactiveVisible(false); }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all z-50"
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
            className="fixed bottom-24 right-6 w-[340px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            style={{ height: 480 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-blue-600">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">IA Vendedora</p>
                  <p className="text-xs text-blue-100">{name}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm"
                  }`}>
                    {m.content.replace(/\*\*(.*?)\*\*/g, "$1")}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {showSuggestions && (
              <div className="px-4 pt-2 pb-1 bg-white flex flex-wrap gap-1.5">
                {suggestions.slice(0, 3).map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors text-left"
                  >
                    {s.slice(0, 32)}{s.length > 32 ? "..." : ""}
                  </button>
                ))}
              </div>
            )}

            <div className="p-3 border-t border-slate-100 bg-white flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Consultá lo que quieras..."
                className="text-sm h-9 bg-slate-50 border-slate-200"
              />
              <Button size="icon" onClick={() => send()} className="bg-blue-600 text-white hover:bg-blue-700 shrink-0 h-9 w-9">
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
  const [search, setSearch] = useState("");
  const [bannerErr, setBannerErr] = useState(false);

  if (!data) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Demo no encontrada</h1>
          <Link href="/demos"><Button>Ver todas las demos</Button></Link>
        </div>
      </div>
    );
  }

  const categories = ["Todos", ...Array.from(new Set(data.products.map((p) => p.category)))];
  const filtered = data.products
    .filter((p) => activeCategory === "Todos" || p.category === activeCategory)
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

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
  const cartItems = Object.entries(cart).map(([id, qty]) => ({ product: data.products.find((p) => p.id === Number(id))!, qty })).filter((i) => i.product);

  const waMsg = cartItems.length > 0
    ? encodeURIComponent(`Hola! Quiero hacer un pedido:\n\n${cartItems.map((i) => `• ${i.product.name} x${i.qty} = $${(i.product.price * i.qty).toLocaleString("es-AR")}`).join("\n")}\n\nTotal: $${cartTotal.toLocaleString("es-AR")}`)
    : encodeURIComponent(`Hola! Me comunico desde la tienda online de ${data.name}`);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* BANNER */}
      <div className="relative pt-16 h-64 sm:h-72 overflow-hidden">
        {!bannerErr ? (
          <img
            src={data.bannerImg}
            alt={data.name}
            className="w-full h-full object-cover"
            onError={() => setBannerErr(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-violet-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-5xl mx-auto flex items-end gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-xl shrink-0 overflow-hidden">
              <span className="text-3xl">{CATEGORY_ICONS[data.products[0]?.category] ?? "🏪"}</span>
            </div>
            <div>
              <Badge className="bg-white/20 text-white border-white/30 mb-1 backdrop-blur-sm">{data.sector}</Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{data.name}</h1>
              <p className="text-white/80 text-sm mt-0.5">{data.banner}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-20 left-4">
          <Link href="/demos">
            <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/20 backdrop-blur-sm">
              <ArrowLeft className="h-4 w-4" /> Volver
            </Button>
          </Link>
        </div>
      </div>

      {/* INFO BAR */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {data.address}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {data.hours}
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span className="font-medium">4.8</span>
            <span className="text-slate-400">(127 reseñas)</span>
          </div>
          <a
            href={`https://wa.me/${data.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-emerald-600 font-medium hover:text-emerald-700 ml-auto"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto px-4 pb-32 pt-6">
        {/* Search + Categories */}
        <div className="mb-5 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 placeholder-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {cat !== "Todos" && `${CATEGORY_ICONS[cat] ?? ""} `}{cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Search className="h-10 w-10 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No encontramos productos para "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <div className="relative overflow-hidden">
                  <ProductImage category={p.category} name={p.name} />
                  {p.badge && (
                    <span className="absolute top-3 left-3 text-xs bg-blue-600 text-white px-2.5 py-1 rounded-full font-semibold shadow">
                      {p.badge}
                    </span>
                  )}
                  {p.stock !== undefined && p.stock <= 5 && (
                    <span className="absolute top-3 right-3 text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full font-medium">
                      ¡Quedan {p.stock}!
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-slate-400 mb-1">{p.category}</p>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-blue-600 text-lg">${p.price.toLocaleString("es-AR")}</span>
                    {cart[p.id] ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(p.id)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-sm font-bold w-5 text-center">{cart[p.id]}</span>
                        <button onClick={() => addToCart(p.id)} className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors">
                          <Plus className="h-3.5 w-3.5 text-white" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(p.id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Agregar
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Reviews section */}
        <div className="mt-12 border-t border-slate-200 pt-10">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Reseñas de clientes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: "Marcos G.", text: "Excelente calidad y envío rápido. Lo volvería a pedir sin dudar.", stars: 5 },
              { name: "Valentina R.", text: "El mejor del barrio, siempre con stock y muy amables.", stars: 5 },
              { name: "Diego M.", text: "Pedí por WhatsApp y llegó en 30 minutos. Muy recomendable.", stars: 4 },
            ].map((r) => (
              <div key={r.name} className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">"{r.text}"</p>
                <p className="text-xs font-semibold text-slate-900">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CART BOTTOM BAR */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl"
          >
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-white">{cartCount}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total del pedido</p>
                  <p className="font-extrabold text-blue-600 text-lg">${cartTotal.toLocaleString("es-AR")}</p>
                </div>
              </div>
              <a
                href={`https://wa.me/${data.whatsapp}?text=${waMsg}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-colors shadow-lg"
              >
                <MessageCircle className="h-4 w-4" />
                Pedir por WhatsApp
              </a>
              <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 font-semibold">
                Checkout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp float */}
      <a
        href={`https://wa.me/${data.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-20 right-20 w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-all z-40"
        title="Consultar por WhatsApp"
      >
        <MessageCircle className="h-5 w-5" />
      </a>

      <ChatWidget sector={data.sector} name={data.name} products={data.products} suggestions={data.suggestions} />
    </div>
  );
}
