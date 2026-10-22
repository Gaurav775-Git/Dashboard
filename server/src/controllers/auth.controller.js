import * as authService from '../services/auth.service.js'
import { setAuthCookies, clearAuthCookies } from '../utils/cookies.js'

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
  clearAuthCookies(res)
  return respond(res, 200, { ok: true })
}

export const me = async (req, res) => {
  return respond(res, 200, { user: req.user.toJSON() })
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