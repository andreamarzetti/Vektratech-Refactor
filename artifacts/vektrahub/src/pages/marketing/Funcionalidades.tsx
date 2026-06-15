import { motion } from "framer-motion";
import { ShoppingCart, Package, Users, Brain, BarChart3, CreditCard } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

const FEATURES = [
  {
    icon: ShoppingCart,
    title: "Gestión de pedidos",
    desc: "Recibí pedidos en tiempo real desde tu catálogo online. Gestioná estados: pendiente, en preparación, listo, entregado. Notificaciones automáticas.",
    items: ["Panel de pedidos en tiempo real", "Estados personalizables", "Historial completo", "Notificaciones al cliente"],
  },
  {
    icon: Package,
    title: "Catálogo digital",
    desc: "Tu tienda online disponible las 24hs. Subí productos con fotos, precios y categorías. Link personalizado para compartir por WhatsApp o redes.",
    items: ["Carga masiva de productos", "Categorías y filtros", "Fotos de alta calidad", "Link personalizado de negocio"],
  },
  {
    icon: Users,
    title: "CRM de clientes",
    desc: "Conocé a tus clientes: historial de compras, frecuencia de visitas, monto gastado. Tomá decisiones basadas en datos reales.",
    items: ["Base de clientes centralizada", "Historial de pedidos por cliente", "Segmentación", "Exportación de datos"],
  },
  {
    icon: Brain,
    title: "Asistente IA",
    desc: "Tu negocio con un empleado virtual que responde consultas de clientes, recomienda productos y ayuda a cerrar ventas las 24hs del día.",
    items: ["Responde consultas automáticamente", "Recomienda productos personalizados", "Se conecta a tu catálogo", "Disponible 24/7"],
  },
  {
    icon: BarChart3,
    title: "Reportes y analytics",
    desc: "Métricas claras de tu negocio: ventas por período, productos más pedidos, clientes más frecuentes. Tomá mejores decisiones.",
    items: ["Dashboard con métricas clave", "Ventas por período", "Productos top", "Crecimiento mes a mes"],
  },
  {
    icon: CreditCard,
    title: "Cobros digitales",
    desc: "Aceptá pagos por transferencia, Mercado Pago u otros medios directamente desde tu plataforma. Sin comisiones adicionales de VektraHub.",
    items: ["Link de pago integrado", "Transferencias bancarias", "Mercado Pago", "Registro automático de cobros"],
  },
];

export default function Funcionalidades() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Funcionalidades</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Todo lo que necesitás para digitalizar y hacer crecer tu negocio.
            </p>
          </motion.div>

          <div className="space-y-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`bg-card border border-border rounded-2xl p-8 flex flex-col lg:flex-row gap-8 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className="lg:w-1/2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <f.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">{f.title}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">{f.desc}</p>
                  <ul className="space-y-2">
                    {f.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:w-1/2 bg-muted/20 rounded-xl flex items-center justify-center min-h-40 border border-border/50">
                  <div className="text-center text-muted-foreground p-8">
                    <f.icon className="h-16 w-16 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Captura de pantalla próximamente</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
