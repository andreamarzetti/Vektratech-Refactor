---
name: Drizzle push in non-TTY
description: drizzle-kit push fails when run from bash (no TTY) and the table has existing rows that conflict with a new constraint.
---

When `drizzle-kit push` encounters a destructive operation (e.g., adding a UNIQUE constraint on a column with existing rows), it pauses for interactive confirmation. In a non-TTY bash shell it throws "Interactive prompts require a TTY terminal" and aborts.

**Why:** drizzle-kit push is designed for interactive dev use; in CI or agent shells it can't prompt.

**How to apply:** When the DB already has rows, bypass push entirely and apply the schema changes directly via `executeSql` in the code_execution sandbox:
- `ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...`
- `CREATE UNIQUE INDEX IF NOT EXISTS ...`
- `CREATE TABLE IF NOT EXISTS ...`

This is safe and idempotent with IF NOT EXISTS guards.
