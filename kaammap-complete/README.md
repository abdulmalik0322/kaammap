# KAAMMAP

**Har Kaam Ka Aasan Raasta.** — *Know What You Need. Know What To Do Next.*

KAAMMAP helps people in Pakistan complete important real-life processes without confusion: required documents, official fees (with source + check date), where to apply, and step-by-step guides you can tick off and print.

> Transformed in-place from the former ASALKHARCHA expense app (same React/Vite project, same folder). The expense-report product has been fully removed — no ASALKHARCHA branding or expense data remains in the user experience. Old routes (`/compare`, `/create`, `/report/*`) redirect to the new Explore page.

## Run it

```bash
npm install
npm run dev      # local development
npm run build    # production build -> dist/
npm run preview
```

Verified 2026-10-24 (transformation day): `npm run build` ✅ passed, built app smoke-tested (correct KAAMMAP title/meta served).

## Stack
React 18 + Vite · React Router (HashRouter — works on any static host/subpath) · Tailwind CSS 3 · Framer Motion · Lucide React. (Recharts was removed with the old expense product — it is no longer a dependency of any page.)

## Routes
`/` Home · `/explore` Explore Guides · `/guides/:slug` Guide Detail · `/categories` + `/categories/:slug` · `/finder` Find My Requirements (guided selection) · `/saved` Saved Guides · `/dashboard` (+ `/saved`, `/settings`) preparation dashboard · `/how-it-works` · `/about` · `/contact` · `/report-issue` · `/signin` `/signup` `/forgot` (real account auth) · `/privacy` `/terms` (pages) · 404

## Guides (8) and how their information is labelled

| Guide | Status | Basis |
|---|---|---|
| New Pakistani Passport (E-Passport) | Fees & steps checked · 2026-10-24 | DGIP e-passport fee schedule announced Oct 2026 (36 pp: Rs 9,000 normal / Rs 15,000 urgent, 5 yrs) |
| Passport Renewal | Fees & steps checked · 2026-10-24 | Same DGIP schedule |
| CNIC Services (new / renewal / modification / Smart) | Fees & steps checked · 2026-10-24 | NADRA published fee schedule (new CNIC normal = Free; renewal Rs 400; Smart Rs 750/1,500/2,500) |
| Learner Licence — Punjab | Fees & steps checked · 2026-10-24 | Punjab DLIMS (Rs 500 per category, 6-month validity, 42-day rule) |
| Permanent Licence — Punjab | Partly checked | Process + 42-day rule checked; fees vary by category/years — examples shown with "confirm on your PSID" |
| University Admission Preparation | Preparation guide | Documents vary by university; NO fee published — guide points to the official admission notice |
| Scholarship Application Preparation | Preparation guide | Varies by provider; includes scam warnings |
| Job Application Documents | Preparation guide | Varies by employer/advertisement |

**Data rule enforced throughout:** no invented fees, deadlines, processing times, office addresses or phone numbers. Unconfirmable information is displayed as "confirm with the official authority" instead of a made-up number. Sources are named on every guide with links to the official authority (dgip.gov.pk, nadra.gov.pk / id.nadra.gov.pk, dlims.punjab.gov.pk, dastak.punjab.gov.pk, hec.gov.pk).

