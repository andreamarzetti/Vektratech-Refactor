import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Show, useClerk } from "@clerk/react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/soluciones", label: "Soluciones" },
  { href: "/demos", label: "Demos" },
  { href: "/funcionalidades", label: "Funcionalidades" },
  { href: "/precios", label: "Precios" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { signOut } = useClerk();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.svg" alt="VektraHub" className="h-8 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                location === href
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Show when="signed-out">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Ingresar</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Empezar gratis
              </Button>
            </Link>
          </Show>
          <Show when="signed-in">
            <Link href="/app">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Mi panel
              </Button>
            </Link>
          </Show>
        </div>

        <button
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-2">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Show when="signed-out">
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">Ingresar</Button>
              </Link>
              <Link href="/sign-up" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full bg-primary text-primary-foreground">Empezar gratis</Button>
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/app" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full bg-primary text-primary-foreground">Mi panel</Button>
              </Link>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
