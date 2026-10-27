---
description: "Rules for web feature slices under Feature-Sliced Design."
applyTo: "apps/web/src/features/**"
---

# Web feature rules

- Follow the FSD layout in `apps/web/AGENTS.md`. Reference feature: `apps/web/src/features/tables/`.
- A feature must not import from another feature. Move shared code to `src/shared/`.
- Put data hooks in `hooks/`, endpoints in `api/endpoints.ts`, and presentational components in `ui/`.
- Import request and response types from `@servemate/shared-dto`.
- Run `node scripts/fsd-validator.js src/features/<name>` after adding or moving files.
