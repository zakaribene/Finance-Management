import { asyncHandler } from '../../utils/asyncHandler.js';
import { ok } from '../../utils/response.js';
import * as service from './auth.service.js';
import { logActivity } from '../activity-logs/activityLog.service.js';

export const register = asyncHandler(async (req, res) => {
  const data = await service.register(req.body, req, res);
  req.user = { userId: data.user._id };
  await logActivity(req, 'auth', 'Register', 'User registered');
  ok(res, 'Registered successfully', data, 201);
});

export const login = asyncHandler(async (req, res) => {
  const data = await service.login(req.body, req, res);
  req.user = { userId: data.user._id };
  await logActivity(req, 'auth', 'Login', 'User logged in');
  ok(res, 'Logged in successfully', data);
});

export const googleLogin = asyncHandler(async (req, res) => {
  const data = await service.googleLogin(req.body, req, res);
  req.user = { userId: data.user._id };
  await logActivity(req, 'auth', 'Google Login', 'User logged in with Google');
  ok(res, 'Logged in with Google successfully', data);
});

export const refresh = asyncHandler(async (req, res) => ok(res, 'Token refreshed', await service.refresh(req, res)));

export const logout = asyncHandler(async (req, res) => {
  await service.logout(req, res);
  await logActivity(req, 'auth', 'Logout', 'User logged out');
  ok(res, 'Logged out successfully');
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await service.changePassword(req);
  await logActivity(req, 'auth', 'Password Change', 'User changed forced temporary password');
  ok(res, 'Password changed successfully', { user });
});
