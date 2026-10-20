# ServeMate Monorepo

ServeMate is a restaurant management system. This monorepo contains the backend API and the web client.

## Structure

```
ServeMate-monorepo/
├── apps/
│   ├── api/        # servemate-service: Node.js + Express + Prisma (REST API, MCP server)
│   └── web/        # servemate-client: Next.js 16 + React 19 + Tailwind CSS 4
├── packages/
│   └── dto/        # @servemate/shared-dto: DTOs shared by API and web
├── package.json
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js 24 (the Docker image uses `node:24.19.0`)
- pnpm 11.1.2 (`packageManager` in the root `package.json`)
- PostgreSQL, reachable through `DATABASE_URL`
- Docker (optional, for containerized API runs)

Enable the pinned pnpm version with Corepack:

```bash
corepack enable
corepack prepare pnpm@11.1.2 --activate
```

## Getting Started

### 1. Install dependencies

Run from the monorepo root. pnpm installs all workspace packages at once:

```bash
pnpm install
```

### 2. Configure environment variables

Create the env files for each app. Do not commit real secrets.

**`apps/api/.env`**

| Variable | Description |
| --- | --- |
| `PRODUCTION` | Set to `true` in production |
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | API port. Use a port other than the web app's `3000`, for example `3001` |
| `LOG_TO_FILE` | Write logs to a file |
| `TOKEN_CACHE_TTL` | Cache TTL for tokens, in seconds |
| `JWT_SECRET` | Secret for access tokens |
| `JWT_REFRESH` | Secret for refresh tokens |
| `JWT_EXPIRES_IN` | Access token lifetime, for example `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime, for example `7d` |

**`apps/web/.env`**

| Variable | Description |
| --- | --- |
| `API_URL` | Backend URL used by the Next.js server |
| `NEXT_PUBLIC_API_URL` | Backend URL used by the browser |
| `SESSION_SECRET` | Secret for the `iron-session` cookie |

### 3. Set up the database

The API uses Prisma with the schema in `apps/api/prisma/schema.prisma`:

```bash
pnpm --filter servemate-service exec prisma migrate dev
```

To fill the database with sample data:

```bash
pnpm --filter servemate-service generate-users
pnpm --filter servemate-service generate-tables
pnpm --filter servemate-service generate-fnb
pnpm --filter servemate-service generate-orders
```

### 4. Build the shared DTO package

The API and web app import types from `@servemate/shared-dto`:

```bash
pnpm build:dto
```

## Running the Project

Start the API and the web client together:

```bash
pnpm dev
```

Or run them separately:

```bash
pnpm --filter servemate-service dev   # API, watch mode
pnpm --filter servemate-client dev    # Web, http://localhost:3000
```

## Backend API (`apps/api`)

- Built with Express 5, TypeScript, Prisma 7 (PostgreSQL adapter), Inversify, and Zod.
- Authentication uses JWT access and refresh tokens.
- Full endpoint reference: [apps/api/README.md](apps/api/README.md).

### Scripts

| Command | Description |
| --- | --- |
| `pnpm --filter servemate-service dev` | Start the API with `tsx watch` |
| `pnpm --filter servemate-service build` | Compile TypeScript to `dist/` |
| `pnpm --filter servemate-service start:prod` | Run the built app with PM2 |
| `pnpm --filter servemate-service start:cluster` | Run 4 PM2 cluster instances |
| `pnpm --filter servemate-service test` | Run Jest with coverage |
| `pnpm --filter servemate-service openapi:generate` | Generate client types from OpenAPI |
| `pnpm --filter servemate-service mcp` | Start the read-only MCP server |

### Docker

Build from the `apps/api` folder. The build context is the monorepo root:

```bash
cd apps/api
docker compose up --build app
```

The image runs `node dist/main.js` on port `3000`.

### MCP server

The MCP server gives read-only database access to MCP clients such as Claude Desktop:

```bash
pnpm --filter servemate-service mcp
```

## Web Client (`apps/web`)

- Built with Next.js 16 (Turbopack in dev), React 19, Tailwind CSS 4, and shadcn/ui components.
- Server state uses TanStack Query. Client state uses Zustand. Forms use React Hook Form with Zod.

### Scripts

| Command | Description |
| --- | --- |
| `pnpm --filter servemate-client dev` | Start the dev server at `http://localhost:3000` |
| `pnpm --filter servemate-client build` | Create a production build |
| `pnpm --filter servemate-client start` | Serve the production build |
| `pnpm --filter servemate-client lint` | Run ESLint |
| `pnpm --filter servemate-client test` | Run Vitest |

## Tests

Run all tests from the root:

```bash
pnpm test
```

This runs `test:api` (Jest) and `test:web` (Vitest).

## Formatting

- Prettier is used in both apps. The web app also uses `prettier-plugin-tailwindcss` to sort class names.

## Contributing

1. Create a feature branch from `main`.
2. Use conventional commit messages, for example `feat: add order filters` or `fix: correct total amount`.
3. Run `pnpm test` and `pnpm --filter servemate-client lint` before opening a pull request.
