# AGENTS.md (Web)

Next.js 16 App Router client with React 19, Tailwind, TanStack Query, and Feature-Sliced Design (FSD). It talks to the API from the server, not from the browser.

Run from `apps/web` or with `pnpm --filter servemate-client <script>`.

```bash
pnpm dev                 # next dev --turbopack on port 3000
pnpm build               # requires pnpm build:dto from the repo root first
pnpm test                # Vitest
pnpm lint
node scripts/fsd-validator.js src/features/<feature>   # check one feature's structure
```

## Layers

```
src/
  app/        Next.js routes, layouts, server lib (session.ts), API proxy route (api/service/[...params])
  features/   Business features, FSD slices (see below)
  shared/     Reusable UI, hooks, utils, layouts, stores, and API helpers
  providers/  React context providers
  proxy.ts    Route guard (Next 16 "proxy" convention, not "middleware")
  consts.ts   API_BASE_URL resolved from API_URL / NEXT_PUBLIC_API_URL
```

Each feature is a folder under `src/features/<name>/` with slices: `api/`, `hooks/`, `ui/`, `store/` (when needed), `types/`, and `utils/`. `api/` holds `endpoints.ts` and `index.ts`. Reference feature: `src/features/tables/`.

## Rules

- **Import direction:** `app` may import `features` and `shared`. `features` may import `shared`. `features` must not import other `features`. `shared` imports nothing from the other layers.
- **Server calls:** Data that needs the access token goes through server actions or `app/api/service/*`. Do not call the API from client components.
- **Types:** Import request and response types from `@servemate/shared-dto`. Do not duplicate them.
- **Data fetching:** Use TanStack Query hooks in the feature's `hooks/` folder. Keep query keys in one place per feature.
- **Auth:** Session is an iron-session cookie (`servemate_session`). Read it on the server through `src/app/lib/session.ts`. Access tokens are never exposed to client code.
- **Routes:** Public routes are `/login` and `/refresh`. Everything else requires a session. Expired access tokens redirect to `/refresh`.
- **Accessibility:** Interactive elements need labels and keyboard support. The project has `scripts/a11y-audit.js` for checks.

## Gotchas

- `API_URL` and `NEXT_PUBLIC_API_URL` are inlined at build time. After changing them, rebuild.
- `SESSION_SECRET` must be at least 32 characters, or the session module throws on load.
- `next.config.ts` lists LAN addresses in `allowedDevOrigins`. Remove or adjust them for other networks.
- Tests run with Vitest. Keep them next to the code they test or under `src/app/tests/`.
