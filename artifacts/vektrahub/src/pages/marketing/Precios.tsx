import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "Starter",
    price: "$ 25.000",
    period: "/mes",
    desc: "Para negocios que dan sus primeros pasos digitales.",
    highlight: false,
    features: {
      included: [
        "Catálogo digital hasta 100 productos",
        "Gestión de pedidos",
        "Link de pedido personalizado",
        "Reportes básicos",
        "Soporte por email",
        "1 usuario administrador",
      ],
      excluded: [
        "Asistente IA",
        "CRM de clientes",
        "Reportes avanzados",
        "Integraciones externas",
        "Multi-usuario",
      ],
    },
    cta: "Empezar con Starter",
    href: "/sign-up",
  },
  {
    name: "Pro",
    price: "$ 49.950",
    period: "/mes",
    desc: "Para negocios que quieren crecer en serio con IA y datos.",
    highlight: true,
    features: {
      included: [
        "Catálogo ilimitado de productos",
        "Gestión avanzada de pedidos",
        "Link de pedido personalizado",
        "Asistente IA integrado",
        "CRM completo de clientes",
        "Reportes avanzados y analítica",
        "Integraciones con WhatsApp y redes",
        "Hasta 5 usuarios",
        "Soporte prioritario",
        "Onboarding personalizado",
      ],
      excluded: [],
    },
    cta: "Empezar con Pro",
    href: "/sign-up",
  },
];

const FAQS = [
  { q: "¿Hay período de prueba?", a: "Sí, todos los planes incluyen 14 días de prueba gratuita sin tarjeta de crédito." },
  { q: "¿Puedo cambiar de plan?", a: "Podés pasar de Starter a Pro en cualquier momento. El cambio es inmediato y se proratea el costo." },
  { q: "¿Cómo es la facturación?", a: "La suscripción se cobra mensualmente. Podés cancelar en cualquier momento sin penalidades." },
  { q: "¿Los precios incluyen IVA?", a: "Los precios mostrados no incluyen IVA. Se agrega en la factura según la condición impositiva." },
];

export default function Precios() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Planes simples y transparentes</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Sin costos ocultos. Cancelá cuando quieras.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-card rounded-2xl p-8 border ${plan.highlight ? "border-primary shadow-lg shadow-primary/10" : "border-border"}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">Más popular</span>
                  </div>
                )}
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <Link href={plan.href}>
                  <Button
                    className={`w-full mb-6 gap-2 ${plan.highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <div className="space-y-2.5">
                  {plan.features.included.map((f) => (
                    <div key={f} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </div>
                  ))}
                  {plan.features.excluded.map((f) => (
                    <div key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <X className="h-4 w-4 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-center mb-8">Preguntas frecuentes sobre precios</h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {FAQS.map((faq) => (
                <div key={faq.q} className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
