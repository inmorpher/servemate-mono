---
name: servemate-domain-api-client
description: Create and maintain feature-scoped API clients and React Query hooks for Servemate domains. Use when adding a new entity client, wiring backend methods into a feature, or standardizing query/mutation hooks across the app.
metadata:
    author: copilot
    version: '1.0.0'
---

# Servemate Domain API Client Skill

Use this skill when building or refactoring a domain API layer in the Servemate client.

## Goal

Keep UI components free of fetch logic. Put HTTP routes in `api/endpoints.ts`, transport methods in `api/client.ts`, and React Query logic in feature hooks.

## Mandatory first step

Before writing code for a domain, consult the current Servemate backend method catalog through the MCP-backed backend API workflow and confirm:

- route
- HTTP verb
- request body shape
- response shape
- whether the response is `json`, `text`, or `void`

Do not guess from old code when the backend catalog exists.

## Recommended structure

- `src/features/<domain>/api/endpoints.ts` — route constants only
- `src/features/<domain>/api/client.ts` — typed HTTP methods
- `src/features/<domain>/hooks/useGet*.ts` — query hooks for reads
- `src/features/<domain>/hooks/useCreate*.ts` / `useUpdate*.ts` / `useDelete*.ts` — mutation hooks for writes
- `src/features/<domain>/ui/*` — components that consume hooks, not raw fetch

## Client rules

- Use shared helpers like `buildApiUrl`, `buildQueryParams`, and `apiRequest`.
- Prefer explicit client types such as `OrderApiClient`.
- Use typed DTOs from `@servemate/dto` for request and response contracts.
- Return `Promise<void>` for `void` backend responses.
- Return `Promise<T>` for JSON payloads.
- Use text parsing only when the backend contract says the response is a string.
- Do not parse JSON for `204` or other no-content endpoints.

## Hook rules

- Use `useQuery` for GET requests.
- Use `useMutation` for POST, PATCH, PUT, and DELETE.
- Keep query keys stable and derived from the same criteria used for the URL.
- Wrap query hooks around the domain client, not around raw fetch.
- Expose mutation hooks that accept typed variables objects.

## Feature integration rules

- Components like lists, cards, drawers, and action menus should invoke hooks, not fetch directly.
- If a component performs domain actions, wire the action menu to typed mutation hooks.
- Keep any optimistic updates, invalidation, or refetch behavior in the hook layer.

## Validation checklist

- Confirm the backend catalog matches the client method signatures.
- Check the feature page and list component use the new hooks.
- Run TypeScript validation on the touched files.
- Remove placeholder console logs and dead imports.

## Example behavior

For a domain like orders:

- `getOrders` and `getMeta` should be query methods.
- `createOrder`, `updateOrderItems`, `updateOrderProperties`, `printOrderItems`, `callOrderItems`, and `deleteOrder` should be mutation methods.
- A list component may call `print`, `call`, or `delete` directly from an action menu, but it should still use a typed hook or client method under the hood.
