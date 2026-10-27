import { verifyAccessToken } from '../utils/tokens.js';
import { User } from '../models/User.js';
import { unauthorized, forbidden } from '../utils/ApiError.js';

function bearerToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7).trim();
  return null;
}

async function loadUser(req) {
  const token = bearerToken(req);
  if (!token) return null;
  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    return null;
  }
  const user = await User.findById(payload.sub);
  return user || null;
}

export const requireAuth = async (req, res, next) => {
  try {
    const user = await loadUser(req);
    if (!user) return next(unauthorized('Invalid or expired access token', 'INVALID_TOKEN'));
    if (user.accountStatus !== 'active') {
      return next(forbidden('This account is suspended', 'ACCOUNT_SUSPENDED'));
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// Attaches req.user when a valid token is present, but never rejects.
// Used on public endpoints that behave better when signed in (e.g. report-issue).
export const optionalAuth = async (req, res, next) => {
  try {
    const user = await loadUser(req);
    if (user && user.accountStatus === 'active') req.user = user;
    next();
  } catch {
    next();
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) return next(unauthorized());
  if (req.user.role !== 'admin') return next(forbidden('Administrator access required', 'ADMIN_REQUIRED'));
  next();
};
