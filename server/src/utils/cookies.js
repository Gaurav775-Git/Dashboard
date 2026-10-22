import { env } from '../config/env.js'

const base = {
  httpOnly: true,
  secure: true, // MUST be true on Render
  sameSite: 'none', // MUST be 'none' for cross-origin frontend/backend
  domain: undefined // Let Render handle the domain
}

export const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('access_token', accessToken, {
    ...base,
    path: '/',
    maxAge: 15 * 60 * 1000, 
  })
  res.cookie('refresh_token', refreshToken, {
    ...base,
    path: '/api/auth', // Must match the refresh route
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export const clearAuthCookies = (res) => {
  res.clearCookie('access_token', { ...base, path: '/' })
  res.clearCookie('refresh_token', { ...base, path: '/api/auth' })
}