# AGENTS.md

Guidance for AI coding agents working in this repository. Keep changes small, follow the existing patterns, and verify with the commands listed below.

## What this is

ServeMate is a restaurant management system in a pnpm monorepo:

| Path | Package | Role |
| --- | --- | --- |
| `apps/api` | `servemate-service` | REST + WebSocket API (Express 5, Inversify, Prisma 7, PostgreSQL) |
| `apps/web` | `servemate-client` | Web client (Next.js 16 App Router, React 19, FSD architecture) |
| `packages/dto` | `@servemate/shared-dto` | Shared DTOs, Zod schemas, and enums used by both apps |

Local ports: web `3000`, API `3001`.

## Commands

Run from the repository root.

```bash
pnpm install                 # install all workspaces
pnpm build:dto               # build shared DTOs; required before building or running either app
pnpm dev                     # API and web together
pnpm test                    # API (Jest) and web (Vitest)
pnpm --filter servemate-service exec prisma generate   # after any Prisma schema change
```

Before finishing a task, run the narrowest relevant check, then `pnpm test` if the change crosses packages.

## Architecture rules

- **Shared DTO is the contract.** Request and response shapes, Zod schemas, and enums live in `packages/dto/src`. Change them there, rebuild with `pnpm build:dto`, and use them from both apps. Do not redefine them locally.
- **The browser never calls the API directly.** The web app calls the API from the Next.js server (server actions and `app/api/service/*`). Auth tokens stay in an httpOnly iron-session cookie.
- **Web reads `API_URL` at build time.** Changing it requires a rebuild.
- **Database access goes through Prisma.** Schema changes are made in `apps/api/prisma` and need a migration.

## Conventions

- TypeScript strict mode in both apps. Do not use `any` without a reason in a comment.
- API code follows the module layout described in `apps/api/AGENTS.md`.
- Web code follows Feature-Sliced Design described in `apps/web/AGENTS.md`.
- Commit messages use the prefixes `feat:`, `ref:`, `upt:`. Do not push unless asked.
- Never commit `.env` files or secrets. `SESSION_SECRET` and `JWT_*` values come from the environment.

## Where to look

- Deployment: root `README.md` (Deployment section), `apps/api/README.md`, `apps/web/README.md`.
- Agent skills for repeatable tasks: `.github/skills/`.
- File-scoped rules: `.github/instructions/`.

## Stale docs

If you change behavior that a README describes, update that README in the same change. Prefer pointing to code over copying it, so docs stay accurate.
