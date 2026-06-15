import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

const DEMOS = [
  { href: "/demos/restaurante", label: "Demo Restaurante", desc: "Menú digital, pedidos y asistente IA para un restaurante.", color: "from-orange-500/20 to-transparent" },
  { href: "/demos/ropa", label: "Demo Tienda de Ropa", desc: "Catálogo de ropa con talles, colores y carrito de compras.", color: "from-pink-500/20 to-transparent" },
  { href: "/demos/dietetica", label: "Demo Dietética", desc: "Suplementos y productos naturales con asistente IA nutricional.", color: "from-green-500/20 to-transparent" },
  { href: "/demos/ferreteria", label: "Demo Ferretería", desc: "Catálogo masivo de herramientas y materiales con búsqueda avanzada.", color: "from-yellow-500/20 to-transparent" },
  { href: "/demos/kiosco", label: "Demo Kiosco", desc: "Catálogo rápido de kiosco con link de pedido por WhatsApp.", color: "from-blue-500/20 to-transparent" },
];

export default function Demos() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Demos por rubro</h1>
            <p className="text-muted-foreground text-lg">
              Probá la experiencia que tendrían los clientes de tu negocio.
            </p>
          </motion.div>

          <div className="space-y-4">
            {DEMOS.map((d, i) => (
              <motion.div
                key={d.href}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={d.href}>
                  <div className={`relative bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-all cursor-pointer group overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${d.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className="relative flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold text-lg mb-1">{d.label}</h2>
                        <p className="text-sm text-muted-foreground">{d.desc}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
