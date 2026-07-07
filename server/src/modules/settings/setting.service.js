import { ApiError } from '../../utils/ApiError.js';
import { Setting } from './setting.model.js';

export async function getSettings() {
  return (await Setting.findOne()) || Setting.create({});
}

export async function updateSettings(payload) {
  if (payload.defaultCurrency && payload.defaultCurrency !== 'USD') {
    throw new ApiError(400, 'Currency cannot be changed in Version 1.');
  }
  if (typeof payload.notificationsEnabled === 'string') {
    payload.notificationsEnabled = payload.notificationsEnabled === 'true';
  }
  if (payload.activityLogRetention !== undefined) {
    payload.activityLogRetention = Number(payload.activityLogRetention);
  }
  const settings = await getSettings();
  Object.assign(settings, payload, { defaultCurrency: 'USD' });
  return settings.save();
}
