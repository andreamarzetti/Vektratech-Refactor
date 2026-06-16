import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, ArrowRight, Zap, Shield, Headphones } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const PLANS = [
  {
    name: "Starter",
    desc: "Para negocios que dan sus primeros pasos digitales.",
    monthlyPrice: 24990,
    annualPrice: 19992,
    highlight: false,
    badge: null,
    color: "border-slate-200",
    features: [
      "Catálogo hasta 100 productos",
      "Tienda online con URL personalizada",
      "Gestión de pedidos",
      "Cupones de descuento",
      "Checkout con WhatsApp",
      "1 usuario administrador",
      "Soporte por email",
      "Reportes básicos",
    ],
    excluded: [
      "Asistente IA",
      "CRM de clientes",
      "Mercado Pago integrado",
      "Reportes avanzados",
      "Multi-usuario",
      "Dominios personalizados",
    ],
    cta: "Empezar con Starter",
    href: "/sign-up",
  },
  {
    name: "Pro",
    desc: "Para negocios que quieren crecer con IA y datos reales.",
    monthlyPrice: 49990,
    annualPrice: 39992,
    highlight: true,
    badge: "Más popular",
    color: "border-blue-500",
    features: [
      "Catálogo ilimitado de productos",
      "Tienda online con URL personalizada",
      "Gestión avanzada de pedidos",
      "Cupones y promociones",
      "Checkout completo (MP, transferencia, efectivo)",
      "Asistente IA integrado 24/7",
      "CRM completo de clientes",
      "Reportes avanzados y analítica",
      "Mercado Pago Connect",
      "Notificaciones WhatsApp automáticas",
      "Hasta 5 usuarios",
      "Soporte prioritario",
      "Onboarding personalizado",
    ],
    excluded: [],
    cta: "Empezar con Pro",
    href: "/sign-up",
  },
  {
    name: "Enterprise",
    desc: "Para cadenas, franquicias y distribuidoras con operación grande.",
    monthlyPrice: 89990,
    annualPrice: 71992,
    highlight: false,
    badge: null,
    color: "border-slate-200",
    features: [
      "Todo lo de Pro",
      "Sucursales múltiples",
      "Dominio propio (mitienda.com)",
      "API access completa",
      "SLA 99.9% garantizado",
      "Manager de cuenta dedicado",
      "Capacitación del equipo",
      "Integraciones custom",
      "Usuarios ilimitados",
      "Reportes personalizados",
      "Backups diarios",
      "Soporte 24/7 prioritario",
    ],
    excluded: [],
    cta: "Hablar con ventas",
    href: "/contacto",
  },
];

const FAQS = [
  { q: "¿Hay período de prueba?", a: "Sí, todos los planes incluyen 14 días de prueba gratuita sin tarjeta de crédito." },
  { q: "¿Puedo cambiar de plan?", a: "Podés pasar de un plan a otro en cualquier momento. El cambio es inmediato y se proratea el costo." },
  { q: "¿Cómo funciona la facturación anual?", a: "Con el plan anual ahorrás 20% y se factura un pago único por 12 meses. Podés cancelar con 30 días de aviso." },
  { q: "¿Los precios incluyen IVA?", a: "Los precios mostrados no incluyen IVA. Se agrega en la factura según tu condición impositiva." },
  { q: "¿Qué pasa cuando vence el trial?", a: "Recibís un aviso 3 días antes. Si no elegís un plan, tu tienda pasa a modo lectura (no toma nuevos pedidos)." },
  { q: "¿Puedo cancelar en cualquier momento?", a: "Sí. Sin penalidades ni letras chicas. Cancelás desde el panel y listo." },
];

function formatPrice(n: number) {
  return n.toLocaleString("es-AR");
}

export default function Precios() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Precios</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Planes simples y transparentes
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto mb-8">
              Sin costos ocultos. Sin letras chicas. Cancelá cuando quieras.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-3 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${!annual ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}
              >
                Mensual
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${annual ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}
              >
                Anual
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  -20%
                </span>
              </button>
            </div>
            {annual && (
              <p className="text-sm text-emerald-600 font-medium mt-3">
                Con plan anual ahorrás hasta ${formatPrice(89990 * 12 * 0.2)} por año
              </p>
            )}
          </motion.div>

          {/* Plans grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-white rounded-2xl border-2 p-7 flex flex-col ${plan.highlight ? "border-blue-500 shadow-xl shadow-blue-100" : "border-slate-200"}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
                      Mas popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xl font-extrabold text-slate-900">{plan.name}</h2>
                    {plan.badge && !plan.highlight && (
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{plan.badge}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mb-5">{plan.desc}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-slate-900">
                      ${formatPrice(annual ? plan.annualPrice : plan.monthlyPrice)}
                    </span>
                    <span className="text-slate-400 text-sm">/mes</span>
                  </div>
                  {annual && (
                    <p className="text-xs text-slate-400 mt-1">
                      Facturado como ${formatPrice((annual ? plan.annualPrice : plan.monthlyPrice) * 12)}/año
                    </p>
                  )}
                </div>

                <Link href={plan.href} className="mb-6">
                  <Button
                    className={`w-full gap-2 font-semibold ${plan.highlight ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200" : "border-slate-200 text-slate-800 hover:bg-slate-50"}`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <div className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={`h-4 w-4 shrink-0 mt-0.5 ${plan.highlight ? "text-blue-600" : "text-emerald-500"}`} />
                      <span className="text-slate-700">{f}</span>
                    </div>
                  ))}
                  {plan.excluded.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm">
                      <X className="h-4 w-4 shrink-0 mt-0.5 text-slate-300" />
                      <span className="text-slate-400">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
            {[
              { icon: Zap, title: "Setup instantáneo", desc: "Tu tienda queda lista en minutos, no en días." },
              { icon: Shield, title: "Seguridad garantizada", desc: "Datos encriptados y backups automáticos diarios." },
              { icon: Headphones, title: "Soporte real", desc: "Personas reales que responden rápido, no bots." },
            ].map((b) => (
              <div key={b.title} className="flex items-start gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <b.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm mb-1">{b.title}</p>
                  <p className="text-xs text-slate-500">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* FAQs */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">Preguntas frecuentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {FAQS.map((faq) => (
                <div key={faq.q} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-900 mb-2 text-sm">{faq.q}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Final CTA */}
          <div className="mt-16 text-center bg-blue-600 rounded-3xl p-12">
            <h2 className="text-2xl font-extrabold text-white mb-3">
              Empezá gratis hoy
            </h2>
            <p className="text-blue-100 mb-7 max-w-md mx-auto">
              14 días de prueba completa. Sin tarjeta de crédito. Sin compromisos.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8">
                Crear mi tienda gratis
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
