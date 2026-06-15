import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Building2, Package, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboardBusiness, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const SECTORES = [
  { value: "restaurante", label: "Restaurante" },
  { value: "kiosco", label: "Kiosco" },
  { value: "dietetica", label: "Dietética" },
  { value: "ferreteria", label: "Ferretería" },
  { value: "ropa", label: "Tienda de ropa" },
  { value: "distribuidora", label: "Distribuidora" },
  { value: "otro", label: "Otro" },
];

const PLANES = [
  { value: "starter", label: "Starter", price: "$25.000/mes", desc: "Hasta 100 productos, pedidos y reportes básicos." },
  { value: "pro", label: "Pro", price: "$49.950/mes", desc: "Ilimitado, IA, CRM y soporte prioritario." },
];

const steps = ["Tu negocio", "Tu rubro", "Tu plan"];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [plan, setPlan] = useState("starter");
  const queryClient = useQueryClient();
  const { mutate, isPending } = useOnboardBusiness({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() }),
    },
  });

  function next() { if (step < 2) setStep(s => s + 1); }
  function canNext() {
    if (step === 0) return name.trim().length > 2;
    if (step === 1) return !!sector;
    return true;
  }
  function submit() {
    mutate({ data: { businessName: name, sector: sector as any, plan: plan as any } });
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <img src="/logo.svg" alt="VektraHub" className="h-8 w-auto mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-2">Configurá tu negocio</h1>
          <p className="text-muted-foreground text-sm">Solo 3 pasos para empezar</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">¿Cómo se llama tu negocio?</h2>
                </div>
                <div className="space-y-2">
                  <Label>Nombre del negocio</Label>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej: La Parrilla del Centro"
                    className="text-base"
                    autoFocus
                    onKeyDown={e => e.key === "Enter" && canNext() && next()}
                  />
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">¿Cuál es tu rubro?</h2>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SECTORES.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setSector(s.value)}
                      className={`py-3 px-4 rounded-xl text-sm border text-left transition-colors ${
                        sector === s.value
                          ? "bg-primary/15 border-primary text-primary font-medium"
                          : "bg-background border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Cpu className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">Elegí tu plan</h2>
                </div>
                <div className="space-y-3">
                  {PLANES.map(p => (
                    <button
                      key={p.value}
                      onClick={() => setPlan(p.value)}
                      className={`w-full text-left p-4 rounded-xl border transition-colors ${
                        plan === p.value
                          ? "bg-primary/10 border-primary"
                          : "bg-background border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{p.label}</span>
                        <span className={`text-sm font-bold ${plan === p.value ? "text-primary" : "text-muted-foreground"}`}>{p.price}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </button>
                  ))}
                  <p className="text-xs text-muted-foreground text-center pt-1">14 días de prueba gratuita incluidos</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">
                Atrás
              </Button>
            )}
            {step < 2 ? (
              <Button
                onClick={next}
                disabled={!canNext()}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={submit}
                disabled={isPending}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                {isPending ? "Creando..." : "Crear mi negocio"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
