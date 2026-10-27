import { ApiError } from '../utils/ApiError.js';
import { isProd } from '../config/env.js';

export function notFound(req, res, next) {
  next(new ApiError(404, 'NOT_FOUND', `Route not found: ${req.method} ${req.originalUrl}`));
}

// Central error middleware. All errors leave in the standard envelope:
// { success:false, error:{ code, message, details? }, requestId }
// Stack traces and internal details are never exposed in production.
export function errorHandler(err, req, res, next) {
  let status = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Something went wrong. Please try again later.';
  let details;

  if (err && err.isApiError) {
    status = err.status;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err && err.name === 'ZodError') {
    status = 400;
    code = 'VALIDATION_ERROR';
    message = 'Please check the submitted information';
    details = err.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
  } else if (err && err.name === 'ValidationError') {
    // Mongoose validation error
    status = 400;
    code = 'VALIDATION_ERROR';
    message = 'Please check the submitted information';
    details = Object.values(err.errors || {}).map((e) => ({ path: e.path, message: e.message }));
  } else if (err && err.code === 11000) {
    status = 409;
    code = 'DUPLICATE';
    message = 'A record with the same unique value already exists';
    details = Object.keys(err.keyValue || {}).map((k) => ({ path: k, message: `${k} already exists` }));
  } else if (err && err.name === 'CastError') {
    status = 400;
    code = 'INVALID_ID';
    message = 'The provided id is not valid';
  } else if (err && err.type === 'entity.parse.failed') {
    status = 400;
    code = 'MALFORMED_JSON';
    message = 'Request body is not valid JSON';
  } else if (err && err.type === 'entity.too.large') {
    status = 413;
    code = 'PAYLOAD_TOO_LARGE';
    message = 'Request body is too large';
  } else if (err && (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')) {
    status = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid or expired access token';
  }

  if (status >= 500) {
    console.error(`[KAAMMAP] ${req.id || '-'} ${req.method} ${req.originalUrl} -> 500: ${err && err.message}`);
    if (!isProd && err && err.stack) console.error(err.stack);
  }

  const body = { success: false, error: { code, message }, requestId: req.id };
  if (details) body.error.details = details;
  if (!isProd && status >= 500 && err && err.message) body.error.debugMessage = err.message;
  res.status(status).json(body);
}
