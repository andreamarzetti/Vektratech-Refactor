import { Link, useLocation } from "wouter";
import { LayoutDashboard, Building2, LogOut, ChevronRight } from "lucide-react";
import { useClerk } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Estadísticas", icon: LayoutDashboard },
  { href: "/admin/negocios", label: "Negocios", icon: Building2 },
];

export function AdminSidebar() {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-sidebar border-r border-sidebar-border flex flex-col z-40">
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/">
          <img src="/logo.svg" alt="VektraHub" className="h-7 w-auto" />
        </Link>
        <p className="text-xs text-primary font-medium mt-1 uppercase tracking-wider">Admin Panel</p>
      </div>

      <nav className="flex-1 px-2 py-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = location === href;
          return (
            <Link key={href} href={href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                {isActive && <ChevronRight className="ml-auto h-3 w-3" />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => signOut({ redirectUrl: basePath || "/" })}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
