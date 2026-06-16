import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, ShoppingCart, Brain, BarChart3, Users, Globe, MessageCircle,
  CreditCard, Star, Check, Zap, TrendingUp, Package, Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

const FEATURES = [
  { icon: ShoppingCart, title: "Tienda online en minutos", desc: "Catálogo profesional con fotos, precios y stock. Tus clientes compran desde el celular sin instalar nada.", color: "bg-blue-50 text-blue-600" },
  { icon: Brain, title: "IA Vendedora 24/7", desc: "Un asistente inteligente que responde preguntas, recomienda productos y ayuda a cerrar ventas automáticamente.", color: "bg-violet-50 text-violet-600" },
  { icon: ShoppingCart, title: "Gestión de pedidos", desc: "Recibí pedidos en tiempo real, gestioná estados y notificá a tus clientes por WhatsApp con un click.", color: "bg-emerald-50 text-emerald-600" },
  { icon: Users, title: "CRM completo", desc: "Historial de compras, clientes frecuentes e inactivos. Conocé a tus clientes mejor que nadie.", color: "bg-amber-50 text-amber-600" },
  { icon: BarChart3, title: "Analytics en tiempo real", desc: "Facturación, ticket promedio, productos más vendidos y tendencias. Todo en un dashboard moderno.", color: "bg-cyan-50 text-cyan-600" },
  { icon: CreditCard, title: "Cobros digitales", desc: "Mercado Pago, transferencia, efectivo y más. Cobrá como quieras con comprobante automático.", color: "bg-rose-50 text-rose-600" },
];

const STATS = [
  { value: "+500", label: "Negocios digitalizados" },
  { value: "+120k", label: "Pedidos procesados" },
  { value: "99.9%", label: "Uptime garantizado" },
  { value: "4.9★", label: "Calificación promedio" },
];

const TESTIMONIALS = [
  {
    name: "Carla Méndez",
    role: "Dueña, NutriVida Dietética",
    text: "Pasé de anotar pedidos en papel a recibir todo por WhatsApp automáticamente. La IA me ahorra 3 horas al día.",
    stars: 5,
  },
  {
    name: "Martín Rodríguez",
    role: "Propietario, FerreMax",
    text: "Mis clientes pueden ver el stock en tiempo real y hacer pedidos solos. Las ventas subieron 40% en el primer mes.",
    stars: 5,
  },
  {
    name: "Sofía García",
    role: "Fundadora, Urban Style",
    text: "La tienda quedó re profesional. Mis clientes dicen que parece Tiendanube pero más fácil. Lo recomiendo a todos.",
    stars: 5,
  },
];

const BRANDS = [
  "Burger House", "NutriLife Market", "FerreMax", "Urban Style", "Kiosco 24", "Distrib. Central",
  "La Dietética", "Todo Hogar", "Moda Express", "El Ferretero",
];

const STEPS = [
  { num: "01", title: "Creá tu cuenta gratis", desc: "Registrate en 30 segundos. Sin tarjeta de crédito. Tu tienda queda lista al instante con productos de ejemplo." },
  { num: "02", title: "Personalizá tu tienda", desc: "Subí tus productos, configurá precios, métodos de pago y tu número de WhatsApp para recibir pedidos." },
  { num: "03", title: "Empezá a vender", desc: "Compartí el link de tu tienda. Los pedidos llegan solos y la IA atiende consultas las 24hs." },
];

