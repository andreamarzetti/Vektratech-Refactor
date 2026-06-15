import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  { q: "¿Qué es VektraHub?", a: "VektraHub es una plataforma SaaS que digitaliza negocios. Te damos catálogo online, gestión de pedidos, CRM y asistente IA en una sola solución." },
  { q: "¿Para qué tipo de negocios sirve?", a: "Restaurantes, kioscos, dietéticas, ferreterías, tiendas de ropa, distribuidoras y cualquier negocio que quiera vender más con tecnología." },
  { q: "¿Necesito saber de tecnología para usarlo?", a: "No. VektraHub es intuitivo y está pensado para dueños de negocios. En menos de 30 minutos podés tener tu catálogo online funcionando." },
  { q: "¿Cuánto cuesta?", a: "Tenemos dos planes: Starter a $25.000/mes y Pro a $49.950/mes. Todos incluyen 14 días de prueba gratuita sin tarjeta de crédito." },
  { q: "¿Puedo cancelar cuando quiero?", a: "Sí. No hay contratos ni penalidades. Podés cancelar en cualquier momento desde tu panel." },
  { q: "¿Cómo funciona el asistente IA?", a: "El asistente IA lee tu catálogo de productos y responde consultas de tus clientes en tiempo real: recomendaciones, precios, disponibilidad y más." },
  { q: "¿Mis datos están seguros?", a: "Sí. Usamos cifrado en tránsito y en reposo. Cada negocio tiene sus propios datos completamente aislados de los demás." },
  { q: "¿Puedo cargar mis propios productos?", a: "Absolutamente. Podés cargar productos con fotos, precios, categorías y descripciones desde tu panel en minutos." },
  { q: "¿Tienen soporte en español?", a: "Sí, todo nuestro soporte es en español. Podés contactarnos por email, WhatsApp o desde el panel." },
  { q: "¿Qué pasa si supero el límite de productos del plan Starter?", a: "Te avisamos con tiempo y podés actualizar al plan Pro fácilmente desde tu panel." },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-3">Preguntas frecuentes</h1>
            <p className="text-muted-foreground">Todo lo que necesitás saber sobre VektraHub.</p>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-2">
            {FAQS.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <AccordionItem value={`item-${i}`} className="bg-card border border-border rounded-xl px-5 overflow-hidden">
                  <AccordionTrigger className="text-left font-medium py-4 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
