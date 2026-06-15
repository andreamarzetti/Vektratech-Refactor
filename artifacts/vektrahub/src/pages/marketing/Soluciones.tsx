import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Link } from "wouter";
import { ArrowRight, Utensils, ShoppingBag, Leaf, Wrench, Shirt, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const SECTORES = [
  {
    id: "restaurantes",
    icon: Utensils,
    title: "Restaurantes",
    desc: "Gestioná mesas, pedidos y delivery desde un solo lugar. Tu menú digital siempre actualizado, con asistente IA para recomendar platos.",
    features: ["Menú digital con QR", "Gestión de pedidos por mesa", "Delivery integrado", "IA para recomendaciones"],
    demo: "/demos/restaurante",
  },
  {
    id: "kioscos",
    icon: ShoppingBag,
    title: "Kioscos",
    desc: "Catálogo siempre actualizado con precios y stock en tiempo real. Tus clientes pueden pedir por WhatsApp con tu link personalizado.",
    features: ["Catálogo con stock en tiempo real", "Link de pedido por WhatsApp", "Control de inventario", "Cobros digitales"],
    demo: "/demos/kiosco",
  },
  {
    id: "dieteticas",
    icon: Leaf,
    title: "Dietéticas",
    desc: "Mostrá tu catálogo de productos naturales, proteínas y suplementos con información nutricional. La IA ayuda a los clientes a elegir.",
    features: ["Catálogo con info nutricional", "Filtros por categoría", "Asistente IA especializado", "Gestión de stock"],
    demo: "/demos/dietetica",
  },
  {
    id: "ferreterias",
    icon: Wrench,
    title: "Ferreterías",
    desc: "Miles de productos organizados por categoría. La IA arma presupuestos y sugiere productos complementarios automáticamente.",
    features: ["Catálogo de miles de SKUs", "Búsqueda avanzada", "Armado de presupuestos", "Gestión de proveedores"],
    demo: "/demos/ferreteria",
  },
  {
    id: "ropa",
    icon: Shirt,
    title: "Tiendas de ropa",
    desc: "Mostrá tus colecciones con fotos profesionales. Gestión de talles, colores y stock por variante. Ventas online y presenciales.",
    features: ["Galería de productos", "Gestión de talles y colores", "Carrito de compras", "Integración con redes"],
    demo: "/demos/ropa",
  },
  {
    id: "distribuidoras",
    icon: Truck,
    title: "Distribuidoras",
    desc: "Gestioná listas de precios por cliente, pedidos mayoristas y logística de entrega. CRM pensado para la venta B2B.",
    features: ["Listas de precios por cliente", "Pedidos mayoristas", "CRM B2B", "Gestión de rutas"],
    demo: "/demos/ferreteria",
  },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function Soluciones() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Soluciones por rubro
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              VektraHub se adapta a las necesidades específicas de cada tipo de negocio.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SECTORES.map((s, i) => (
              <motion.div
                key={s.id}
                id={s.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{s.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                  </div>
                </div>
                <ul className="space-y-1.5 mb-6">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={s.demo}>
                  <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
                    Ver demo
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
