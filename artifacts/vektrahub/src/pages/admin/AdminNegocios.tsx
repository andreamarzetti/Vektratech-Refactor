import { useState } from "react";
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useAdminListBusinesses,
  useAdminUpdateBusiness,
  getAdminListBusinessesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/15 text-green-400 border-green-500/30",
  suspended: "bg-destructive/15 text-destructive border-destructive/30",
  trial: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
};

const SECTOR_LABELS: Record<string, string> = {
  restaurante: "Restaurante", kiosco: "Kiosco", dietetica: "Dietética",
  ferreteria: "Ferretería", ropa: "Ropa", distribuidora: "Distribuidora", otro: "Otro",
};

export default function AdminNegocios() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const qc = useQueryClient();

  const { data: businesses, isLoading } = useAdminListBusinesses(
    filterStatus !== "all" ? { status: filterStatus as any } : {}
  );
  const { mutate: updateBusiness } = useAdminUpdateBusiness({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getAdminListBusinessesQueryKey() }) },
  });

  const filtered = businesses?.filter(b =>
    !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.ownerEmail.includes(search)
  );

  function setStatus(id: number, status: "active" | "suspended" | "trial") {
    updateBusiness({ id, data: { status } });
  }

  function setPlan(id: number, plan: "starter" | "pro") {
    updateBusiness({ id, data: { plan } });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-60 flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Negocios</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{filtered?.length ?? 0} negocios</p>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-44 bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="trial">En prueba</SelectItem>
                <SelectItem value="suspended">Suspendidos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o email..." className="pl-9" />
          </div>

          {isLoading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
          ) : filtered?.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">Sin negocios registrados.</div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Negocio", "Rubro", "Plan", "Estado", "Pedidos", "Productos", "Acciones"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered?.map((b, i) => (
                    <tr key={b.id} className={`border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors ${i % 2 === 1 ? "bg-muted/5" : ""}`}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm">{b.name}</p>
                        <p className="text-xs text-muted-foreground">{b.ownerEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{SECTOR_LABELS[b.sector] ?? b.sector}</td>
                      <td className="px-4 py-3">
                        <Select value={b.plan} onValueChange={(val) => setPlan(b.id, val as any)}>
                          <SelectTrigger className="w-24 h-7 text-xs bg-background border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="starter" className="text-xs">Starter</SelectItem>
                            <SelectItem value="pro" className="text-xs">Pro</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${STATUS_COLORS[b.status]}`}>
                          {b.status === "active" ? "Activo" : b.status === "suspended" ? "Suspendido" : "Prueba"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-center">{b.ordersCount}</td>
                      <td className="px-4 py-3 text-sm text-center">{b.productsCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          {b.status !== "active" && (
                            <button
                              onClick={() => setStatus(b.id, "active")}
                              className="p-1.5 rounded hover:bg-green-500/10 text-muted-foreground hover:text-green-400 transition-colors"
                              title="Activar"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          {b.status !== "suspended" && (
                            <button
                              onClick={() => setStatus(b.id, "suspended")}
                              className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                              title="Suspender"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                          {b.status !== "trial" && (
                            <button
                              onClick={() => setStatus(b.id, "trial")}
                              className="p-1.5 rounded hover:bg-yellow-500/10 text-muted-foreground hover:text-yellow-400 transition-colors"
                              title="Poner en prueba"
                            >
                              <Clock className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
