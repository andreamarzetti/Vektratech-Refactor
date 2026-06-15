import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, ShoppingCart, Users, Bot, User, LogOut, ChevronRight, Store, Tag } from "lucide-react";
import { useClerk } from "@clerk/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/productos", label: "Productos", icon: Package },
  { href: "/app/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/app/clientes", label: "Clientes", icon: Users },
  { href: "/app/ia", label: "Asistente IA", icon: Bot },
];

const STORE_ITEMS = [
  { href: "/app/mi-tienda", label: "Mi Tienda", icon: Store },
  { href: "/app/cupones", label: "Cupones", icon: Tag },
];

const ACCOUNT_ITEMS = [
  { href: "/app/perfil", label: "Perfil", icon: User },
];

function NavSection({ items, label }: { items: typeof NAV_ITEMS; label?: string }) {
  const [location] = useLocation();
  return (
    <div>
      {label && <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 mb-1 mt-3">{label}</p>}
      {items.map(({ href, label: itemLabel, icon: Icon }) => {
        const isActive = location === href || (href !== "/app" && location.startsWith(href));
        return (
          <Link key={href} href={href}>
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors cursor-pointer",
                isActive
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {itemLabel}
              {isActive && <ChevronRight className="ml-auto h-3 w-3" />}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function AppSidebar() {
  const { signOut } = useClerk();
  const { data: me } = useGetMe();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-sidebar border-r border-sidebar-border flex flex-col z-40">
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/">
          <img src="/logo.svg" alt="VektraHub" className="h-7 w-auto" />
        </Link>
      </div>

      {me?.business && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <p className="text-xs text-muted-foreground mb-1">Negocio</p>
          <p className="text-sm font-semibold text-foreground truncate">{me.business.name}</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge
              variant="secondary"
              className={cn(
                "text-xs uppercase tracking-wide",
                me.business.plan === "pro"
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {me.business.plan}
            </Badge>
            <span className="text-xs text-muted-foreground capitalize">{me.business.sector}</span>
          </div>
        </div>
      )}

      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        <NavSection items={NAV_ITEMS} />
        <NavSection items={STORE_ITEMS} label="Tienda online" />
        <NavSection items={ACCOUNT_ITEMS} label="Cuenta" />
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          onClick={() => signOut({ redirectUrl: basePath || "/" })}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesion
        </Button>
      </div>
    </aside>
  );
}
