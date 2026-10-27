# KAAMMAP API

Base prefix: **`/api/v1`** · Interactive docs: **`/api/docs`** (Swagger UI, enabled outside production or with `ENABLE_SWAGGER=true`)

## Response format

Every response uses one envelope:

```json
// success
{ "success": true, "data": { }, "message": "Request completed successfully" }

// error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Please check the submitted information", "details": [ { "path": "email", "message": "A valid email address is required" } ] }, "requestId": "…" }
```

Common error codes: `VALIDATION_ERROR` (400), `INVALID_ID` (400), `INVALID_TOKEN` (400/401), `UNAUTHORIZED` (401), `INVALID_CREDENTIALS` (401), `NO_SESSION` / `SESSION_EXPIRED` (401), `FORBIDDEN` / `ADMIN_REQUIRED` / `ACCOUNT_SUSPENDED` (403), `NOT_FOUND` (404), `CONFLICT` / `DUPLICATE` / `EMAIL_IN_USE` / `CATEGORY_IN_USE` / `DELETE_REQUIRES_DRAFT` (409), `RATE_LIMITED` (429), `INTERNAL_ERROR` (500). Stack traces are never returned in production.

## Authentication flow

1. `POST /auth/register` or `POST /auth/login` → returns `{ user, accessToken }` in JSON **and** sets an HttpOnly refresh cookie `km_refresh` (SameSite=Lax, path `/api/v1/auth`, Secure in production, 30 days).
2. Send the access token (JWT, **15 minutes**) as `Authorization: Bearer <token>` on protected requests.
3. When the access token expires, `POST /auth/refresh` (cookie required) **rotates** the refresh session: the old session is revoked, a new cookie + access token are issued. Reusing an old cookie fails.
4. `POST /auth/logout` revokes the refresh session server-side and clears the cookie.
5. Only the **SHA-256 hash** of each refresh token is stored in MongoDB. Email-verification tokens work the same way (hash-only, single-use; 24 h). Password reset uses a 6-digit code emailed to the user (hash-only, single-use, 10 min expiry, max 5 attempts) and a password reset revokes **all** of the user's sessions.
6. Roles are `user` and `admin`. A role can **never** be set at registration or through the profile endpoint; only an admin can change roles via `PATCH /admin/users/:id` (audit-logged; admins cannot change their own role).
7. If SMTP is not configured, the server runs in **dev email mode**: emails are logged to the console and auth responses include a `devToken` (verification) or `devCode` (6-digit password reset code) field — **only when `NODE_ENV` is not `production`**. `POST /auth/forgot-password` always answers generically so account existence is never revealed.

## Endpoints

### Health
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/health` | — | `{ status: "ok", db: "connected" \| "disconnected" }` — no secrets exposed |

### Auth
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/register` | — | name 2–80, valid email, password 8–72. 409 on duplicate email. Rate limited 20/15 min |
| POST | `/auth/login` | — | Generic 401 on wrong email/password |
| POST | `/auth/logout` | cookie | Revokes refresh session |
| GET | `/auth/me` | Bearer | Current user |
| POST | `/auth/refresh` | cookie | Rotates refresh session |
| POST | `/auth/forgot-password` | — | Generic response always |
| POST | `/auth/reset-password` | — | `{ email, code, password }` where code is the 6-digit code from the reset email; revokes all sessions |
| POST | `/auth/verify-email` | — | `{ token }` |
| POST | `/auth/resend-verification` | — | Generic response always |

