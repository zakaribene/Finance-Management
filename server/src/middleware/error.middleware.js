import { fail } from '../utils/response.js';

export function notFound(req, res) {
  return fail(res, `Route not found: ${req.originalUrl}`, [], 404);
}

export function errorMiddleware(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;
  return fail(res, message, err.errors || [], status);
}
