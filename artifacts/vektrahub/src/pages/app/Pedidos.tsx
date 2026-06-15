import { useState } from "react";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useListOrders,
  useUpdateOrder,
  getListOrdersQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const STATUSES = [
  { value: "all", label: "Todos los estados" },
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "preparing", label: "Preparando" },
  { value: "ready", label: "Listo" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  preparing: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  ready: "bg-primary/15 text-primary border-primary/30",
  delivered: "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

const NEXT_STATUS: Record<string, string> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "delivered",
};

export default function Pedidos() {
  const [filterStatus, setFilterStatus] = useState("all");
  const qc = useQueryClient();

  const { data: orders, isLoading } = useListOrders(
    filterStatus !== "all" ? { status: filterStatus as any } : {}
  );
  const { mutate: updateOrder } = useUpdateOrder({
    mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListOrdersQueryKey() }) },
  });

  function advance(id: number, current: string) {
    const next = NEXT_STATUS[current];
    if (next) updateOrder({ id, data: { status: next as any } });
  }

  function cancel(id: number) {
    updateOrder({ id, data: { status: "cancelled" } });
  }

  const statusLabel = (s: string) => STATUSES.find(x => x.value === s)?.label ?? s;

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-60 flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Pedidos</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{orders?.length ?? 0} pedidos</p>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {STATUSES.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
          ) : orders?.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium mb-1">Sin pedidos</p>
              <p className="text-sm">Los pedidos de tus clientes aparecerán acá.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders?.map((order) => (
                <div key={order.id} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{order.customerName}</span>
                        <span className="text-xs text-muted-foreground">#{order.id}</span>
                      </div>
                      {order.customerPhone && <p className="text-xs text-muted-foreground">{order.customerPhone}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground"}>
                        {statusLabel(order.status)}
                      </Badge>
                      <span className="font-bold text-primary">${order.total.toLocaleString("es-AR")}</span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground mb-3">
                    {(order.items as any[])?.map((item: any, i: number) => (
                      <span key={i}>{i > 0 ? ", " : ""}{item.productName} x{item.quantity}</span>
                    ))}
                  </div>

                  {order.notes && (
                    <p className="text-xs bg-muted/30 rounded-lg px-3 py-2 mb-3 text-muted-foreground">
                      Nota: {order.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    {NEXT_STATUS[order.status] && (
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1 text-xs"
                        onClick={() => advance(order.id, order.status)}
                      >
                        <ChevronDown className="h-3 w-3" />
                        Pasar a {statusLabel(NEXT_STATUS[order.status])}
                      </Button>
                    )}
                    {order.status !== "cancelled" && order.status !== "delivered" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => cancel(order.id)}
                      >
                        Cancelar
                      </Button>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(order.createdAt).toLocaleString("es-AR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}
                    </span>
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
