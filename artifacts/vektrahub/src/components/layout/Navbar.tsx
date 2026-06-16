import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Show } from "@clerk/react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/soluciones", label: "Soluciones" },
  { href: "/demos", label: "Demos" },
  { href: "/plantillas", label: "Plantillas" },
  { href: "/precios", label: "Precios" },
  { href: "/casos-de-exito", label: "Clientes" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-200/80"
          : "bg-white/90 backdrop-blur-md border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">V</span>
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              Vektra<span className="text-blue-600">Hub</span>
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3.5 py-2 text-sm rounded-lg transition-colors font-medium ${
                location === href
                  ? "text-blue-600 bg-blue-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Show when="signed-out">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="text-slate-700 hover:text-slate-900 hover:bg-slate-100">
                Ingresar
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm font-semibold">
                Empezar gratis
              </Button>
            </Link>
          </Show>
          <Show when="signed-in">
            <Link href="/app">
              <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm font-semibold">
                Mi panel
              </Button>
            </Link>
          </Show>
        </div>

        <button
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-100 bg-white/98 backdrop-blur-xl px-4 py-4 flex flex-col gap-1 shadow-lg">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium"
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 mt-1">
            <Show when="signed-out">
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                <Button variant="outline" size="sm" className="w-full border-slate-200 text-slate-700">Ingresar</Button>
              </Link>
              <Link href="/sign-up" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full bg-blue-600 text-white hover:bg-blue-700">Empezar gratis</Button>
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/app" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full bg-blue-600 text-white hover:bg-blue-700">Mi panel</Button>
              </Link>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
