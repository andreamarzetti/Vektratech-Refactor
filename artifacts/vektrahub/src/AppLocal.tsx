import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Marketing pages
import Home from "@/pages/marketing/Home";
import Soluciones from "@/pages/marketing/Soluciones";
import Demos from "@/pages/marketing/Demos";
import DemoRubro from "@/pages/marketing/DemoRubro";
import Precios from "@/pages/marketing/Precios";
import Calculadora from "@/pages/marketing/Calculadora";
import FAQ from "@/pages/marketing/FAQ";
import Contacto from "@/pages/marketing/Contacto";
import Nosotros from "@/pages/marketing/Nosotros";
import Funcionalidades from "@/pages/marketing/Funcionalidades";
import CasosDeExito from "@/pages/marketing/CasosDeExito";
import Templates from "@/pages/marketing/Templates";

// Store pages (public)
import StoreFront from "@/pages/store/StoreFront";

import NotFound from "@/pages/not-found";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function AppLocalRoutes() {
  return (
    <Switch>
      {/* Marketing */}
      <Route path="/">
        <Home />
      </Route>

      {/* Public store */}
      <Route path="/tienda/:slug" component={StoreFront} />

      <Route path="/plantillas" component={Templates} />
      <Route path="/soluciones" component={Soluciones} />
      <Route path="/demos/:rubro" component={DemoRubro} />
      <Route path="/demos" component={Demos} />
      <Route path="/funcionalidades" component={Funcionalidades} />
      <Route path="/precios" component={Precios} />
      <Route path="/calculadora" component={Calculadora} />
      <Route path="/casos-de-exito" component={CasosDeExito} />
      <Route path="/faq" component={FAQ} />
      <Route path="/contacto" component={Contacto} />
      <Route path="/nosotros" component={Nosotros} />

      <Route component={NotFound} />
    </Switch>
  );
}

function AppLocal() {
  return (
    <WouterRouter base={basePath}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppLocalRoutes />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </WouterRouter>
  );
}

export default AppLocal;
