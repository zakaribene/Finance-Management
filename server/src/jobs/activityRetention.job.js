import { cleanupActivityLogs } from '../modules/activity-logs/activityLog.service.js';

export function startActivityRetentionJob() {
  const day = 24 * 60 * 60 * 1000;
  setInterval(() => {
    cleanupActivityLogs().catch(() => {});
  }, day);
}
