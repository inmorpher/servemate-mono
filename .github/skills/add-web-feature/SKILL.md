---
name: add-web-feature
description: Scaffold a new feature in the ServeMate web app following Feature-Sliced Design, with API endpoints, query hooks, and UI. Use when the user asks for a new screen, page section, or feature in apps/web.
---

# Add a web feature

Reference feature: `apps/web/src/features/tables/`. Read it before starting.

## Steps

1. **Types.** Import request and response types from `@servemate/shared-dto`. Do not copy them into the feature.
2. **Create the slice folders** under `apps/web/src/features/<name>/`:
   - `api/endpoints.ts` with `as const` path constants, and `api/index.ts` that re-exports them and the server calls.
   - `hooks/` with TanStack Query hooks, one per query or mutation.
   - `ui/` with presentational components.
   - `utils/` and `types/` only when needed. Add `store/` only for client state that must outlive a component.
3. **Server data access.** Call the API from server actions or from `src/app/api/service/*`, never from client components. Access tokens stay on the server.
4. **Route.** Add the page under `src/app/(protected)/` (or the matching route group). Keep the page thin and compose the feature's UI in it.
5. **Accessibility.** Give interactive elements labels and keyboard support.
6. **Verify.**
   - `node scripts/fsd-validator.js src/features/<name>`
   - `pnpm --filter servemate-client lint`
   - `pnpm --filter servemate-client test`
   - `pnpm --filter servemate-client build` if routing or server code changed.

## Rules

- Features do not import other features. Move shared code to `src/shared/`.
- Do not add new environment variables without updating `apps/web/README.md`.
