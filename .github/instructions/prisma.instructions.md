---
description: "Rules for the Prisma schema and migrations."
applyTo: "apps/api/prisma/**"
---

# Prisma rules

- The schema is split across `prisma/schema.prisma`, `prisma/models/`, `prisma/enums.prisma`, and `prisma/generators/`. Edit the file that owns the model.
- Create migrations with `pnpm exec prisma migrate dev --name <short_snake_case>`. Never edit an applied migration.
- After any schema change, run `pnpm exec prisma generate`, then update the repository and the DTOs in `packages/dto`.
- Never run `migrate reset` against a shared or production database.
