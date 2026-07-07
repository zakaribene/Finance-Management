export function ok(res, message = '', data = {}, status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function fail(res, message = '', errors = [], status = 400) {
  return res.status(status).json({ success: false, message, errors });
}
