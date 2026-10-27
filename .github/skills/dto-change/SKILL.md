---
name: dto-change
description: Change request, response, or validation shapes in the shared DTO package and propagate them to both the API and the web app. Use when a field, schema, or enum changes in packages/dto.
---

# Change a shared DTO

`packages/dto` is consumed by both apps through its built `dist/`. Stale builds cause confusing type errors.

## Steps

1. Edit the schema or type in `packages/dto/src/<domain>/`. Keep Zod schemas and TypeScript types in sync. Use the existing files as the model.
2. Run `pnpm build:dto` from the repo root.
3. Find all usages and update them:
   - API: `grep -rn "<TypeOrSchemaName>" apps/api/src`
   - Web: `grep -rn "<TypeOrSchemaName>" apps/web/src`
4. If the field is stored, update the Prisma model and create a migration. Use the `prisma-migration` skill.
5. Verify:
   - `pnpm build:dto`
   - `pnpm --filter servemate-service build`
   - `pnpm --filter servemate-client build`
   - `pnpm test`

## Watch for

- Renaming a field breaks the web app silently at runtime if the type is cast. Search for string keys too.
- Making a field required can break existing API clients. Prefer optional fields when the change is additive.
