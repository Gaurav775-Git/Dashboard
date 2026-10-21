import { env } from '../config/env.js'
const base = { httpOnly: true, secure: env.COOKIE_SECURE, sameSite: 'lax', domain: env.COOKIE_DOMAIN || undefined }
export const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('access_token', accessToken, { ...base, path: '/', maxAge: 900000 })
  res.cookie('refresh_token', refreshToken, { ...base, path: '/api/auth', maxAge: env.REFRESH_TOKEN_TTL_DAYS * 86400000 })
}
export const clearAuthCookies = (res) => {
  res.clearCookie('access_token', { ...base, path: '/' })
  res.clearCookie('refresh_token', { ...base, path: '/api/auth' })
}
