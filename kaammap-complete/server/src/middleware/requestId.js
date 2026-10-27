import crypto from 'node:crypto';

// Attach a request id for troubleshooting; echoed in the X-Request-Id header
// and included in error responses. No sensitive data is logged.
export function requestId(req, res, next) {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
}
