---
name: VektraHub architecture
description: Key decisions for the VektraHub multi-tenant SaaS Argentina project
---

## Key decisions

- **Admin role**: set manually in DB (`UPDATE users SET role = 'admin' WHERE email = '...'`). No self-service admin escalation.
- **Clerk routes**: must be `/sign-in/*?` and `/sign-up/*?` (optional wildcard). Plain `/sign-in/*` breaks Clerk routing.
- **Auth**: cookie-based only — no Bearer tokens. Clerk proxy at `/api/__clerk` (via `clerkProxyMiddleware`).
- **OpenAPI-first**: never edit `lib/api-client-react/src/generated/`. Always change `lib/api-spec/openapi.yaml` then run codegen.
- **Multi-tenant isolation**: every data table has `businessId` FK. Business is linked to `usersTable` via `ownerId`.
- **Chat IA**: keyword-matching without external LLM. Context built from real product catalog. Scalable to OpenAI by replacing `generateSmartReply`.
- **Dark mode first**: `:root` has dark defaults. Color primary `hsl(168 100% 42%)` = #00D4AA (electric blue-green).
- **Spanish Argentina**: all copy uses "vos", "negocio", "empezar", "$" for ARS. Prices: Starter $25.000/mes, Pro $49.950/mes.

**Why:** The client requested a professional Argentina-focused SaaS. Clerk was chosen for its multi-tenant auth, shadcn/ui for the component library, and OpenAPI-first to keep the contract explicit and generate typed hooks.

**How to apply:** Before adding routes, update `lib/api-spec/openapi.yaml` and run codegen. Before adding pages, check generated hooks in `lib/api-client-react/src/generated/api.ts`.
