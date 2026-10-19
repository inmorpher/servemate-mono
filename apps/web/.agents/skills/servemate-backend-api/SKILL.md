---
name: servemate-backend-api
description: 'Use when working with the Servemate backend API, MCP-served method catalog, auth flows, or when you need the exact HTTP method, route, input schema, output schema, and response-handling rules for backend integrations.'
metadata:
    author: copilot
    version: '1.0.0'
---

# Servemate Backend API

Use this skill whenever the task touches Servemate backend methods, request/response contracts, or client code that calls the backend through the API proxy.

## When to use

Use this skill for:

- Mapping backend methods to HTTP verbs and routes
- Implementing or updating client calls through `/api/service`
- Handling auth, refresh, logout, and current-user flows
- Interpreting empty responses, string responses, and object payloads
- Updating forms, hooks, stores, or API helpers that depend on Servemate backend contracts

## Core rules

1. Always route client requests through the API proxy pattern used by this project. Do not call backend URLs directly.
2. Before adding or changing a backend integration, check the method catalog for the exact route, verb, required fields, and response shape.
3. Treat 204 responses as no-content responses. Do not parse them as JSON.
4. Treat string responses as plain success messages, not objects.
5. Treat auth and refresh flows as token-bound operations that must preserve the proxy/session flow.
6. If a response shape is not covered by the catalog, verify the backend contract before coding against it.

## Backend method groups

Use the reference file for the exact controller-by-controller mapping and handling notes.

## Response-handling checklist

- GET returning an object: parse as JSON and type it explicitly.
- GET returning `object | null`: handle the null case in UI and state.
- POST/PATCH/DELETE returning `null`: use `response.ok` and the status code, not body parsing.
- POST/PUT/DELETE returning a string: read as text and show or log the message directly.
- Auth responses: persist or refresh tokens only through the existing session/proxy flow.

## Editing guidance

When changing API-related code:

- Prefer shared DTOs and existing endpoint constants over ad hoc shapes.
- Keep method-specific logic in the domain feature that owns the workflow.
- If a method returns filtered metadata, update the filter hook/store instead of embedding parsing logic in the UI.
- If a method changes response semantics, update the wrapper or hook once, not every consumer.

## Reference

See [methods](references/methods.md) for the current Servemate catalog snapshot and handling notes.
