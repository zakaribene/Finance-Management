export const permissionSchema = (body) => {
  if (!Array.isArray(body.permissions)) return ['Permissions array is required.'];
  return [];
};