## What genuinely works (frontend)
- **Global search** with synonym/keyword matching, dropdown suggestions, keyboard navigation (↑/↓/Enter/Esc), honest no-results state
- **Explore** filters (category, province scope, information status), sorting, grid/list, photo category chips, empty state
- **Guide pages**: quick overview, working **document checklist** (tick/untick, "3 of 5 prepared", animated progress, reset with confirmation, localStorage persistence), **fee breakdown** table with per-fee source + checked date, **step timeline** with completion ticks, where-to-apply panels with official links, notes, **FAQ accordion**, sources, related guides, save/share (real copy-link)/**print** (dedicated print stylesheet)
- **Finder**: 3-question guided selection → the right guide; honestly says "we don't have this guide yet" for non-Punjab licences instead of guessing
- **Saved Guides + dashboard**: bookmarks, checklist progress, recently viewed, in-progress guides — all from local state
- Theme (light/dark), toasts, page transitions, scroll reveals, reduced-motion support, lazy-loaded routes, lazy images with branded fallbacks (all Unsplash IDs live-verified)

## Accounts
- Sign in / sign up / forgot password: real accounts served by the KAAMMAP backend API (6-digit email reset codes)
- The dashboard requires a real signed-in account
- Contact form: does **not** send anything — it saves a copy in your browser and says so before and after
- Report-an-issue: sent to the backend for review
- All user data (saved guides, progress) lives in localStorage under `km_` keys. KAAMMAP never asks for CNIC/passport numbers or document uploads.

## Still needing verification / future work
- Passport e-passport schedule: DGIP website (dgip.gov.pk) checked directly on 2026-10-24 — site live, e-Passport fee section present, and DGIP's own announcement confirms machine-readable passports are discontinued from 23 Oct 2026. Fee amounts in the guides match the published schedule; re-check periodically as schedules change. Note: DGIP has no online appointment system — the in-person process starts with token issuance at the Regional Passport Office (guides corrected accordingly), and the online-application fee (card payment) is non-refundable per DGIP
- Permanent-licence Punjab totals vary — final authority is the PSID generated in Dastak/DLIMS
- Licence guides for Sindh/KP/Balochistan/ICT, B-Form/CRC, FRC, vehicle registration/transfer, birth/death certificates — planned, added only after proper source checking
- Backend (Node/MongoDB) for real accounts, contact delivery and issue reports — data layer (`src/data/guides.js`) is separated so guides can move to an API without rewriting pages
- Legal review of Privacy/Terms drafts

## Adding a new guide
Add one structured entry to `src/data/guides.js` (slug, title, category, authority, scope, level, documents, fees, steps, applyAt, notes, faqs, sources, related, keywords). The detail page, cards, search and finder pick it up automatically.

---

## Backend API (added 2026-10-24)

A complete production-style backend now lives in **`server/`** — Node.js + Express + MongoDB (Mongoose), with secure cookie/JWT auth, the full REST API for guides/categories/users/admin, an OpenAPI spec, and an automated test suite. The frontend above is unchanged; connecting the UI to this API is a separate integration step (the API is complete and tested on its own).

**Stack:** Express 4 · Mongoose 8 · bcryptjs · JWT access tokens (15 min) + rotating HttpOnly refresh-cookie sessions (hash-only storage) · Zod validation · Helmet · CORS allowlist · express-rate-limit · Swagger UI · Vitest + Supertest + mongodb-memory-server.

### Run the backend locally

```bash
cd server
cp .env.example .env     # fill in MONGODB_URI + JWT secrets (local MongoDB or Atlas)
npm install
npm run seed             # upserts the 8 categories + 8 guides from src/data/guides.js (idempotent)
npm run dev              # API on http://localhost:5000 — health: GET /api/v1/health
npm test                 # full API test suite (in-memory MongoDB, no real DB touched)
```

Swagger UI (outside production): <http://localhost:5000/api/docs>

### Docs

- [docs/API.md](docs/API.md) — endpoint table, response envelope, auth flow
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Atlas setup, env vars, CORS/cookie notes, hosting steps
- [docs/SECURITY.md](docs/SECURITY.md) — security measures and maintenance checklist
- `server/.env.example` — every environment variable, with placeholders

### Notes

- No real credentials are committed; `.env` is git-ignored. There is **no default admin password** — create the first admin via the seed (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).
- Without SMTP configured, email runs in clearly-marked **dev mode** (tokens logged server-side; `devToken`/`devCode` in responses only when `NODE_ENV` is not `production`).
- Public endpoints only ever return **published** guides; drafts stay hidden. Admin permissions are enforced on the server, never by the frontend.

## Frontend ↔ Backend integration (added 2026-10-24)

The React app always uses the real KAAMMAP API — there is no demo mode.
`VITE_API_BASE_URL` selects the API address:

- Local development: `http://localhost:5000/api/v1`, with the Express server
  running from `server/`.
- Production on Vercel: `/api/v1`. The Vite site and the Express API are
  deployed in one Vercel project on the same domain (see `vercel.json` and
  `api/index.js`), so accounts, the refresh cookie, saved guides and checklist
  progress work without cross-domain cookie problems.

Guides and categories load from MongoDB through the backend. Accounts are real
(register/login/refresh cookie, email verification and 6-digit password-reset
codes); saved guides and checklist progress sync for signed-in users, while
guests keep local progress. Contact and report-issue forms only show success
after the server confirms. Admins get the admin panel at `/admin`.

Run both locally:

```bash
# terminal 1 — backend (needs server/.env, see server/.env.example)
cd server && npm install && npm run seed && npm run dev   # http://localhost:5000
# terminal 2 — frontend
printf 'VITE_API_BASE_URL=http://localhost:5000/api/v1\n' > .env
npm install && npm run dev                                 # http://localhost:5173
```

Backend tests: `cd server && npm test` (in-memory MongoDB — no Atlas needed).
API docs: Swagger UI at `http://localhost:5000/api/docs` (non-production), plus
`docs/API.md`, `docs/DEPLOYMENT.md`, `docs/SECURITY.md`.
