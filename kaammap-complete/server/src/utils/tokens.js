import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env, isProd } from '../config/env.js';
import { RefreshSession } from '../models/RefreshSession.js';

export const ACCESS_TOKEN_TTL = '15m';
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const REFRESH_COOKIE = 'km_refresh';

export function signAccessToken(user) {
  return jwt.sign({ sub: String(user._id), role: user.role }, env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

// Raw one-time tokens (refresh sessions, password reset, email verification).
// Only the SHA-256 hash is ever stored in the database.
export function generateRawToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString('hex');
}

export function hashToken(raw) {
  return crypto.createHash('sha256').update(String(raw)).digest('hex');
}

export async function createRefreshSession(userId, userAgent = '') {
  const raw = generateRawToken(48);
  const session = await RefreshSession.create({
    userId,
    tokenHash: hashToken(raw),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    userAgent: String(userAgent || '').slice(0, 300),
  });
  return { raw, session };
}

export function setRefreshCookie(res, raw) {
  res.cookie(REFRESH_COOKIE, raw, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/api/v1/auth',
    maxAge: REFRESH_TOKEN_TTL_MS,
  });
}

export function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/api/v1/auth',
  });
}

export async function revokeSessionByRawToken(raw) {
  if (!raw) return;
  await RefreshSession.updateOne(
    { tokenHash: hashToken(raw), revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );
}

export async function revokeAllSessions(userId) {
  await RefreshSession.updateMany({ userId, revokedAt: null }, { $set: { revokedAt: new Date() } });
}
