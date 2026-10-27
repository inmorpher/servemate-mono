---
name: add-api-endpoint
description: Add a new REST endpoint to the ServeMate API, including DTO, validation, role check, service, repository, and tests. Use when the user asks for a new route, endpoint, or API operation.
---

# Add an API endpoint

Reference module: `apps/api/src/drink-items/`. Read it before starting.

## Steps

1. **Contract first.** Add or extend the request and response types and Zod schemas in `packages/dto/src/<domain>/`. Export them from that domain's `index.ts`. Run `pnpm build:dto`.
2. **Repository.** Add the method to `<domain>.repository.interface.ts` and implement it in `<domain>.repository.ts` with Prisma.
3. **Service.** Add the method to `<domain>.service.interface.ts` and implement it in `<domain>.service.ts`. Throw the error classes from `apps/api/src/errors/` for not-found and conflict cases.
4. **Controller.** Add the route to `<domain>.controller.ts`:
   - `@Validate(schema, 'body' | 'params' | 'query')`
   - `@Get`, `@Post`, `@Patch`, or `@Delete` from `src/decorators/httpDecorators.ts`
   - `@Roles([UserRole.ADMIN, ...])` from `src/decorators/Roles.ts`
   - Errors go to `next(err)`.
5. **Tests.** Add or extend `apps/api/src/tests/<domain>/<domain>.service.spec.ts` and `<domain>.controller.spec.ts`. Cover the success path, a validation failure, and a forbidden role.
6. **Verify.** Run `pnpm --filter servemate-service test`. Then run `pnpm build` in `apps/api` to catch type errors.

## Done when

- Tests pass and `pnpm build` succeeds.
- The web side is not changed in this skill. Use `add-web-feature` for that.
