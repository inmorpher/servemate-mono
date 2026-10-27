---
name: deploy-check
description: Pre-deployment checklist for the ServeMate API (Docker on its own host) and web app (Vercel). Use before deploying, or when asked whether a change is deployable, or when debugging a build or container startup failure.
---

# Deployment check

Read the Deployment sections in `README.md`, `apps/api/README.md`, and `apps/web/README.md` first.

## API (Docker, separate host)

1. Build the image from the repo root context:
   `docker build -f apps/api/Dockerfile -t servemate-api .`
2. Confirm `apps/api/docker-compose.yml` passes every required variable: `PRODUCTION`, `LOG_TO_FILE`, `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`. Compare against `apps/api/env.ts`.
3. Check the published port matches the web app's `API_URL`.
4. Confirm the CORS allowlist in `apps/api/src/app.ts` includes the production web origin.
5. Confirm `.env` is not copied into the image. The root `.dockerignore` must exclude it.

## Web (Vercel)

1. Root Directory is `apps/web`, with "include source files outside Root Directory" enabled.
2. The build command builds the DTO package first:
   `cd ../.. && pnpm --filter @servemate/shared-dto build && cd apps/web && pnpm build`
3. Set `API_URL` and `SESSION_SECRET` (32+ characters) for Production and Preview. Redeploy after changing `API_URL`, because it is inlined at build time.
4. `API_URL` must be a public HTTPS URL. A `localhost` value only works locally.

## Report

Return a short list: passed checks, failed checks with file and line, and anything that needs a human decision such as secrets or DNS.
