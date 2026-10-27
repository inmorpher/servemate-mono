# AGENTS.md (API)

Express 5 REST and WebSocket API. Uses Inversify for dependency injection, Prisma 7 with PostgreSQL, and Zod for validation through `@servemate/shared-dto`.

Run from `apps/api` or with `pnpm --filter servemate-service <script>`.

```bash
pnpm dev                 # tsx watch main.ts on port 3001 (set PORT=3001 in .env)
pnpm test                # Jest with coverage
pnpm build               # tsc to dist/
pnpm exec prisma generate
pnpm exec prisma migrate dev --name <name>
```

## Module layout

Each domain lives in `src/<domain>/` (for example `drink-items`, `tables`, `orders`) and follows the same files:

- `<domain>.controller.ts`: HTTP routes. Extends `BaseController`. Uses decorators from `src/decorators/httpDecorators.ts`.
- `<domain>.service.interface.ts` and `<domain>.service.ts`: business logic. Depends on the repository interface only.
- `<domain>.repository.interface.ts` and `<domain>.repository.ts`: Prisma access.
- `<domain>.container.ts`: an Inversify `ContainerModule` that binds the three classes above.

Reference module: `src/drink-items/`. Copy its shape for new modules.

Registration steps for a new module:

1. Add symbols to `TYPES` in `src/types.ts`.
2. Export the container module and load it in `main.ts`.
3. Export new DTOs from `packages/dto/src` and rebuild with `pnpm build:dto`.

## Rules

- Validate request bodies and params with the Zod schemas from `@servemate/shared-dto` using `@Validate(schema, 'body' | 'params' | 'query')`.
- Protect routes with `@Roles([...])`. Roles come from the Prisma `UserRole` enum.
- Inject dependencies with `@inject(TYPES.X)`. Do not instantiate services or repositories by hand.
- Throw the HTTP error classes in `src/errors/`. The global exception filter formats the response.
- Log through `ILogger` (`TYPES.ILogger`), not `console.log`.
- Environment variables are validated in `env.ts` (Zod). Add new variables there and in `apps/api/README.md`.
- Tests go in `src/tests/<domain>/` as `*.spec.ts`. Cover the service and the controller. Use the existing specs as templates.

## Gotchas

- `main.ts` is the composition root. A container module that is not loaded there is not wired. Check startup logs after adding a module.
- Prisma schema is split across `prisma/models/`, `prisma/enums.prisma`, and `prisma/generators/`. Edit the right file.
- `env.ts` requires `PRODUCTION`, `LOG_TO_FILE`, and the `JWT_*` variables. Missing values stop startup.
- CORS allowlist is in `src/app.ts`. Update it when the web origin changes.
- The MCP server (`src/mcp/server.ts`) is a separate entrypoint, started with `pnpm mcp`.
