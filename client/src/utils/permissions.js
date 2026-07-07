export function can(auth, module, action = 'view') {
  if (auth.role === 'Super Admin') return true;
  return auth.permissions?.some((permission) => permission.module === module && permission[action]);
}

export function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export function displayIncomeCategory(value) {
  return value || 'Uncategorized';
}
