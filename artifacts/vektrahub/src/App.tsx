import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useGetMe } from "@workspace/api-client-react";

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

// App (client) pages
import Dashboard from "@/pages/app/Dashboard";
import Productos from "@/pages/app/Productos";
import Pedidos from "@/pages/app/Pedidos";
import Clientes from "@/pages/app/Clientes";
import AsistenteIA from "@/pages/app/AsistenteIA";
import Perfil from "@/pages/app/Perfil";
import Onboarding from "@/pages/app/Onboarding";
import Suspended from "@/pages/app/Suspended";
import MiTienda from "@/pages/app/MiTienda";
import Cupones from "@/pages/app/Cupones";

// Store pages (public)
import StoreFront from "@/pages/store/StoreFront";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminNegocios from "@/pages/admin/AdminNegocios";

import NotFound from "@/pages/not-found";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(168 100% 42%)",
    colorForeground: "hsl(210 40% 98%)",
    colorMutedForeground: "hsl(215 20.2% 65.1%)",
    colorDanger: "hsl(0 62.8% 30.6%)",
    colorBackground: "hsl(222 47% 6%)",
    colorInput: "hsl(222 47% 4%)",
    colorInputForeground: "hsl(210 40% 98%)",
    colorNeutral: "hsl(217.2 32.6% 17.5%)",
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-card rounded-2xl w-[440px] max-w-full overflow-hidden border border-border shadow-xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-foreground font-bold tracking-tight text-2xl",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButtonText: "text-foreground font-medium",
    formFieldLabel: "text-foreground",
    footerActionLink: "text-primary hover:text-primary/90",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground bg-background px-2",
    identityPreviewEditButton: "text-primary hover:text-primary/90",
    formFieldSuccessText: "text-primary",
    alertText: "text-foreground",
    logoBox: "h-8 mb-6",
    logoImage: "h-full w-auto object-contain",
    socialButtonsBlockButton: "border-border hover:bg-muted/50",
    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 font-medium",
    formFieldInput: "bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring",
    footerAction: "mt-6",
    dividerLine: "bg-border",
    alert: "bg-destructive/10 border-destructive text-destructive",
    otpCodeFieldInput: "bg-background border-input text-foreground focus:border-ring",
    formFieldRow: "mb-4",
    main: "w-full",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function AppRoute() {
  const { data: me, isLoading } = useGetMe();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!me) return <Redirect to="/" />;
  if (me.role === "admin") return <Redirect to="/admin" />;
  if (!me.business) return <Onboarding />;
  if (me.business.status === "suspended") return <Suspended />;

  return (
    <Switch>
      <Route path="/app" component={Dashboard} />
      <Route path="/app/productos" component={Productos} />
      <Route path="/app/pedidos" component={Pedidos} />
      <Route path="/app/clientes" component={Clientes} />
      <Route path="/app/ia" component={AsistenteIA} />
      <Route path="/app/mi-tienda" component={MiTienda} />
      <Route path="/app/cupones" component={Cupones} />
      <Route path="/app/perfil" component={Perfil} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AdminRoute() {
  const { data: me, isLoading } = useGetMe();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!me || me.role !== "admin") return <Redirect to="/app" />;

  return (
    <Switch>
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/negocios" component={AdminNegocios} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: { title: "Bienvenido de nuevo", subtitle: "Ingresá a tu cuenta para continuar" },
        },
        signUp: {
          start: { title: "Creá tu cuenta", subtitle: "Digitalizá tu negocio hoy" },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            {/* Auth */}
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />

            {/* Client app */}
            <Route path="/app/*?">
              <Show when="signed-in"><AppRoute /></Show>
              <Show when="signed-out"><Redirect to="/sign-in" /></Show>
            </Route>

            {/* Admin */}
            <Route path="/admin/*?">
              <Show when="signed-in"><AdminRoute /></Show>
              <Show when="signed-out"><Redirect to="/sign-in" /></Show>
            </Route>

            {/* Marketing */}
            <Route path="/">
              <Show when="signed-in"><Redirect to="/app" /></Show>
              <Show when="signed-out"><Home /></Show>
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
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
