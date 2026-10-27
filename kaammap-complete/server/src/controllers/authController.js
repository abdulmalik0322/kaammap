import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { RefreshSession } from '../models/RefreshSession.js';
import { ApiError, badRequest, conflict, unauthorized } from '../utils/ApiError.js';
import { ok, created, sanitizeUser } from '../utils/respond.js';
import {
  signAccessToken,
  generateRawToken,
  hashToken,
  createRefreshSession,
  setRefreshCookie,
  clearRefreshCookie,
  revokeSessionByRawToken,
  revokeAllSessions,
  REFRESH_COOKIE,
} from '../utils/tokens.js';
import { randomInt, timingSafeEqual } from 'node:crypto';
import { sendVerificationEmail, sendPasswordResetCodeEmail, mailConfigured } from '../utils/mailer.js';
import { isProd } from '../config/env.js';

// Dev-only exposure of one-time tokens/codes in API responses. ONLY when
// not production AND no SMTP is configured (so no real email can carry them).
// The moment SMTP works, responses contain nothing sensitive; the frontend
// never displays these values on screen either way.
const exposeDevSecrets = () => !isProd && !mailConfigured();

const RESET_CODE_TTL_MS = 10 * 60 * 1000; // 6-digit reset code: 10 minutes
const RESET_CODE_MAX_ATTEMPTS = 5;
const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

async function issueVerificationToken(user) {
  const raw = generateRawToken(32);
  user.verifyTokenHash = hashToken(raw);
  user.verifyTokenExpires = new Date(Date.now() + VERIFY_TTL_MS);
  await user.save();
  return raw;
}

async function loginResponse(res, user, status = 200, message = 'Logged in successfully') {
  user.lastLoginAt = new Date();
  await user.save();
  const { raw } = await createRefreshSession(user._id, res.req.headers['user-agent']);
  setRefreshCookie(res, raw);
  return ok(res, { user: sanitizeUser(user), accessToken: signAccessToken(user) }, message, status);
}

export async function register(req, res) {
  const { name, email, password, preferredLanguage } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ normalizedEmail });
  if (existing) throw conflict('An account with this email already exists', 'EMAIL_IN_USE');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: normalizedEmail,
    normalizedEmail,
    passwordHash,
    preferredLanguage: preferredLanguage || 'en',
    // role is never taken from the request — always defaults to 'user'.
  });

  const rawVerify = await issueVerificationToken(user);
  try {
    await sendVerificationEmail(user, rawVerify);
  } catch (err) {
    console.error(`[KAAMMAP] Verification email failed for ${user.normalizedEmail}: ${err.message}`);
  }

  const { raw } = await createRefreshSession(user._id, req.headers['user-agent']);
  setRefreshCookie(res, raw);
  const data = { user: sanitizeUser(user), accessToken: signAccessToken(user) };
  // DEV ONLY: expose the verification token so the flow can be completed
  // without a mail server. Never sent when NODE_ENV=production.
  if (exposeDevSecrets()) data.devToken = rawVerify;
  return created(res, data, 'Account created. Please verify your email address.');
}

export async function login(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ normalizedEmail }).select('+passwordHash');
  // Generic message — do not reveal whether the email or the password was wrong.
  if (!user) throw unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) throw unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  if (user.accountStatus !== 'active') {
    throw new ApiError(403, 'ACCOUNT_SUSPENDED', 'This account is suspended');
  }
  return loginResponse(res, user);
}

export async function me(req, res) {
  return ok(res, { user: sanitizeUser(req.user) });
}

export async function logout(req, res) {
  await revokeSessionByRawToken(req.cookies?.[REFRESH_COOKIE]);
  clearRefreshCookie(res);
  return ok(res, {}, 'Logged out successfully');
}

export async function refresh(req, res) {
  const raw = req.cookies?.[REFRESH_COOKIE];
  if (!raw) throw unauthorized('No refresh session found', 'NO_SESSION');
  const session = await RefreshSession.findOne({ tokenHash: hashToken(raw) });
  if (!session || session.revokedAt || session.expiresAt.getTime() < Date.now()) {
    clearRefreshCookie(res);
    throw unauthorized('Refresh session is no longer valid', 'SESSION_EXPIRED');
  }
  const user = await User.findById(session.userId);
  if (!user || user.accountStatus !== 'active') {
    session.revokedAt = new Date();
    await session.save();
    clearRefreshCookie(res);
    throw unauthorized('Refresh session is no longer valid', 'SESSION_EXPIRED');
  }
  // Rotate: revoke the old session, issue a new one.
  session.revokedAt = new Date();
  await session.save();
  const { raw: newRaw } = await createRefreshSession(user._id, req.headers['user-agent']);
  setRefreshCookie(res, newRaw);
  return ok(res, { user: sanitizeUser(user), accessToken: signAccessToken(user) }, 'Session refreshed');
}

