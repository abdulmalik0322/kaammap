# KAAMMAP — GitHub + Vercel Deployment Guide

Production architecture:

- **GitHub:** one repository containing the frontend and backend code.
- **Vercel:** one project serving both parts on the same domain:
  - Vite/React website from the repository root.
  - Express API as a Vercel Function from `api/index.js`.
  - `/api/v1/*` is rewritten to that function by `vercel.json`.
- **MongoDB Atlas:** external database used by the API.

Using one Vercel domain for the website and API avoids cross-domain refresh-cookie problems.

> Never commit `.env` or `server/.env`. They are already covered by `.gitignore`. Production secrets are entered only in Vercel's Environment Variables screen.

---

## 1. Prepare MongoDB Atlas

1. Open the Atlas cluster that contains the `kaammap` database.
2. **Database Access:** use a strong, unique password for the database user. Give it read/write access to the `kaammap` database only.
3. **Network Access:** Vercel's function IP addresses change, so the Atlas allowlist must include `0.0.0.0/0` for this deployment. The strong database password and the SRV connection string must therefore stay secret.
4. Copy the Drivers connection string and make sure it names the database:

   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/kaammap?retryWrites=true&w=majority`

If this is the same Atlas database already used locally, its 8 categories, 8 guides and admin account are already seeded. A new/empty database must be seeded in step 6.

## 2. Put the code on GitHub

Create an empty GitHub repository named `kaammap` (do not add a README, `.gitignore`, or license during creation — this project already contains them).

From the project folder on Windows:

```bat
git init
git add .
git commit -m "Deploy KAAMMAP"
git branch -M main
git remote add origin https://github.com/<your-github-username>/kaammap.git
git push -u origin main
```

Before pushing, `git status` must not list `.env`, `server/.env`, or `node_modules`.

## 3. Import the repository into Vercel

1. Vercel Dashboard → **Add New → Project**.
2. Import the `kaammap` GitHub repository.
3. Use these settings:
   - **Project Name:** `kaammap`
   - **Root Directory:** `./` (repository root — do not select `server`)
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Add the environment variables in step 4 before the final production check. The first deployment gives the permanent production domain, normally `https://kaammap-<account>.vercel.app` or `https://kaammap.vercel.app` if available.

## 4. Vercel environment variables

Add these under **Project → Settings → Environment Variables → Production**:

| Variable | Production value |
|---|---|
| `VITE_API_BASE_URL` | `/api/v1` |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | The Atlas SRV string from step 1 |
| `JWT_ACCESS_SECRET` | A new random secret, at least 32 characters |
| `JWT_REFRESH_SECRET` | A different new random secret, at least 32 characters |
| `CLIENT_ORIGIN` | The exact Vercel production origin, e.g. `https://kaammap.vercel.app` (no trailing slash) |
| `CLIENT_BASE_URL` | The same Vercel production URL |
| `APP_BASE_URL` | The same Vercel production URL |
| `ENABLE_SWAGGER` | `false` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | The Gmail address used to send KAAMMAP email |
| `SMTP_PASS` | That account's Gmail App Password (entered only in Vercel, never in GitHub or chat) |
| `EMAIL_FROM` | `KAAMMAP <same-gmail-address>` |

Do **not** add a `PORT` variable on Vercel.

Chicken-and-egg note: if the exact Vercel domain is not known before the first deploy, deploy once, copy the production domain, set `CLIENT_ORIGIN`, `CLIENT_BASE_URL`, and `APP_BASE_URL`, then redeploy from **Deployments → … → Redeploy**. Environment-variable changes do not affect an already-built deployment until it is redeployed.

## 5. Deploy / redeploy

Vercel deploys automatically after the import and after every later `git push` to `main`.

After deployment, Vercel should show **Ready**. Open:

- `https://<your-vercel-domain>/api/v1/health`
  Expected: `success: true`, `status: "ok"`, `db: "connected"`.
- `https://<your-vercel-domain>/api/v1/guides`
  Expected: the published guides from Atlas.

## 6. Seed a new database only

Skip this step when using Abdul's existing seeded Atlas database.

From a local terminal, with the production Atlas string placed only in `server/.env`:

```bash
cd server
NODE_ENV=production SEED_CONFIRM=yes npm run seed
```

To also create the first admin, set `SEED_ADMIN_EMAIL` and a strong `SEED_ADMIN_PASSWORD` in that local `server/.env` for the seed run. There is no default admin password in the code.

## 7. Final live checks

On the production domain, check:

1. Home page loads guides and categories from the API.
2. EN / اردو toggle switches the whole site and RTL layout.
3. A new test account can sign up.
4. Sign out and sign in again; refresh the dashboard and confirm the session is restored.
5. Forgot Password sends a real 6-digit code email; reset works once.
6. Save a guide while signed in, refresh, and confirm it is still saved.
7. Contact and Report Issue show success only after submission.
8. No page contains demo-mode wording.

## 8. Updating the live site

```bat
git add .
git commit -m "Describe the change"
git push
```

Vercel rebuilds and redeploys automatically. If only an environment variable changed, redeploy manually from the Vercel Deployments tab.

## Local development remains available

`server/src/server.js` still runs the same Express app as a normal long-running server for local development (`npm run dev` in `server/`). The Vercel handler in `api/index.js` reuses that app without listening on a port.
