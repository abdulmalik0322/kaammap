# KAAMMAP — Security

## Authentication & sessions

- Passwords are hashed with **bcrypt** (cost 10). Plaintext passwords are never stored, logged or returned.
- Login returns a **15-minute JWT access token** (sent as `Authorization: Bearer`) plus an **HttpOnly refresh cookie** (`km_refresh`, SameSite=Lax, Secure in production, path-scoped to `/api/v1/auth`).
- Refresh tokens are 48-byte random values; **only their SHA-256 hash** is stored (`RefreshSession`). Refresh **rotates**: the old session is revoked on every refresh, so a stolen old cookie stops working. Logout and password changes/resets revoke sessions server-side.
- Long-lived tokens are never stored in `localStorage` by design — the access token is short-lived and the refresh token is cookie-only.
- Password reset: single-use random token, only the hash stored, **30-minute expiry**, generic responses (no account enumeration), all sessions revoked on reset. Email verification tokens: hash-only, 24-hour expiry.
- If SMTP is not configured, the API runs in a clearly-marked **dev email mode** (tokens/codes logged on the server console; `devToken`/`devCode` returned in auth responses) — this is **disabled automatically when `NODE_ENV=production`**. Do not run production without SMTP if you need working reset/verification emails.

## Authorization

- Every `/api/v1/admin/*` route requires a valid session **and** `role: "admin"`, enforced in server middleware — the frontend is never trusted for authorization.
- Roles can never be set at registration or via `PATCH /users/me` (strict zod allowlists reject unknown/protected fields such as `role`, `accountStatus`, `adminNotes`). Only admins change roles, via `PATCH /admin/users/:id`, with an audit entry; an admin cannot change their own role.
- Ownership: saved guides, checklist progress and reports are always queried by the authenticated user's id — users cannot read or modify another user's private records. Checklist item ids are validated against the guide's actual document/step counts.
- Admin `adminNotes` on issue reports are `select: false` in the model and are never returned to ordinary users.

## Input & transport

- All request bodies are validated with **zod** schemas (types, lengths, enums, URL schemes — only http/https URLs are accepted for sources/images/links, which blocks `javascript:`-style injection).
- Search input is regex-escaped before use; clients cannot inject MongoDB operators (bodies are parsed as data, query filters are built from whitelisted params only). Pagination is clamped (limit ≤ 50).
- **Helmet** security headers, explicit **CORS allowlist** (`CLIENT_ORIGIN`, credentials enabled only for listed origins), 100 KB JSON body limit, malformed-JSON handling.
- **Rate limits**: global 300/15 min per IP; auth endpoints 20/15 min; contact/report submissions 10/hour.
- Invalid ObjectIds return 400 (`INVALID_ID`) instead of leaking 500s; a central error middleware returns one consistent error envelope and **never exposes stack traces in production**.

## Data protection

- The product deliberately does **not** collect CNIC numbers, passport numbers, government-portal passwords or identity-document uploads — no model stores them.
- Audit logs (`AuditLog`) record admin actions (publish/archive, fee changes, source changes, report handling, role/status changes) and never contain passwords, tokens or secrets. Secrets are never printed in logs; the MongoDB URI is never logged.
- Environment is validated with zod at startup (fail-fast). `.env` files are git-ignored; only `.env.example` placeholders are committed. No credentials or default admin passwords exist in the codebase — the first admin is created only by the seed with explicit `SEED_ADMIN_*` values.
- Account deletion removes the user's saved guides, progress and sessions, and anonymizes (does not delete) their public issue reports.

## Maintenance checklist

- Run `npm audit` in `server/` regularly and update dependencies.
- Rotate `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` if compromise is suspected (also clear `RefreshSession` documents to force re-login).
- Review `AuditLog` entries and the dashboard's pending-report / needs-review counts.
- Keep Atlas network access as narrow as the host allows; use a least-privilege database user.
- Re-check guide fees/requirements against official sources on the schedule recorded in each guide (`lastReviewedAt` / review workflow) — KAAMMAP presents information as checked against sources, never as government-affiliated.
