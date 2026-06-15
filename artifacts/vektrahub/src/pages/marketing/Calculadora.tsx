import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Calculator } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const RUBROS = ["Restaurante", "Kiosco", "Dietética", "Ferretería", "Tienda de ropa", "Distribuidora", "Otro"];

export default function Calculadora() {
  const [rubro, setRubro] = useState("");
  const [productos, setProductos] = useState("");
  const [ia, setIa] = useState(false);
  const [crm, setCrm] = useState(false);
  const [result, setResult] = useState<null | { plan: "starter" | "pro"; reasons: string[] }>(null);

  function calcular() {
    const numProductos = parseInt(productos) || 0;
    const reasons: string[] = [];
    let plan: "starter" | "pro" = "starter";

    if (numProductos > 100) { plan = "pro"; reasons.push(`Tenés más de 100 productos (Starter solo admite hasta 100).`); }
    if (ia) { plan = "pro"; reasons.push("El asistente IA solo está disponible en el plan Pro."); }
    if (crm) { plan = "pro"; reasons.push("El CRM de clientes solo está disponible en el plan Pro."); }
    if (plan === "starter") reasons.push("Tu configuración está cubierta por el plan Starter.");

    setResult({ plan, reasons });
  }

  const precio = result?.plan === "pro" ? "$ 49.950" : "$ 25.000";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-3">Calculadora de plan</h1>
            <p className="text-muted-foreground">Respondé unas preguntas y te recomendamos el plan ideal para tu negocio.</p>
          </motion.div>

          <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">¿Cuál es tu rubro?</Label>
              <div className="flex flex-wrap gap-2">
                {RUBROS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRubro(r)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      rubro === r
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">¿Cuántos productos tenés aproximadamente?</Label>
              <div className="flex flex-wrap gap-2">
                {["1-30", "31-100", "101-500", "+500"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setProductos(range === "+500" ? "501" : range.split("-")[0])}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      (range === "+500" && parseInt(productos) > 500) ||
                      (range !== "+500" && parseInt(productos) >= parseInt(range.split("-")[0]))
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {range} productos
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">¿Querés el asistente IA?</Label>
              <div className="flex gap-3">
                {[{ label: "Sí, lo quiero", val: true }, { label: "Por ahora no", val: false }].map(({ label, val }) => (
                  <button
                    key={label}
                    onClick={() => setIa(val)}
                    className={`flex-1 py-2.5 rounded-xl text-sm border transition-colors ${
                      ia === val
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">¿Necesitás CRM para gestionar clientes?</Label>
              <div className="flex gap-3">
                {[{ label: "Sí, lo necesito", val: true }, { label: "Por ahora no", val: false }].map(({ label, val }) => (
                  <button
                    key={label}
                    onClick={() => setCrm(val)}
                    className={`flex-1 py-2.5 rounded-xl text-sm border transition-colors ${
                      crm === val
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={calcular}
              disabled={!rubro || !productos}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6"
            >
              Calcular mi plan ideal
            </Button>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-6 border ${result.plan === "pro" ? "bg-primary/10 border-primary/30" : "bg-card border-border"}`}
                >
                  <p className="text-sm text-muted-foreground mb-2">Plan recomendado para vos</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-extrabold text-primary">{result.plan === "pro" ? "PRO" : "STARTER"}</span>
                    <span className="text-xl font-semibold">{precio}/mes</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {result.reasons.map((r) => (
                      <li key={r} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">→</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                  <Link href="/sign-up">
                    <Button className="w-full bg-primary text-primary-foreground gap-2">
                      Empezar con {result.plan === "pro" ? "Pro" : "Starter"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
