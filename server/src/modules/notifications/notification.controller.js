import { asyncHandler } from '../../utils/asyncHandler.js';
import { ok } from '../../utils/response.js';
import * as service from './notification.service.js';

export const list = asyncHandler(async (req, res) => ok(res, '', await service.listNotifications(req)));
export const sent = asyncHandler(async (req, res) => ok(res, '', await service.listSentNotifications(req)));
export const create = asyncHandler(async (req, res) => ok(res, 'Notification sent', await service.sendNotification(req, req.app.get('io')), 201));
export const read = asyncHandler(async (req, res) => ok(res, 'Notification marked as read', await service.markRead(req)));
export const clearRead = asyncHandler(async (req, res) => ok(res, 'Read notifications cleared', await service.clearRead(req)));
export const remove = asyncHandler(async (req, res) => ok(res, 'Notification deleted', await service.deleteNotification(req)));
