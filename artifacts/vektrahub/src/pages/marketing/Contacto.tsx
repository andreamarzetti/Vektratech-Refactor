import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Contacto() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight mb-3">Contactanos</h1>
            <p className="text-muted-foreground text-lg">Estamos para ayudarte. Respondemos en menos de 24hs.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-card border border-border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">WhatsApp</h3>
                  <p className="text-sm text-muted-foreground mb-3">Chateá con nosotros directamente</p>
                  <a
                    href="https://wa.me/5491100000000?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20VektraHub"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Abrir WhatsApp
                    </Button>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-card border border-border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground mb-1">Para consultas no urgentes</p>
                  <a href="mailto:hola@vektratech.com" className="text-primary hover:underline text-sm font-medium">
                    hola@vektratech.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-card border border-border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Horarios de atención</h3>
                  <p className="text-sm text-muted-foreground">Lunes a viernes de 9 a 18hs (ARG)</p>
                  <p className="text-sm text-muted-foreground">Soporte online 24/7</p>
                </div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              {sent ? (
                <div className="bg-card border border-primary/30 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-4 mx-auto">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Mensaje enviado</h2>
                  <p className="text-muted-foreground">Te respondemos en menos de 24hs. Mientras tanto, explore nuestro <a href="/faq" className="text-primary hover:underline">FAQ</a>.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-5">
                  <h2 className="text-xl font-bold">Envianos un mensaje</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Nombre</Label>
                      <Input placeholder="Tu nombre" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Negocio</Label>
                      <Input placeholder="Nombre del negocio" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input type="email" placeholder="tu@email.com" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Mensaje</Label>
                    <Textarea placeholder="¿En qué podemos ayudarte?" rows={4} required />
                  </div>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                    Enviar mensaje
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
