# ServeMate API

Express 5 + TypeScript REST API for ServeMate. It uses Prisma with PostgreSQL, Inversify for dependency injection, Zod for validation, and JWT access and refresh tokens. It also exposes a read-only MCP server for database access.

Part of the [ServeMate monorepo](../../README.md).

## Stack

- Express 5, TypeScript, Prisma 7 (PostgreSQL adapter)
- Inversify (DI), Zod and class-validator (validation)
- JWT access and refresh tokens, bcrypt password hashing
- WebSocket (`ws`) for workspace events
- OpenTelemetry, tslog for logging
- Jest for tests

## Source layout

```
apps/api/
├── main.ts            # entry point
├── env.ts             # env validation (Zod), exports ENV
├── src/
│   ├── app.ts         # Express app and server setup
│   ├── <domain>/      # controllers, services, and routes per domain
│   ├── decorators/    # caching and invalidation decorators
│   ├── middleware/    # auth and request middleware
│   ├── mcp/           # read-only MCP server
│   ├── openapi/       # OpenAPI generation
│   ├── scripts/       # seed data scripts
│   └── tests/         # Jest tests
├── prisma/            # schema, migrations, generators
└── generated/         # openapi.json and api-types.ts
```

Business logic lives in services. Controllers stay thin. Shared DTOs live in `packages/dto`.

## Environment

Create `apps/api/.env`. Do not commit real secrets.

| Variable | Description |
| --- | --- |
| `PRODUCTION` | `true` in production, `false` locally |
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | HTTP port. Defaults to `3000`. Locally use `3001`, because the web app runs on `3000`. |
| `LOG_TO_FILE` | `true` to write logs to a file |
| `JWT_SECRET` | Secret for access tokens |
| `JWT_REFRESH` | Secret for refresh tokens |
| `JWT_EXPIRES_IN` | Access token lifetime, for example `10m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime, for example `7d` |

If you change `PORT`, update `API_URL` and `NEXT_PUBLIC_API_URL` in `apps/web/.env` to match.

## Database

Run from the monorepo root or from `apps/api`:

```bash
pnpm --filter servemate-service exec prisma migrate dev   # apply migrations
pnpm --filter servemate-service exec prisma generate      # regenerate the Prisma client
```

Seed data (optional):

```bash
pnpm --filter servemate-service generate-users
pnpm --filter servemate-service generate-tables
pnpm --filter servemate-service generate-fnb
pnpm --filter servemate-service generate-orders
```

Prisma generation can be fragile in pnpm setups. If the client looks stale after a schema change, run `prisma generate` again.

## Scripts

Run from `apps/api`, or prefix with `pnpm --filter servemate-service` from the root.

| Script | Description |
| --- | --- |
| `dev` | Start with `tsx watch main.ts` |
| `build` | Clean `dist/` and compile with `tsc` |
| `start` | Run `dist/main.js` with nodemon |
| `start:prod` | Run `dist/main.js` with PM2 (requires `pm2` installed globally) |
| `start:cluster` | Run 4 PM2 cluster instances |
| `test` | Run Jest with coverage |
| `mcp` | Start the MCP server from source |
| `mcp:prod` | Start the MCP server from `dist/` |
| `openapi:generate` | Generate client types from OpenAPI into `generated/` |
| `generate-users`, `generate-tables`, `generate-fnb`, `generate-orders` | Seed sample data |

## Docker

Build from `apps/api`. The build context is the monorepo root:

```bash
cd apps/api
docker compose up --build app      # API, published on host port 3001
docker compose up --build mcp      # MCP server
```

`docker-compose.yml` is for production-like runs. `docker-compose.dev.yml` mounts the monorepo for live reload and uses `Dockerfile.dev`. Both load variables from `apps/api/.env` through `env_file`.

### Deployment

The API runs on its own machine, in Docker. The web app calls it from the server (Vercel), so the API needs a public HTTPS URL, for example behind Caddy or nginx. `apps/api/.env` must exist on that machine. The image does not contain it, because `.dockerignore` excludes `.env`.

The CORS allowlist in `src/app.ts` is hardcoded for local development. The browser never calls the API directly, so production only needs the web app's origin.

## MCP server

The MCP server gives read-only database access to MCP clients such as Claude Desktop:

```bash
pnpm --filter servemate-service mcp
```

## Tests

```bash
pnpm --filter servemate-service test
```

Jest config is in `jest.config.js`. Tests live under `src/tests`.

## Notes

- Routes are under `/api`. Protected routes need `Authorization: Bearer <accessToken>`.
- The refresh token is an HttpOnly cookie managed by the server.
- Prisma dynamic `orderBy` fields must be validated against an allowlist before use. Do not pass raw sort names from requests into Prisma.
- Read and write caching uses decorators in `src/decorators`. When you mutate data, invalidate the related cache.
