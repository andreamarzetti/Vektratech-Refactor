import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

export default function CasosDeExito() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Casos de éxito</h1>
            <p className="text-muted-foreground text-lg">Negocios que crecieron con VektraHub.</p>
          </motion.div>

          {/* Placeholder cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {[
              { sector: "Restaurante", name: "La Parrilla del Centro", city: "Córdoba", metric: "+45% en ventas", story: "Implementaron el catálogo digital y el asistente IA. Ahora reciben pedidos online sin atender el teléfono." },
              { sector: "Ferretería", name: "FerreMax", city: "Rosario", metric: "+30% clientes nuevos", story: "Con el CRM pueden hacer seguimiento de sus clientes B2B y anticipar necesidades de stock." },
              { sector: "Dietética", name: "Sabores Naturales", city: "Buenos Aires", metric: "+60% ticket promedio", story: "El asistente IA recomienda productos complementarios. El ticket promedio creció significativamente." },
              { sector: "Kiosco", name: "Kiosco Don Jorge", city: "Mendoza", metric: "3x más pedidos/día", story: "Con el link de pedido por WhatsApp, triplicaron los pedidos diarios sin cambiar nada más." },
            ].map((case_, i) => (
              <motion.div
                key={case_.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">{case_.sector}</span>
                    <p className="text-xs text-muted-foreground mt-1">{case_.city}</p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{case_.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{case_.story}</p>
                <div className="bg-primary/10 rounded-lg px-4 py-3">
                  <span className="text-primary font-bold text-lg">{case_.metric}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center bg-card border border-border rounded-2xl p-12"
          >
            <h2 className="text-2xl font-bold mb-3">¿Querés ser el próximo caso de éxito?</h2>
            <p className="text-muted-foreground mb-6">Empezá hoy y mostrá resultados en menos de 30 días.</p>
            <Link href="/sign-up">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold">
                Empezar gratis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
