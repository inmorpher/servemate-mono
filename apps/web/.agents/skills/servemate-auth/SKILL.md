---
name: servemate-auth
description: Understand and implement the Servemate client authentication flow, including login, session storage, token refresh, route protection, and protected tab navigation without URL sync.
metadata:
    author: copilot
    version: '1.0.0'
---

# Servemate Auth Skill

Use this skill when working on login, logout, token refresh, protected routes, session handling, or any UI that depends on authenticated state in the Servemate client.

## Goal

Keep authentication concerns centralized in the session/proxy layer, keep UI components free of token logic, and keep protected tab navigation driven by local state rather than URL synchronization.

## Mandatory first step

Before changing auth behavior, inspect the current client auth flow and confirm:

- login entry point
- where tokens are stored
- how access token expiry is detected
- how refresh is triggered on the server
- how refresh is triggered on the client
- how protected routes are guarded

Do not assume the flow from a generic Next.js auth setup. In ServeMate the proxy and session utilities are the source of truth.

## Current flow in this app

### 1. Login

- The login form submits to a server action in `src/features/auth/actions/login.ts`.
- The action calls the backend `/auth/login` endpoint.
- The backend returns `accessToken` and `refreshToken`.
- The access token is decoded to extract `exp`, user id, and role.
- The tokens and metadata are saved into the iron-session cookie in `src/app/lib/session.ts`.
- After success, the user is redirected to the callback URL or the protected landing page.

### 2. Session storage

- Session data lives in iron-session, not in React state.
- The session contains `accessToken`, `refreshToken`, `expiresAt`, `isLoggedIn`, `userId`, `role`, and refresh bookkeeping fields.
- `updateSessionWithTokens()` in `src/app/lib/session-update.ts` is the centralized place for writing fresh token pairs back into the session.

### 3. Protected route guard

- `src/proxy.ts` is the route guard for protected pages.
- It redirects anonymous users to `/login`.
- It checks token expiry using `expiresAt`.
- If the access token is expired, it redirects the user to `/refresh` and passes `returnUrl`.

### 4. Server-side API proxy

- Client data fetching goes through `/api/service/[...params]`, not directly to the backend.
- The proxy attaches the access token from the session.
- If the backend returns `401`, the proxy attempts refresh and retries once.
- If refresh fails, the proxy redirects to `/login`.
- `204`, `205`, and `304` responses must be returned as empty responses, not parsed as JSON.

### 5. Client-side refresh page

- `src/app/(auth)/refresh/page.tsx` exists as a fallback refresh flow.
- It calls `refreshSessionAction()` and then redirects back to `returnUrl` on success.
- If refresh fails, it redirects to `/login`.

### 6. Protected tab navigation

- Protected pages use a tab-based shell in `src/app/(protected)/layout.tsx`.
- The selected tab state is managed locally or in Zustand, not via URL sync.
- For auth-related pages inside the protected shell, keep navigation state independent from query params unless the UX explicitly needs shareable links.

## Recommended structure

- `src/features/auth/actions/` — server actions like login/logout.
- `src/features/auth/api/` — refresh/login helpers when a client-side API wrapper is needed.
- `src/app/lib/session.ts` — iron-session config and session helpers.
- `src/app/lib/session-update.ts` — shared token/session write helpers.
- `src/app/api/service/[...params]/` — authenticated proxy and refresh retry logic.
- `src/proxy.ts` — protected-route guard.

## Rules for auth work

- Use the proxy pattern for authenticated API calls.
- Keep session writes centralized.
- Do not duplicate refresh logic in UI components.
- Do not parse access token expiry in random feature hooks.
- Do not sync protected tab state to the URL unless there is a product reason.
- Use Zustand or local component state for tab selection inside the protected shell.
- Prefer server-side redirects for auth failures.

## When adding auth features

- If you add logout, clear the iron-session and redirect to `/login`.
- If you add a protected page, make sure it is covered by `src/proxy.ts`.
- If you add a new authenticated data hook, route it through the service proxy.
- If a mutation changes auth state, invalidate or reset query cache only after session state is confirmed.

## Validation checklist

- Confirm the login action writes session data correctly.
- Confirm protected pages redirect when the session is missing or expired.
- Confirm proxy refresh works on `401`.
- Confirm `/refresh` redirects back to the original page.
- Confirm tab navigation still works without URL sync after auth changes.
