// KAAMMAP API client. The app always talks to the real backend:
// real data, real accounts, server-synced saved guides & progress.
// VITE_API_BASE_URL can override the API address; locally it defaults
// to the KAAMMAP server on port 5000.
const BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1").replace(/\/+$/, "")
export const API_MODE = true
export const apiBase = BASE

let accessToken = null
export function setAccessToken(t) { accessToken = t }
export function getAccessToken() { return accessToken }

export class ApiError extends Error {
  constructor(status, code, message, details) { super(message); this.status = status; this.code = code; this.details = details }
}

async function raw(path, opts = {}) {
  let res
  try {
    res = await fetch(BASE + path, {
      credentials: "include",
      ...opts,
      headers: { "Content-Type": "application/json", ...(accessToken ? { Authorization: "Bearer " + accessToken } : {}), ...(opts.headers || {}) },
    })
  } catch {
    throw new ApiError(0, "NETWORK", "Cannot reach the KAAMMAP server. Check your connection and try again.")
  }
  let body = null
  try { body = await res.json() } catch { /* empty body */ }
  if (!res.ok || (body && body.success === false)) {
    const e = body?.error || {}
    throw new ApiError(res.status, e.code || "ERROR", e.message || `Request failed (${res.status})`, e.details)
  }
  return body?.data ?? body
}

export async function api(path, opts = {}) {
  try {
    return await raw(path, opts)
  } catch (err) {
    // One silent refresh attempt for expired access tokens (not for auth endpoints themselves)
    if (err.status === 401 && !path.startsWith("/auth/")) {
      try {
        const r = await raw("/auth/refresh", { method: "POST" })
        if (r?.accessToken) { setAccessToken(r.accessToken); return await raw(path, opts) }
      } catch { /* fall through */ }
    }
    throw err
  }
}
export const apiGet = (p) => api(p)
export const apiPost = (p, data) => api(p, { method: "POST", body: data ? JSON.stringify(data) : undefined })
export const apiPatch = (p, data) => api(p, { method: "PATCH", body: JSON.stringify(data || {}) })
export const apiPut = (p, data) => api(p, { method: "PUT", body: JSON.stringify(data || {}) })
export const apiDelete = (p) => api(p, { method: "DELETE" })
