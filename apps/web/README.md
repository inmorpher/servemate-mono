# ServeMate Client

Next.js 16 (App Router) + React 19 web client for ServeMate. It uses Tailwind CSS 4 with shadcn/ui, TanStack Query for server state, Zustand for client state, and React Hook Form with Zod for forms. Sessions are stored in an `iron-session` cookie.

Part of the [ServeMate monorepo](../../README.md).

## Stack

- Next.js 16, React 19, Turbopack in dev
- Tailwind CSS 4, shadcn/ui, Radix UI, lucide-react
- TanStack Query (server state), Zustand (client state)
- React Hook Form + Zod (forms)
- iron-session (cookie session), date-fns, Vitest

## Source layout

The app follows Feature-Sliced Design (FSD):

```
apps/web/src/
├── app/          # Next.js routes: (auth) login, (protected) pages, api routes
├── features/     # business features: auth, orders, tables, reservations, payments, ...
├── shared/       # reusable api clients, components, hooks, stores, layouts, utils
├── providers/    # QueryProvider, SidebarProvider
├── consts.ts     # API base URL
└── proxy.ts      # route guard (login redirect and token refresh)
```

FSD convention: higher layers import from lower ones (`app` -> `features` -> `shared`), never the reverse.

## Environment

Create `apps/web/.env`. Do not commit real secrets.

| Variable | Description |
| --- | --- |
| `API_URL` | Backend URL used by the Next.js server, for example `http://localhost:3001/api` |
| `NEXT_PUBLIC_API_URL` | Backend URL used by the browser. Usually the same as `API_URL` |
| `SESSION_SECRET` | Secret for the `iron-session` cookie. Required, at least 32 characters. The app throws on startup otherwise |

Both must point to the API: `http://localhost:3001/api` locally, `https://api.example.com/api` in production. Next.js inlines them at build time, so redeploy after changing them.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm --filter servemate-client dev` | Dev server with Turbopack at `http://localhost:3000` |
| `pnpm --filter servemate-client build` | Production build |
| `pnpm --filter servemate-client start` | Serve the production build |
| `pnpm --filter servemate-client lint` | ESLint |
| `pnpm --filter servemate-client test` | Vitest |

Helper scripts live in `scripts/` and run with Node:

- `node scripts/fsd-validator.js src/features/orders`: checks the FSD folder structure
- `scripts/analyze-dependencies.js`: detects circular imports and side effects
- `scripts/a11y-audit.js`: checks keyboard navigation and semantic HTML

## Authentication and routing

- `src/proxy.ts` guards all protected routes. `/login` and `/refresh` are public.
- Without a logged-in session, the proxy redirects to `/login?callbackUrl=...`.
- When the access token has expired, it redirects to `/refresh?returnUrl=...`.
- The root `/` redirects to `/cpanel`.

Tokens are stored in the encrypted, HttpOnly `servemate_session` cookie, not in `localStorage`.

## Deployment (Vercel)

1. Import the repository in Vercel and set **Root Directory** to `apps/web`. Enable "Include source files outside of the Root Directory", because the app imports `@servemate/shared-dto`.
2. Set the build command so the DTO package is built first:

   ```bash
   cd ../.. && pnpm --filter @servemate/shared-dto build && cd apps/web && pnpm build
   ```

3. Add `API_URL`, `NEXT_PUBLIC_API_URL`, and `SESSION_SECRET` for Production and Preview.
4. The API must be reachable over public HTTPS. Vercel cannot reach LAN addresses such as `192.168.x.x`.
5. Set the function region close to the API machine to reduce latency.

## Notes

- Forms use React Hook Form with Zod schemas. Keep the schemas next to the feature that uses them.
- Shared request and response types come from `@servemate/shared-dto`. Run `pnpm build:dto` from the root after changing them.
- Server state belongs in TanStack Query. Use Zustand only for UI state that does not come from the API.
