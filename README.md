# ServeMate

ServeMate is a restaurant management system. This monorepo contains the backend API and the web client, plus a shared DTO package.

## Structure

```
ServeMate-monorepo/
├── apps/
│   ├── api/        # servemate-service: Express + Prisma REST API
│   └── web/        # servemate-client: Next.js + React client
├── packages/
│   └── dto/        # @servemate/shared-dto: types and schemas shared by API and web
├── package.json
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js 24
- pnpm 11.1.2 (pinned in the root `package.json`)
- PostgreSQL, reachable through `DATABASE_URL`
- Docker (optional, for containerized API runs)

Enable the pinned pnpm version with Corepack:

```bash
corepack enable
corepack prepare pnpm@11.1.2 --activate
```

## Getting started

1. Install dependencies from the repository root:

   ```bash
   pnpm install
   ```

2. Configure environment variables. Each app has its own `.env` file. Do not commit real secrets.

   - `apps/api/.env`: database URL, JWT secrets, port, and token lifetimes.
   - `apps/web/.env`: backend URLs and the session secret.

3. Set up the database. The API uses Prisma with the schema in `apps/api/prisma/`:

   ```bash
   pnpm --filter servemate-service exec prisma migrate dev
   ```

   Optionally, fill the database with sample data:

   ```bash
   pnpm --filter servemate-service generate-users
   pnpm --filter servemate-service generate-tables
   pnpm --filter servemate-service generate-fnb
   pnpm --filter servemate-service generate-orders
   ```

4. Build the shared DTO package. The API and the web app import types from `@servemate/shared-dto`:

   ```bash
   pnpm build:dto
   ```

## Running

Start the API (port `3001`) and the web client (port `3000`) together:

```bash
pnpm dev
```

Or run them separately:

```bash
pnpm --filter servemate-service dev   # API in watch mode
pnpm --filter servemate-client dev    # Web at http://localhost:3000
```

## Testing

```bash
pnpm test                                    # API (Jest) and web (Vitest)
pnpm --filter servemate-client lint          # web lint
```

## Deployment

- **Web** (`apps/web`) runs on Vercel. It builds the shared DTO package first. See [apps/web/README.md](apps/web/README.md#deployment-vercel).
- **API** (`apps/api`) runs in Docker on a separate machine, behind HTTPS. See [apps/api/README.md](apps/api/README.md#deployment).

The web app calls the API from the server, so the API needs a public HTTPS URL.

## Root scripts

| Command | Description |
| --- | --- |
| `pnpm install` | Install all workspace packages |
| `pnpm build:dto` | Build `@servemate/shared-dto` |
| `pnpm dev` | Run API and web in parallel |
| `pnpm test` | Run API and web test suites |
| `pnpm test:api` | Run API tests only |
| `pnpm test:web` | Run web tests only |

## Apps

- [`apps/api`](apps/api): backend service, see its README for scripts, deployment, and the MCP server.
- [`apps/web`](apps/web): web client, see its README for scripts and architecture.
- [`packages/dto`](packages/dto): shared DTOs. Rebuild it after changing shared types.

## Contributing

1. Create a feature branch from `main`.
2. Use conventional commit messages, for example `feat: add order filters` or `fix: correct total amount`.
3. Run `pnpm test` and `pnpm --filter servemate-client lint` before opening a pull request.