### Public
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/categories` | — | Active categories only, ordered by `displayOrder` |
| GET | `/categories/:slug` | — | 404 if inactive/unknown |
| GET | `/guides` | — | Published only. Query: `q`, `category`, `province` (matches scope), `level`, `sort=relevant\|title\|recent`, `page`, `limit` (max 50). Returns `{ items, page, limit, totalItems, totalPages }` |
| GET | `/guides/featured` | — | `level=checked`, max 6 |
| GET | `/guides/:slug` | — | Published only; drafts return 404 |
| GET | `/guides/:slug/related` | — | Published related guides |
| POST | `/guides/:slug/report-issue` | optional | Body: `issueType`, `description` (5–2000), `relevantSection`. Rate limited 10/hour |
| POST | `/contact` | — | Validated contact message. Rate limited 10/hour |

### User (Bearer required)
| Method | Path | Notes |
|---|---|---|
| GET | `/users/me` | Own profile |
| PATCH | `/users/me` | Allowlist only: `name`, `preferredLanguage` (strict — other fields are rejected) |
| PATCH | `/users/me/password` | Verifies current password; revokes all sessions |
| DELETE | `/users/me` | Requires body `{ "confirm": true }`. Deletes saved guides, progress and sessions; the user's public reports are kept but anonymized |
| GET | `/users/me/saved-guides` | Own saved guides |
| POST | `/users/me/saved-guides/:guideId` | `:guideId` accepts a guide **slug or ObjectId**. Idempotent — saving twice returns the existing record, never a duplicate |
| DELETE | `/users/me/saved-guides/:guideId` | Remove saved guide |
| GET | `/users/me/progress/:guideSlug` | Own checklist progress (`completedItems`, ids like `d0`, `s2`) |
| PUT | `/users/me/progress/:guideSlug` | Every item id must match `^[ds]\d+$` and be within the guide's document/step counts, otherwise 400 |
| DELETE | `/users/me/progress/:guideSlug` | Reset progress |
| GET | `/users/me/reports` | Own issue reports (admin notes are never included) |

### Admin (Bearer + role `admin`; enforced server-side)
| Method | Path | Notes |
|---|---|---|
| GET | `/admin/dashboard` | Real counts (published/drafts/needs-review guides, pending reports, active categories, users) + 10 most recent audit entries |
| GET | `/admin/guides` | All statuses, paginated; filters `status`, `category`, `q` |
| POST | `/admin/guides` | Creates a **draft**; `categorySlug` must exist |
| GET | `/admin/guides/:id` | Invalid ObjectId → 400 `INVALID_ID` |
| PATCH | `/admin/guides/:id` | Allowlisted fields. **Slug is immutable once published.** Fee and source changes are audit-logged |
| DELETE | `/admin/guides/:id` | Drafts only — otherwise 409 (archive instead) |
| POST | `/admin/guides/:id/publish` | Validates: title, slug, existing category, ≥1 document, ≥1 step, and ≥1 source when `level=checked` |
| POST | `/admin/guides/:id/archive` | Archive (audit-logged) |
| POST | `/admin/guides/:id/request-review` | Drafts move to `needs_review` |
| POST | `/admin/categories` | Create category |
| PATCH | `/admin/categories/:id` | Update category |
| DELETE | `/admin/categories/:id` | 409 while guides reference it — deactivate with `isActive:false` instead |
| GET/POST | `/admin/sources` | Official source records; `officialUrl` must be http/https |
| PATCH/DELETE | `/admin/sources/:id` | Manage a source (audit-logged) |
| GET | `/admin/reports` | All reports incl. admin notes; filters `status`, `guideSlug` |
| PATCH | `/admin/reports/:id` | `{ status, adminNotes }`; sets `reviewedBy/reviewedAt`; audit-logged |
| GET | `/admin/contact-messages` | Filter `status` |
| PATCH | `/admin/contact-messages/:id` | `{ status: new\|read\|replied\|archived }` |
| GET | `/admin/users` | Paginated; filters `role`, `q` (email). Password hashes never returned |
| PATCH | `/admin/users/:id` | `{ role, accountStatus }`; cannot change own role; suspending revokes the user's sessions; audit-logged |

## Rate limits

Global 300 requests / 15 min per IP · auth endpoints 20 / 15 min · contact & report submissions 10 / hour. (Limiters are bypassed when `NODE_ENV=test` so the automated suite can run.)
