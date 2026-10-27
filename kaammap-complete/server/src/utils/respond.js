// Consistent API response envelope:
// success: { success: true, data, message }
// error:   { success: false, error: { code, message, details } }  (see errorHandler)
export function ok(res, data, message = 'Request completed successfully', status = 200) {
  return res.status(status).json({ success: true, data, message });
}

export function created(res, data, message = 'Resource created successfully') {
  return ok(res, data, message, 201);
}

export function paginated(items, page, limit, totalItems) {
  return {
    items,
    page,
    limit,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / limit)),
  };
}

// Strip sensitive fields from a user document before it leaves the API.
export function sanitizeUser(user) {
  if (!user) return null;
  const u = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete u.passwordHash;
  delete u.resetCodeHash;
  delete u.resetCodeExpires;
  delete u.resetCodeAttempts;
  delete u.verifyTokenHash;
  delete u.verifyTokenExpires;
  delete u.__v;
  return u;
}

// Parse + clamp pagination query params. Never trust raw client values.
export function parsePagination(query) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);
  if (Number.isNaN(page) || page < 1) page = 1;
  if (Number.isNaN(limit) || limit < 1) limit = 12;
  if (limit > 50) limit = 50;
  return { page, limit, skip: (page - 1) * limit };
}

// Escape user input before using it in a RegExp (prevents regex injection / ReDoS).
export function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
