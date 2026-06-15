import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ShoppingCart, Package, Users, DollarSign, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetDashboardStats,
  useGetRecentOrders,
  useGetTopProducts,
  useGetMe,
} from "@workspace/api-client-react";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
  confirmed: { label: "Confirmado", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  preparing: { label: "Preparando", color: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  ready: { label: "Listo", color: "bg-primary/15 text-primary border-primary/30" },
  delivered: { label: "Entregado", color: "bg-green-500/15 text-green-400 border-green-500/30" },
  cancelled: { label: "Cancelado", color: "bg-destructive/15 text-destructive border-destructive/30" },
};

function StatCard({ label, value, sub, icon: Icon, trend }: { label: string; value: string; sub?: string; icon: any; trend?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs mt-1 ${trend >= 0 ? "text-green-400" : "text-destructive"}`}>
          {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(trend)}% vs ayer
        </div>
      )}
    </motion.div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: recentOrders, isLoading: ordersLoading } = useGetRecentOrders();
  const { data: topProducts, isLoading: productsLoading } = useGetTopProducts();
  const { data: me } = useGetMe();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-60 flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {me?.business?.name ?? "Tu negocio"} — Resumen del día
            </p>
          </div>

          {/* Stats */}
          {statsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Ingresos hoy"
                value={`$${(stats?.revenueToday ?? 0).toLocaleString("es-AR")}`}
                sub={`$${(stats?.totalRevenue ?? 0).toLocaleString("es-AR")} total`}
                icon={DollarSign}
                trend={stats?.growthPercent}
              />
              <StatCard
                label="Pedidos hoy"
                value={String(stats?.ordersToday ?? 0)}
                sub={`${stats?.pendingOrders ?? 0} pendientes`}
                icon={ShoppingCart}
              />
              <StatCard
                label="Productos"
                value={String(stats?.totalProducts ?? 0)}
                icon={Package}
              />
              <StatCard
                label="Clientes"
                value={String(stats?.totalCustomers ?? 0)}
                icon={Users}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent orders */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Pedidos recientes</h2>
                <Link href="/app/pedidos">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
                    Ver todos <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
              {ordersLoading ? (
                <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
              ) : recentOrders?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  Sin pedidos aún. ¡Compartí tu link de negocio!
                </div>
              ) : (
                <div className="space-y-2">
                  {recentOrders?.slice(0, 5).map((order) => {
                    const status = STATUS_LABELS[order.status] ?? { label: order.status, color: "bg-muted text-muted-foreground" };
                    return (
                      <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-medium">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.items?.length ?? 0} ítems</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">${order.total.toLocaleString("es-AR")}</p>
                          <Badge className={`text-xs ${status.color}`}>{status.label}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top products */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Productos más vendidos</h2>
                <Link href="/app/productos">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
                    Ver todos <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
              {productsLoading ? (
                <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}</div>
              ) : topProducts?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  Todavía no hay ventas registradas.
                </div>
              ) : (
                <div className="space-y-3">
                  {topProducts?.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.totalSold} vendidos</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">${p.revenue.toLocaleString("es-AR")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
