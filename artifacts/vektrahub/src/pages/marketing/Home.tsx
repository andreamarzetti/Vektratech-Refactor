import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Zap, BarChart3, Brain, ShoppingCart, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";

const FEATURES = [
  { icon: ShoppingCart, title: "Gestión de pedidos", desc: "Recibí y gestioná pedidos en tiempo real desde cualquier dispositivo." },
  { icon: Globe, title: "Catálogo digital", desc: "Tu negocio en internet con un catálogo profesional siempre actualizado." },
  { icon: Brain, title: "Asistente IA", desc: "Un asistente inteligente que recomienda productos y ayuda a cerrar ventas." },
  { icon: Users, title: "CRM integrado", desc: "Conocé a tus clientes, historial de compras y tendencias de comportamiento." },
  { icon: BarChart3, title: "Reportes en tiempo real", desc: "Métricas claras de ventas, productos más pedidos y rendimiento del negocio." },
  { icon: Zap, title: "Cobros digitales", desc: "Aceptá transferencias y links de pago integrados directamente en la plataforma." },
];

const SECTORS = [
  { label: "Restaurantes", href: "/soluciones#restaurantes" },
  { label: "Kioscos", href: "/soluciones#kioscos" },
  { label: "Dietéticas", href: "/soluciones#dieteticas" },
  { label: "Ferreterías", href: "/soluciones#ferreterias" },
  { label: "Tiendas de ropa", href: "/soluciones#ropa" },
  { label: "Distribuidoras", href: "/soluciones#distribuidoras" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(168_100%_42%/0.12),transparent)]" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
              <Zap className="h-3 w-3" />
              Plataforma SaaS para negocios argentinos
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6"
          >
            Tu negocio en
            <span className="text-primary block">la era digital</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            VektraHub digitaliza tu negocio con catálogo online, gestión de pedidos,
            CRM e inteligencia artificial. Vendé más sin complicarte.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link href="/sign-up">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold px-8">
                Empezar gratis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demos">
              <Button size="lg" variant="outline" className="border-border hover:bg-muted/50 gap-2">
                Ver demos
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-3xl mx-auto mt-16 grid grid-cols-3 gap-4"
        >
          {[
            { label: "Negocios digitalizados", value: "+500" },
            { label: "Pedidos procesados", value: "+120k" },
            { label: "Uptime garantizado", value: "99.9%" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Sectors */}
      <section className="py-16 px-4 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm text-muted-foreground mb-6">Soluciones para cada rubro</p>
          <div className="flex flex-wrap justify-center gap-3">
            {SECTORS.map((s) => (
              <Link key={s.label} href={s.href}>
                <span className="px-4 py-2 bg-card border border-border rounded-full text-sm text-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer">
                  {s.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Todo lo que tu negocio necesita
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Una plataforma completa para digitalizar operaciones, atender clientes y aumentar ventas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center bg-card border border-border rounded-2xl p-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl font-bold mb-4">
              Listo para digitalizar tu negocio?
            </h2>
            <p className="text-muted-foreground mb-8">
              Empezá gratis y ves los resultados desde el primer día.
              Sin tarjeta de crédito requerida.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold px-8">
                  Crear mi cuenta gratis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/precios">
                <Button size="lg" variant="outline">Ver planes</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/logo.svg" alt="VektraHub" className="h-7 w-auto" />
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link href="/soluciones" className="hover:text-foreground transition-colors">Soluciones</Link>
            <Link href="/precios" className="hover:text-foreground transition-colors">Precios</Link>
            <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <Link href="/contacto" className="hover:text-foreground transition-colors">Contacto</Link>
            <Link href="/nosotros" className="hover:text-foreground transition-colors">Nosotros</Link>
          </div>
          <p className="text-xs text-muted-foreground">© 2025 Vektra Tech. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
