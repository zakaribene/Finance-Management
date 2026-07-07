export const settingSchema = (body) => {
  const errors = [];
  if (body.activityLogRetention !== undefined && ![7, 30, 90, 180, 0].includes(Number(body.activityLogRetention))) errors.push('Invalid activity log retention.');
  return errors;
};
