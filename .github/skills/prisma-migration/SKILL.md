---
name: prisma-migration
description: Change the ServeMate Prisma schema and create a safe migration for PostgreSQL. Use when adding or changing a model, field, relation, enum, or index.
---

# Prisma migration

The schema is split across `apps/api/prisma/schema.prisma`, `prisma/models/`, `prisma/enums.prisma`, and `prisma/generators/`. Edit the file that owns the model.

## Steps

1. Edit the model in the correct file under `apps/api/prisma/`.
2. Create the migration from `apps/api`:
   `pnpm exec prisma migrate dev --name <short_snake_case_name>`
3. Review the generated SQL in `prisma/migrations/<timestamp>_<name>/migration.sql`. Check for destructive changes such as dropped columns or type changes.
4. Regenerate the client: `pnpm exec prisma generate`.
5. Update the repository in `src/<domain>/<domain>.repository.ts`, then the DTOs in `packages/dto` (use `dto-change`).
6. Verify: `pnpm --filter servemate-service test` and `pnpm --filter servemate-service build`.

## Rules

- Never edit a migration that has already been applied.
- Never run `prisma migrate reset` against a shared or production database.
- For a non-null column on existing data, add a default or backfill in the same migration.
