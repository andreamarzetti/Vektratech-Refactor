import { useState } from "react";
import { User, Building2, CreditCard } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe, useUpdateMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Perfil() {
  const { data: me, isLoading } = useGetMe();
  const qc = useQueryClient();
  const { mutate: updateMe, isPending } = useUpdateMe({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetMeQueryKey() }) },
  });
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="ml-60 flex-1 p-6"><Skeleton className="h-64 w-full max-w-xl rounded-xl" /></main>
      </div>
    );
  }

  function startEdit() { setName(me?.name ?? ""); setEditing(true); }
  function save() {
    updateMe({ data: { name } }, { onSuccess: () => setEditing(false) });
  }

  const SECTOR_LABELS: Record<string, string> = {
    restaurante: "Restaurante", kiosco: "Kiosco", dietetica: "Dietética",
    ferreteria: "Ferretería", ropa: "Tienda de ropa", distribuidora: "Distribuidora", otro: "Otro",
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-60 flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Mi perfil</h1>

          <div className="space-y-4">
            {/* User info */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-semibold">Información personal</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm mt-1">{me?.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Nombre</Label>
                  {editing ? (
                    <div className="flex gap-2 mt-1">
                      <Input value={name} onChange={e => setName(e.target.value)} className="text-sm" autoFocus />
                      <Button size="sm" onClick={save} disabled={isPending} className="bg-primary text-primary-foreground shrink-0">
                        {isPending ? "..." : "Guardar"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm">{me?.name ?? "Sin nombre"}</p>
                      <button onClick={startEdit} className="text-xs text-primary hover:underline">Editar</button>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Rol</Label>
                  <p className="text-sm mt-1 capitalize">{me?.role === "admin" ? "Administrador" : "Cliente"}</p>
                </div>
              </div>
            </div>

            {/* Business info */}
            {me?.business && (
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="font-semibold">Mi negocio</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Nombre</Label>
                    <p className="text-sm mt-1 font-medium">{me.business.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Rubro</Label>
                    <p className="text-sm mt-1">{SECTOR_LABELS[me.business.sector] ?? me.business.sector}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Plan</Label>
                    <div className="mt-1">
                      <Badge className={me.business.plan === "pro" ? "bg-primary/15 text-primary border-primary/30" : "bg-muted text-muted-foreground"}>
                        {me.business.plan.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Estado</Label>
                    <div className="mt-1">
                      <Badge className={
                        me.business.status === "active" ? "bg-green-500/15 text-green-400 border-green-500/30"
                        : me.business.status === "suspended" ? "bg-destructive/15 text-destructive border-destructive/30"
                        : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
                      }>
                        {me.business.status === "active" ? "Activo" : me.business.status === "suspended" ? "Suspendido" : "Período de prueba"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Plan upgrade */}
            {me?.business?.plan === "starter" && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Actualizá a Pro</h2>
                    <p className="text-xs text-muted-foreground">Desbloqueá IA, CRM ilimitado y más</p>
                  </div>
                </div>
                <a href="https://wa.me/5491100000000?text=Quiero%20actualizar%20mi%20plan%20a%20Pro" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Actualizar a Pro — $49.950/mes
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