export async function forgotPassword(req, res) {
  const normalizedEmail = req.body.email.trim().toLowerCase();
  const user = await User.findOne({ normalizedEmail });
  let devCode;
  if (user) {
    // 6-digit reset code, like real-world OTP flows. Only its hash (bound to
    // the account email) is stored; the raw code travels only in the email.
    const code = String(randomInt(0, 1000000)).padStart(6, '0');
    user.resetCodeHash = hashToken(`${normalizedEmail}:${code}`);
    user.resetCodeExpires = new Date(Date.now() + RESET_CODE_TTL_MS);
    user.resetCodeAttempts = 0;
    await user.save();
    try {
      const result = await sendPasswordResetCodeEmail(user, code);
      if (result?.sent) {
        console.log(`[KAAMMAP] Password reset code email sent to ${normalizedEmail}.`);
      }
    } catch (err) {
      // Never claim the email was sent when the provider failed.
      console.error(`[KAAMMAP] Password reset email failed for ${normalizedEmail}: ${err.message}`);
    }
    if (exposeDevSecrets()) devCode = code; // DEV ONLY
  } else if (!isProd) {
    // Dev-only diagnostic: the generic API response must never reveal this,
    // but the server owner's own console should say why no email went out.
    console.log(`[KAAMMAP] forgot-password: no account exists for ${normalizedEmail} — no email sent.`);
  }
  // Generic response — never reveals whether the account exists.
  const data = {};
  if (devCode) data.devCode = devCode;
  return ok(res, data, 'If an account exists for that email, a 6-digit password reset code will be sent.');
}

export async function resetPassword(req, res) {
  const { email, code, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ normalizedEmail }).select(
    '+passwordHash +resetCodeHash +resetCodeExpires +resetCodeAttempts'
  );
  const invalidCode = () =>
    badRequest('That reset code is invalid or has expired. Please request a new code.', 'INVALID_CODE');
  if (!user || !user.resetCodeHash || !user.resetCodeExpires) throw invalidCode();
  if (user.resetCodeExpires.getTime() < Date.now()) {
    user.resetCodeHash = null;
    user.resetCodeExpires = null;
    user.resetCodeAttempts = 0;
    await user.save();
    throw invalidCode();
  }
  const candidate = Buffer.from(hashToken(`${normalizedEmail}:${code}`));
  const stored = Buffer.from(user.resetCodeHash);
  const matches = candidate.length === stored.length && timingSafeEqual(candidate, stored);
  if (!matches) {
    user.resetCodeAttempts = (user.resetCodeAttempts || 0) + 1;
    if (user.resetCodeAttempts >= RESET_CODE_MAX_ATTEMPTS) {
      // Too many wrong tries — the code is dead; a new one must be requested.
      user.resetCodeHash = null;
      user.resetCodeExpires = null;
      user.resetCodeAttempts = 0;
      await user.save();
      throw badRequest(
        'Too many incorrect attempts. Please request a new reset code.',
        'CODE_ATTEMPTS_EXCEEDED'
      );
    }
    await user.save();
    throw badRequest(
      `That code is incorrect. ${RESET_CODE_MAX_ATTEMPTS - user.resetCodeAttempts} attempt(s) remaining.`,
      'INVALID_CODE'
    );
  }
  user.passwordHash = await bcrypt.hash(password, 10);
  user.resetCodeHash = null;
  user.resetCodeExpires = null;
  user.resetCodeAttempts = 0;
  await user.save();
  // A password reset ends every existing session.
  await revokeAllSessions(user._id);
  return ok(res, {}, 'Password has been reset. Please log in with your new password.');
}

export async function verifyEmail(req, res) {
  const { token } = req.body;
  const user = await User.findOne({
    verifyTokenHash: hashToken(token),
    verifyTokenExpires: { $gt: new Date() },
  });
  if (!user) throw badRequest('This verification link is invalid or has expired', 'INVALID_TOKEN');
  user.emailVerifiedAt = new Date();
  user.verifyTokenHash = null;
  user.verifyTokenExpires = null;
  await user.save();
  return ok(res, { user: sanitizeUser(user) }, 'Email address verified');
}

export async function resendVerification(req, res) {
  const normalizedEmail = req.body.email.trim().toLowerCase();
  const user = await User.findOne({ normalizedEmail });
  let devToken;
  if (user && !user.emailVerifiedAt) {
    const raw = await issueVerificationToken(user);
    try {
      await sendVerificationEmail(user, raw);
    } catch (err) {
      console.error(`[KAAMMAP] Verification email failed for ${normalizedEmail}: ${err.message}`);
    }
    if (exposeDevSecrets()) devToken = raw; // DEV ONLY
  }
  const data = {};
  if (devToken) data.devToken = devToken;
  return ok(res, data, 'If an unverified account exists for that email, a new verification link will be sent.');
}
