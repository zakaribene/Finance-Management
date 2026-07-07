import { ApiError } from '../utils/ApiError.js';

export function validate(schema) {
  return (req, res, next) => {
    const errors = schema(req.body, req);
    if (errors.length) return next(new ApiError(422, 'Validation failed', errors));
    return next();
  };
}
