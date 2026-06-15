import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tag, Plus, Trash2, Loader2, Power } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Coupon = {
  id: number; code: string; type: "percentage" | "fixed"; value: number;
  active: boolean; maxUses: number | null; usedCount: number; expiresAt: string | null; createdAt: string;
};

function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetch("/api/me/coupons", { credentials: "include" })
      .then((r) => r.ok ? r.json() : [])
      .then(setCoupons)
      .finally(() => setLoading(false));
  });

  return { coupons, loading, setCoupons };
}

export default function Cupones() {
  const { toast } = useToast();
  const { coupons, loading, setCoupons } = useCoupons();
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ code: "", type: "percentage" as "percentage" | "fixed", value: "", maxUses: "", expiresAt: "" });

  async function createCoupon() {
    if (!form.code || !form.value) return;
    setCreating(true);
    try {
      const r = await fetch("/api/me/coupons", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          type: form.type,
          value: parseFloat(form.value),
          maxUses: form.maxUses ? parseInt(form.maxUses) : undefined,
          expiresAt: form.expiresAt || undefined,
        }),
      });
      if (!r.ok) throw new Error();
      const created: Coupon = await r.json();
      setCoupons((prev) => [created, ...prev]);
      setForm({ code: "", type: "percentage", value: "", maxUses: "", expiresAt: "" });
      setShowForm(false);
      toast({ title: "Cupon creado correctamente" });
    } catch {
      toast({ title: "Error al crear el cupon", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  }

  async function toggleCoupon(coupon: Coupon) {
    try {
      const r = await fetch(`/api/me/coupons/${coupon.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !coupon.active }),
      });
      if (!r.ok) throw new Error();
      const updated: Coupon = await r.json();
      setCoupons((prev) => prev.map((c) => c.id === updated.id ? updated : c));
    } catch {
      toast({ title: "Error al actualizar", variant: "destructive" });
    }
  }

  async function deleteCoupon(id: number) {
    try {
      await fetch(`/api/me/coupons/${id}`, { method: "DELETE", credentials: "include" });
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Cupon eliminado" });
    } catch {
      toast({ title: "Error al eliminar", variant: "destructive" });
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <main className="flex-1 ml-60 p-8">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Cupones</h1>
                <p className="text-muted-foreground text-sm">Crear y gestionar cupones de descuento</p>
              </div>
            </div>
            <Button onClick={() => setShowForm((v) => !v)} className="bg-primary text-primary-foreground gap-2">
              <Plus className="h-4 w-4" />
              Nuevo cupon
            </Button>
          </div>

          {showForm && (
            <div className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
              <h2 className="font-semibold">Crear cupon</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm mb-1.5 block">Codigo</Label>
                  <Input
                    value={form.code}
                    onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="BIENVENIDO10"
                    className="uppercase"
                  />
                </div>
                <div>
                  <Label className="text-sm mb-1.5 block">Tipo</Label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "percentage" | "fixed" }))}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Monto fijo ($)</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm mb-1.5 block">Valor ({form.type === "percentage" ? "%" : "$"})</Label>
                  <Input
                    value={form.value}
                    onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                    placeholder={form.type === "percentage" ? "15" : "5000"}
                    type="number"
                    min="0"
                  />
                </div>
                <div>
                  <Label className="text-sm mb-1.5 block">Usos maximos</Label>
                  <Input
                    value={form.maxUses}
                    onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
                    placeholder="Sin limite"
                    type="number"
                    min="1"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-sm mb-1.5 block">Fecha de vencimiento</Label>
                  <Input
                    value={form.expiresAt}
                    onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                    type="date"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={createCoupon} disabled={creating} className="bg-primary text-primary-foreground gap-2">
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {creating ? "Creando..." : "Crear cupon"}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Cargando cupones...</span>
            </div>
          ) : coupons.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <Tag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium mb-1">Sin cupones todavia</p>
              <p className="text-sm text-muted-foreground">Crea tu primer cupon para ofrecer descuentos a tus clientes.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-primary">{coupon.code}</span>
                      <Badge variant={coupon.active ? "default" : "secondary"} className={coupon.active ? "bg-primary/15 text-primary border-primary/30" : ""}>
                        {coupon.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{coupon.type === "percentage" ? `${coupon.value}% de descuento` : `$${coupon.value.toLocaleString("es-AR")} de descuento`}</span>
                      <span>·</span>
                      <span>{coupon.usedCount} {coupon.maxUses ? `/ ${coupon.maxUses}` : ""} usos</span>
                      {coupon.expiresAt && (
                        <>
                          <span>·</span>
                          <span>Vence: {new Date(coupon.expiresAt).toLocaleDateString("es-AR")}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleCoupon(coupon)}
                      title={coupon.active ? "Desactivar" : "Activar"}
                    >
                      <Power className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 hover:text-destructive hover:border-destructive"
                      onClick={() => deleteCoupon(coupon.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
