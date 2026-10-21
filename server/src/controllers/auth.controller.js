import { asyncHandler } from '../utils/asyncHandler.js'
import { clearAuthCookies, setAuthCookies } from '../utils/cookies.js'
import * as service from '../services/auth.service.js'
import Session from '../models/Session.js'
import { hashToken } from '../utils/crypto.js'
const meta = (req) => ({ userAgent: req.get('user-agent'), ip: req.ip })
const ok = (res, data = {}) => res.json({ success: true, data })
export const register = asyncHandler(async (req, res) => { const data = await service.register(req.body, meta(req)); if (data.accessToken) setAuthCookies(res, data.accessToken, data.refreshToken); ok(res, { user: data.user }) })
export const login = asyncHandler(async (req, res) => { const data = await service.login(req.body, meta(req)); setAuthCookies(res, data.accessToken, data.refreshToken); ok(res, { user: data.user }) })
export const logout = asyncHandler(async (req, res) => { if (req.cookies.refresh_token) await Session.updateOne({ tokenHash: hashToken(req.cookies.refresh_token) }, { revokedAt: new Date() }); clearAuthCookies(res); ok(res) })
export const logoutAll = asyncHandler(async (req, res) => { await Session.updateMany({ user: req.user._id, revokedAt: null }, { revokedAt: new Date() }); clearAuthCookies(res); ok(res) })
export const refresh = asyncHandler(async (req, res) => { const data = await service.refresh(req.cookies.refresh_token, meta(req)); setAuthCookies(res, data.accessToken, data.refreshToken); ok(res, { user: data.user }) })
export const me = asyncHandler(async (req, res) => ok(res, { user: req.user }))
export const verifyEmail = asyncHandler(async (req, res) => { await service.verifyEmail(req.body.token); ok(res, { message: 'Email verified.' }) })
export const resendVerification = asyncHandler(async (_req, res) => ok(res, { message: 'If an account requires verification, an email will be sent.' }))
export const forgotPassword = asyncHandler(async (req, res) => { await service.forgotPassword(req.body.email); ok(res, { message: 'If an account exists, password reset instructions will be sent.' }) })
export const resetPassword = asyncHandler(async (req, res) => { await service.resetPassword(req.body.token, req.body.password); ok(res, { message: 'Password reset.' }) })
export const changePassword = asyncHandler(async (req, res) => { await service.changePassword(req.user, req.body.currentPassword, req.body.newPassword); clearAuthCookies(res); ok(res, { message: 'Password changed. Please log in again.' }) })
