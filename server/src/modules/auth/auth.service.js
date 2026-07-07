import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { ROLES } from '../../constants/index.js';
import { ApiError } from '../../utils/ApiError.js';
import { comparePassword, hashPassword } from '../../utils/password.js';
import { hashToken, signAccessToken, signRefreshToken } from '../../utils/tokens.js';
import { createDefaultPaymentMethods } from '../payment-methods/paymentMethod.service.js';
import { Permission } from '../permissions/permission.model.js';
import { Role } from '../roles/role.model.js';
import { User } from '../users/user.model.js';
import { RefreshToken } from './refreshToken.model.js';

function refreshExpiry() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

function refreshCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

async function makeSession(user, req, res) {
  const populated = await user.populate('roleId');
  const accessToken = signAccessToken(populated);
  const refreshToken = signRefreshToken(populated);
  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    deviceInfo: req.headers['user-agent'] || '',
    expiresAt: refreshExpiry()
  });
  res.cookie('refreshToken', refreshToken, refreshCookieOptions());
  const permissions = await Permission.find({ roleId: user.roleId._id });
  return { accessToken, refreshToken, user: populated, role: populated.roleId.name, permissions };
}

async function verifyGoogleCredential(credential) {
  if (!env.googleClientId) throw new ApiError(500, 'Google login is not configured');
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
  if (!response.ok) throw new ApiError(401, 'Invalid Google account');
  const profile = await response.json();
  if (profile.aud !== env.googleClientId) throw new ApiError(401, 'Google account is not allowed for this app');
  if (profile.email_verified !== 'true' && profile.email_verified !== true) throw new ApiError(401, 'Google email is not verified');
  return profile;
}

async function makeUniqueUsername(email, fallbackId) {
  const base = String(email || 'google-user')
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 20) || 'googleuser';
  let username = base;
  let counter = 1;
  while (await User.exists({ username })) {
    username = `${base}${counter}`;
    counter += 1;
    if (counter > 50) username = `google${String(fallbackId).slice(-10)}`;
  }
  return username;
}

export async function register(payload, req, res) {
  const role = await Role.findOne({ name: ROLES.USER });
  const exists = await User.exists({ $or: [{ email: payload.email }, { username: payload.username }, { phone: payload.phone }] });
  if (exists) throw new ApiError(409, 'Email, username, or phone already exists');
  const user = await User.create({
    fullName: payload.fullName,
    username: payload.username,
    email: payload.email,
    phone: payload.phone,
    password: await hashPassword(payload.password),
    roleId: role._id
  });
  await createDefaultPaymentMethods(user._id);
  return makeSession(user, req, res);
}

export async function login(payload, req, res) {
  const user = await User.findOne({ email: payload.email }).populate('roleId');
  if (!user || !(await comparePassword(payload.password, user.password))) throw new ApiError(401, 'Invalid credentials');
  if (user.status !== 'Active') throw new ApiError(403, 'User account is inactive');
  return makeSession(user, req, res);
}

export async function googleLogin(payload, req, res) {
  const profile = await verifyGoogleCredential(payload.credential);
  const role = await Role.findOne({ name: ROLES.USER });
  let user = await User.findOne({ $or: [{ googleId: profile.sub }, { email: profile.email }] });

  if (user) {
    if (user.status !== 'Active') throw new ApiError(403, 'User account is inactive');
    if (!user.googleId) {
      user.googleId = profile.sub;
      user.authProvider = user.authProvider === 'local' ? 'local' : 'google';
      await user.save();
    }
    return makeSession(user, req, res);
  }

  user = await User.create({
    fullName: profile.name || profile.email,
    username: await makeUniqueUsername(profile.email, profile.sub),
    email: profile.email,
    phone: `google:${profile.sub}`,
    password: await hashPassword(`Google-${profile.sub}-${Date.now()}`),
    googleId: profile.sub,
    authProvider: 'google',
    roleId: role._id
  });
  await createDefaultPaymentMethods(user._id);
  return makeSession(user, req, res);
}

export async function refresh(req, res) {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) throw new ApiError(401, 'Refresh token required');
  const payload = jwt.verify(token, env.jwtRefreshSecret);
  const tokenDoc = await RefreshToken.findOne({ tokenHash: hashToken(token), userId: payload.userId, revoked: false });
  if (!tokenDoc || tokenDoc.expiresAt < new Date()) throw new ApiError(401, 'Invalid refresh token');
  const user = await User.findById(payload.userId).populate('roleId');
  if (!user || user.status !== 'Active') throw new ApiError(401, 'Authentication required');
  return { accessToken: signAccessToken(user) };
}

export async function logout(req, res) {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (token) await RefreshToken.updateOne({ tokenHash: hashToken(token) }, { revoked: true });
  res.clearCookie('refreshToken', refreshCookieOptions());
  return {};
}

export async function changePassword(req) {
  const user = await User.findById(req.user.userId);
  if (!user || !(await comparePassword(req.body.currentPassword, user.password))) throw new ApiError(401, 'Invalid current password');
  user.password = await hashPassword(req.body.newPassword);
  user.forcePasswordChange = false;
  await user.save();
  const populated = await user.populate('roleId');
  const permissions = await Permission.find({ roleId: populated.roleId._id });
  return { user: populated, role: populated.roleId.name, permissions, accessToken: signAccessToken(populated) };
}
