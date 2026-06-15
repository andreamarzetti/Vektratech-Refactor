import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Zap, Shield } from "lucide-react";

const VALUES = [
  { icon: Target, title: "Enfoque en el negocio", desc: "Diseñamos cada función pensando en los dueños de pequeños y medianos negocios argentinos." },
  { icon: Zap, title: "Tecnología accesible", desc: "IA y comercio electrónico sin necesidad de conocimientos técnicos. Simple desde el primer día." },
  { icon: Shield, title: "Confianza y seguridad", desc: "Tus datos y los de tus clientes están seguros. Arquitectura multi-tenant con aislamiento total." },
];

export default function Nosotros() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">Sobre Vektra Tech</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Vektra Tech desarrolla soluciones tecnológicas para digitalizar negocios
              y aumentar ventas mediante comercio electrónico e inteligencia artificial.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card border border-border rounded-2xl p-8 mb-12"
          >
            <h2 className="text-2xl font-bold mb-4">Nuestra misión</h2>
            <p className="text-muted-foreground leading-relaxed">
              Creemos que cada negocio, sin importar su tamaño, merece acceso a las mismas
              herramientas tecnológicas que usan las grandes empresas. Por eso creamos VektraHub:
              una plataforma completa, asequible y pensada para la realidad del comercio argentino.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Desde el restaurant de barrio hasta la distribuidora regional, ayudamos a los
              comerciantes a dar el salto digital y competir en el mundo online sin complicaciones.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link href="/sign-up">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold px-8">
                Empezar ahora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
