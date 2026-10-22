import { env } from '../config/env.js'
import * as authService from '../services/auth.service.js'
import { setAuthCookies, clearAuthCookies } from '../utils/cookies.js' // adjust path if needed
import { ApiError } from '../utils/ApiError.js'

const meta = (req) => ({
  userAgent: req.headers['user-agent'] || '',
  ip: req.ip,
})

const respond = (res, status, data) =>
  res.status(status).json({ success: true, data })

const respondWithAuth = (res, status, result) => {
  setAuthCookies(res, result.accessToken, result.refreshToken)
  return respond(res, status, { user: result.user })
}

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body, meta(req))
    // No tokens if email verification is required
    if (!result.accessToken) {
      return respond(res, 201, {
        user: result.user,
        requiresVerification: true,
      })
    }
    return respondWithAuth(res, 201, result)
  } catch (e) { next(e) }
}

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body, meta(req))
    return respondWithAuth(res, 200, result)
  } catch (e) { next(e) }
}

export const refresh = async (req, res, next) => {
  try {
    const raw = req.cookies.refresh_token
    const result = await authService.refresh(raw, meta(req))
    return respondWithAuth(res, 200, result)
  } catch (e) { next(e) }
}

export const logout = async (req, res) => {
  // Best-effort revoke current session
  try {
    const raw = req.cookies.refresh_token
    if (raw) await authService.logout?.(raw).catch(() => {})
  } catch {}
  clearAuthCookies(res)
  return respond(res, 200, { ok: true })
}

export const logoutAll = async (req, res, next) => {
  try {
    await authService.logoutAll?.(req.user._id)
    clearAuthCookies(res)
    return respond(res, 200, { ok: true })
  } catch (e) { next(e) }
}

export const me = async (req, res) => respond(res, 200, { user: req.user.toJSON() })

export const verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.body.token)
    return respond(res, 200, { ok: true })
  } catch (e) { next(e) }
}

export const resendVerification = async (req, res, next) => {
  try {
    await authService.resendVerification?.(req.body.email)
    return respond(res, 200, { ok: true })
  } catch (e) { next(e) }
}

export const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email)
    return respond(res, 200, { ok: true })
  } catch (e) { next(e) }
}

export const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body.token, req.body.password)
    return respond(res, 200, { ok: true })
  } catch (e) { next(e) }
}

export const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user, req.body.currentPassword, req.body.newPassword)
    clearAuthCookies(res)
    return respond(res, 200, { ok: true })
  } catch (e) { next(e) }
}