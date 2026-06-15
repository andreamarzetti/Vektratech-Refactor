import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useGetMe } from "@workspace/api-client-react";
import { Store, ExternalLink, Save, Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BusinessConfig = {
  id: number; name: string; sector: string; plan: string; status: string;
  slug: string | null; whatsappNumber: string | null; shippingCost: number | null;
  cashDiscount: number | null; bankAlias: string | null; bankHolder: string | null; hasMpToken: boolean;
};

function useBusinessConfig() {
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetch("/api/me/business", { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then(setConfig)
      .finally(() => setLoading(false));
  });

  return { config, loading, setConfig };
}

export default function MiTienda() {
  const { toast } = useToast();
  const { data: me } = useGetMe();
  const { config, loading, setConfig } = useBusinessConfig();

  const [form, setForm] = useState<{
    slug: string; whatsappNumber: string; shippingCost: string;
    cashDiscount: string; bankAlias: string; bankHolder: string; mpAccessToken: string;
  }>({ slug: "", whatsappNumber: "", shippingCost: "", cashDiscount: "", bankAlias: "", bankHolder: "", mpAccessToken: "" });
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!initialized && config) {
    setForm({
      slug: config.slug ?? "",
      whatsappNumber: config.whatsappNumber ?? "",
      shippingCost: config.shippingCost !== null ? String(config.shippingCost) : "",
      cashDiscount: config.cashDiscount !== null ? String(config.cashDiscount) : "",
      bankAlias: config.bankAlias ?? "",
      bankHolder: config.bankHolder ?? "",
      mpAccessToken: "",
    });
    setInitialized(true);
  }

  async function save() {
    setSaving(true);
    try {
      const body: Record<string, any> = {
        slug: form.slug || undefined,
        whatsappNumber: form.whatsappNumber || undefined,
        shippingCost: form.shippingCost ? parseFloat(form.shippingCost) : null,
        cashDiscount: form.cashDiscount ? parseInt(form.cashDiscount) : null,
        bankAlias: form.bankAlias || undefined,
        bankHolder: form.bankHolder || undefined,
      };
      if (form.mpAccessToken) body.mpAccessToken = form.mpAccessToken;

      const r = await fetch("/api/me/business", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error("Error");
      const updated = await r.json();
      setConfig(updated);
      setForm((f) => ({ ...f, mpAccessToken: "" }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast({ title: "Configuracion guardada", description: "Los cambios se aplicaron correctamente." });
    } catch {
      toast({ title: "Error al guardar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  const storeUrl = config?.slug ? `${window.location.origin}/tienda/${config.slug}` : null;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <main className="flex-1 ml-60 p-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Mi Tienda</h1>
              <p className="text-muted-foreground text-sm">Configurá tu tienda pública online</p>
            </div>
          </div>

          {storeUrl && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tu tienda publica</p>
                <p className="text-sm font-medium text-primary break-all">{storeUrl}</p>
              </div>
              <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2 shrink-0">
                  <ExternalLink className="h-3.5 w-3.5" /> Ver tienda
                </Button>
              </a>
            </div>
          )}

          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Cargando configuracion...</span>
            </div>
          ) : (
            <div className="space-y-8">
              <section className="bg-card border border-border rounded-xl p-6 space-y-5">
                <h2 className="font-semibold">URL de la tienda</h2>
                <div>
                  <Label className="text-sm mb-1.5 block">Slug (identificador unico)</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground shrink-0">vektratech.com/tienda/</span>
                    <Input
                      value={form.slug}
                      onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))}
                      placeholder="mi-negocio"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Solo letras minusculas, numeros y guiones.</p>
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 space-y-5">
                <h2 className="font-semibold">WhatsApp y contacto</h2>
                <div>
                  <Label className="text-sm mb-1.5 block">Numero de WhatsApp</Label>
                  <Input
                    value={form.whatsappNumber}
                    onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
                    placeholder="+54 11 1234-5678"
                    type="tel"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Los clientes podran contactarte y vos recibis notificaciones de pedidos.</p>
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 space-y-5">
                <h2 className="font-semibold">Logistica y precios</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm mb-1.5 block">Costo de envio a domicilio</Label>
                    <Input
                      value={form.shippingCost}
                      onChange={(e) => setForm((f) => ({ ...f, shippingCost: e.target.value }))}
                      placeholder="1500"
                      type="number"
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground mt-1">En pesos ARS. Dejar vacio si no hacen envios.</p>
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">Descuento por efectivo (%)</Label>
                    <Input
                      value={form.cashDiscount}
                      onChange={(e) => setForm((f) => ({ ...f, cashDiscount: e.target.value }))}
                      placeholder="10"
                      type="number"
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-muted-foreground mt-1">% de descuento al pagar en efectivo.</p>
                  </div>
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 space-y-5">
                <h2 className="font-semibold">Datos bancarios para transferencia</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm mb-1.5 block">Alias de transferencia</Label>
                    <Input
                      value={form.bankAlias}
                      onChange={(e) => setForm((f) => ({ ...f, bankAlias: e.target.value }))}
                      placeholder="mi.negocio.mp"
                    />
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">Titular de la cuenta</Label>
                    <Input
                      value={form.bankHolder}
                      onChange={(e) => setForm((f) => ({ ...f, bankHolder: e.target.value }))}
                      placeholder="Juan Pérez"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Mercado Pago</h2>
                  {config?.hasMpToken && (
                    <Badge className="bg-primary/15 text-primary border-primary/30">Conectado</Badge>
                  )}
                </div>
                <div>
                  <Label className="text-sm mb-1.5 block">Access Token de Mercado Pago</Label>
                  <Input
                    value={form.mpAccessToken}
                    onChange={(e) => setForm((f) => ({ ...f, mpAccessToken: e.target.value }))}
                    placeholder={config?.hasMpToken ? "Token actual (oculto) — pegar nuevo para reemplazar" : "APP_USR-..."}
                    type="password"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Obtenelo en <a href="https://www.mercadopago.com.ar/developers/panel" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mercadopago.com.ar/developers/panel</a>. Tu Access Token es privado y seguro.
                  </p>
                </div>
              </section>

              <Button
                className="w-full bg-primary text-primary-foreground gap-2 h-11"
                onClick={save}
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {saving ? "Guardando..." : saved ? "Guardado" : "Guardar configuracion"}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
