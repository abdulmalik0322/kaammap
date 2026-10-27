import { ApiError } from '../utils/ApiError.js';

// validate(schema) — validates req.body against a zod schema and replaces it
// with the parsed (stripped/strict) value. Unknown/protected fields are
// rejected by strict schemas, which prevents mass assignment.
export const validate = (schema, part = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[part]);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
    return next(new ApiError(400, 'VALIDATION_ERROR', 'Please check the submitted information', details));
  }
  req[part] = result.data;
  next();
};
