---
description: "Rules for API domain modules: controllers, services, repositories, and containers."
applyTo: "apps/api/src/**/*.ts"
---

# API module rules

- Follow the layout in `apps/api/AGENTS.md`. Reference module: `apps/api/src/drink-items/`.
- Controllers call services only. They never import repositories or Prisma.
- Services depend on the repository interface (`*.repository.interface.ts`), not the implementation.
- Every route that changes data has `@Validate(...)` and `@Roles([...])`.
- New symbols go into `TYPES` in `apps/api/src/types.ts`. Load new container modules in `apps/api/main.ts`.
- Use `ILogger` for logs.
