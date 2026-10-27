---
description: "Rules for the shared DTO package, which both apps depend on."
applyTo: "packages/dto/**"
---

# Shared DTO rules

- This package is the single source of truth for request and response shapes, Zod schemas, and enums.
- Both apps import `@servemate/shared-dto` from `dist/`. Run `pnpm build:dto` after any change, or the apps will use stale types.
- Changing a schema changes validation in the API and in the web app. Run `pnpm test` from the repo root.
- Do not add app-specific code here.
