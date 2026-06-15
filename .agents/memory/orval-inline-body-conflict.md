---
name: Orval inline body naming conflict
description: Inline request body schemas in OpenAPI generate type names that clash with the types barrel export in api-zod.
---

Orval generates a named TypeScript type AND a named Zod schema for inline request bodies (e.g. `CreateMpPreferenceBody`, `ValidateStoreCouponBody`). The api-zod package re-exports from both `./generated/api` (Zod schemas) and `./generated/types/` (TS types), causing TS2308 "already exported" errors.

**Why:** Both barrels emit the same identifier; wildcard re-exports (`export *`) cannot resolve the ambiguity automatically.

**How to apply:** Always use named `$ref` components for request body schemas instead of inline schemas. Add the input schema to `components/schemas` in the OpenAPI YAML, then reference it: `schema: { $ref: "#/components/schemas/MyInput" }`. This makes orval generate the type only once, avoiding the barrel collision.