const SECTORS = [
  { label: "Restaurantes", href: "/demos/restaurante", icon: "🍔" },
  { label: "Dietéticas", href: "/demos/dietetica", icon: "🥗" },
  { label: "Ferreterías", href: "/demos/ferreteria", icon: "🔧" },
  { label: "Indumentaria", href: "/demos/ropa", icon: "👕" },
  { label: "Kioscos", href: "/demos/kiosco", icon: "🍭" },
  { label: "Distribuidoras", href: "/demos/distribuidora", icon: "📦" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(37,99,235,0.08),transparent)]" />
        <div className="absolute top-24 left-1/4 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute top-32 right-1/4 w-56 h-56 bg-violet-100/30 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.45 }}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-7">
              <Zap className="h-3 w-3" />
              La plataforma SaaS para negocios argentinos
            </span>
          </motion.div>

          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.08 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-slate-900 mb-6"
          >
            Vendé más con tu propia<br />
            <span className="text-blue-600">tienda online</span> impulsada por IA
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.16 }}
            className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Creá tu tienda en minutos, recibí pedidos, cobrá online y automatizá
            la atención con inteligencia artificial. Sin complicaciones.
          </motion.p>

          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <Link href="/sign-up">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 gap-2 font-bold px-8 shadow-lg shadow-blue-200 text-base">
                Probar gratis 14 días
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demos">
              <Button size="lg" variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 text-base">
                Ver demos
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xs text-slate-400 mt-4"
          >
            Sin tarjeta de crédito. Sin contrato. Cancelá cuando quieras.
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-3xl mx-auto mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
              <div className="text-2xl font-extrabold text-blue-600 mb-1">{s.value}</div>
              <div className="text-xs text-slate-500 font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* LOGOS / SOCIAL PROOF */}
      <section className="py-14 px-4 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm text-slate-400 font-medium mb-8 uppercase tracking-widest">
            Con la confianza de +500 negocios argentinos
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {BRANDS.map((b) => (
              <span key={b} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 font-medium shadow-sm">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTORS */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-12"
          >
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Soluciones por rubro</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Para cada tipo de negocio
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Plantillas y demos listas para tu industria. Empezás con un catálogo de productos real desde el día uno.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SECTORS.map((s, i) => (
              <motion.div
                key={s.label}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: i * 0.06 }}
              >
                <Link href={s.href}>
                  <div className="group bg-white border border-slate-200 rounded-2xl p-5 text-center hover:border-blue-300 hover:shadow-md hover:shadow-blue-50 transition-all cursor-pointer">
                    <div className="text-3xl mb-2">{s.icon}</div>
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{s.label}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14"
          >
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Funcionalidades</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Todo lo que tu negocio necesita
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Una plataforma completa para digitalizar operaciones, atender clientes y multiplicar tus ventas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: i * 0.08 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14"
          >
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Proceso simple</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Tu tienda lista en 3 pasos
            </h2>
          </motion.div>

          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6 bg-slate-50 border border-slate-200 rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                  <span className="text-white font-black text-sm">{step.num}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14"
          >
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Testimonios</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(255,255,255,0.05),transparent)]" />
        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <TrendingUp className="h-10 w-10 text-blue-200 mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Listo para vender más?
            </h2>
            <p className="text-blue-100 text-lg mb-10 leading-relaxed">
              Unite a los +500 negocios que ya digitalizaron sus ventas con VektraHub.
              Sin tarjeta. Sin contrato. Cancelá cuando quieras.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 gap-2 font-bold px-8 shadow-lg">
                  Crear mi tienda gratis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/precios">
                <Button size="lg" variant="outline" className="border-blue-400 text-white hover:bg-blue-500 hover:text-white">
                  Ver planes y precios
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8">
              {["14 días gratis", "Sin tarjeta", "Soporte incluido"].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-blue-100 text-sm">
                  <Check className="h-3.5 w-3.5" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-1.5 mb-4">
                <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-black text-xs">V</span>
                </div>
                <span className="font-bold text-white text-base">VektraHub</span>
              </div>
              <p className="text-sm leading-relaxed">La plataforma SaaS para digitalizar negocios argentinos con IA.</p>
            </div>
            <div>
              <p className="font-semibold text-white text-sm mb-4">Producto</p>
              <div className="space-y-2 text-sm">
                <Link href="/funcionalidades" className="block hover:text-white transition-colors">Funcionalidades</Link>
                <Link href="/precios" className="block hover:text-white transition-colors">Precios</Link>
                <Link href="/plantillas" className="block hover:text-white transition-colors">Plantillas</Link>
                <Link href="/demos" className="block hover:text-white transition-colors">Demos</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white text-sm mb-4">Empresa</p>
              <div className="space-y-2 text-sm">
                <Link href="/nosotros" className="block hover:text-white transition-colors">Nosotros</Link>
                <Link href="/casos-de-exito" className="block hover:text-white transition-colors">Casos de éxito</Link>
                <Link href="/contacto" className="block hover:text-white transition-colors">Contacto</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white text-sm mb-4">Soporte</p>
              <div className="space-y-2 text-sm">
                <Link href="/faq" className="block hover:text-white transition-colors">FAQ</Link>
                <a href="https://wa.me/5491100000000" target="_blank" rel="noreferrer" className="block hover:text-white transition-colors">WhatsApp</a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">© 2025 Vektra Tech. Todos los derechos reservados.</p>
            <p className="text-xs">Hecho con en Buenos Aires, Argentina</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
