import { motion } from "framer-motion";
import { Building2, CheckCircle, XCircle, Clock, TrendingUp, Cpu, LayoutDashboard } from "lucide-react";
import { Link } from "wouter";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminGetStats } from "@workspace/api-client-react";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminGetStats();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-60 flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Panel Administrador</h1>
            <p className="text-muted-foreground text-sm mt-1">VektraHub — vista global de la plataforma</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total negocios" value={stats?.totalBusinesses ?? 0} icon={Building2} color="bg-primary/10 text-primary" />
                <StatCard label="Activos" value={stats?.activeBusinesses ?? 0} icon={CheckCircle} color="bg-green-500/10 text-green-400" />
                <StatCard label="Suspendidos" value={stats?.suspendedBusinesses ?? 0} icon={XCircle} color="bg-destructive/10 text-destructive" />
                <StatCard label="En prueba" value={stats?.trialBusinesses ?? 0} icon={Clock} color="bg-yellow-500/10 text-yellow-400" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard label="Plan Starter" value={stats?.starterPlan ?? 0} icon={LayoutDashboard} color="bg-muted text-muted-foreground" />
                <StatCard label="Plan Pro" value={stats?.proPlan ?? 0} icon={Cpu} color="bg-primary/10 text-primary" />
                <StatCard label="Nuevos este mes" value={stats?.newThisMonth ?? 0} icon={TrendingUp} color="bg-green-500/10 text-green-400" />
              </div>
            </>
          )}

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Gestión de negocios</h2>
              <Link href="/admin/negocios">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Ver todos los negocios
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Activá, suspendé o cambiá el plan de cualquier negocio desde la sección de negocios.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
