# VektraHub

Plataforma SaaS multi-tenant para digitalizar negocios argentinos (Vektra Tech). Incluye sitio de marketing en español, autenticación Clerk, dashboard multi-tenant para clientes y panel de administración.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API server (puerto 8080)
- `pnpm --filter @workspace/vektrahub run dev` — Frontend React+Vite (puerto 21099)
- `pnpm run typecheck` — typecheck completo del monorepo
- `pnpm run build` — typecheck + build de todos los paquetes
- `pnpm --filter @workspace/api-spec run codegen` — regenerar hooks y schemas desde OpenAPI
- `pnpm --filter @workspace/db run push` — push del schema de DB (solo dev)
- Env requeridos: `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19, Vite 7, Wouter, TanStack Query, Tailwind v4, shadcn/ui, Framer Motion
- Auth: Clerk (@clerk/react, @clerk/express, @clerk/themes)
- API: Express 5, contrato OpenAPI-first (Orval)
- DB: PostgreSQL + Drizzle ORM
- Validación: Zod v4, drizzle-zod
- Build: esbuild (CJS bundle para servidor)

## Where things live

- `artifacts/vektrahub/` — Frontend React SaaS
  - `src/App.tsx` — rutas, Clerk provider, guards
  - `src/pages/marketing/` — Home, Soluciones, Demos, DemoRubro, Precios, Calculadora, FAQ, Contacto, Nosotros, Funcionalidades, CasosDeExito
  - `src/pages/app/` — Dashboard, Productos, Pedidos, Clientes, AsistenteIA, Perfil, Onboarding, Suspended
  - `src/pages/admin/` — AdminDashboard, AdminNegocios
  - `src/components/layout/` — Navbar, AppSidebar, AdminSidebar
- `artifacts/api-server/` — Backend Express
  - `src/routes/` — users.ts, products.ts, orders.ts, customers.ts, dashboard.ts, chat.ts, admin.ts
  - `src/middlewares/` — requireAuth.ts, clerkProxyMiddleware.ts
- `lib/api-spec/openapi.yaml` — contrato OpenAPI (source of truth)
- `lib/api-client-react/` — hooks y types generados por Orval
- `lib/db/` — schema Drizzle (users, businesses, products, orders, customers)

## Architecture decisions

- Multi-tenant: cada negocio tiene sus propios datos aislados por `businessId`. Auth via Clerk; el rol admin se setea manualmente en la columna `usersTable.role`.
- API contract-first: OpenAPI spec → Orval → hooks React Query y types. Nunca editar los archivos en `lib/api-client-react/src/generated/`.
- Dark mode first: CSS variables en `:root`, color primario `hsl(168 100% 42%)` (verde-azul eléctrico).
- Chat IA: keyword-matching inteligente sin LLM externo (escalable a OpenAI). Usa el catálogo real de productos del negocio.
- Clerk proxy: todas las llamadas a Clerk van por `/api/__clerk` para evitar bloqueadores de anuncios.
- Rutas Clerk: `/sign-in/*?` y `/sign-up/*?` (con comodín opcional, no `/*`).

## Product

- **Sitio de marketing** (11 páginas en español argentino): Home con hero animado, Soluciones por rubro, Demos interactivas por sector, Precios Starter/Pro, Calculadora de plan, FAQ, Contacto, Nosotros, Funcionalidades, Casos de éxito
- **Dashboard cliente** (`/app/*`): Estadísticas en tiempo real, gestión de productos, pedidos con estados, CRM de clientes, Asistente IA con chat, perfil con upgrade a Pro
- **Panel admin** (`/admin/*`): Estadísticas globales, listado y gestión de todos los negocios (activar, suspender, cambiar plan)
- **Onboarding** de 3 pasos para nuevos clientes

## User preferences

- Todo el contenido en español Argentina (vos, che, etc.)
- Dark mode por defecto, acento verde-azul eléctrico (#00D4AA)
- Sin emojis en el código
- Precios: Starter $25.000/mes, Pro $49.950/mes (ARS)
- Sin Bearer tokens — auth cookie-based

## Gotchas

- Nunca editar `lib/api-client-react/src/generated/` — se regenera con `pnpm --filter @workspace/api-spec run codegen`
- Si se agregan endpoints al OpenAPI, correr codegen antes de usarlos en el frontend
- El rol admin se setea directamente en la DB: `UPDATE users SET role = 'admin' WHERE email = 'admin@example.com'`
- `pnpm run build` falla desde bash (necesita PORT y BASE_PATH del workflow). Usar `typecheck` para verificar.
- Los imports de shadcn van a `@/components/ui/...`

## Pointers

- Ver `pnpm-workspace` skill para estructura del monorepo y TypeScript
- Ver `clerk-auth` skill para configuración de Clerk
