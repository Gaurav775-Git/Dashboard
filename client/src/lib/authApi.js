import { api } from './api'

const call = async (request) => (await request).data.data
export const register = (data) => call(api.post('/auth/register', data))
export const login = (data) => call(api.post('/auth/login', data))
export const logout = () => call(api.post('/auth/logout'))
export const logoutAll = () => call(api.post('/auth/logout-all'))
export const refresh = () => call(api.post('/auth/refresh'))
export const getMe = () => call(api.get('/auth/me'))
export const verifyEmail = (data) => call(api.post('/auth/verify-email', data))
export const resendVerification = (data) => call(api.post('/auth/resend-verification', data))
export const forgotPassword = (data) => call(api.post('/auth/forgot-password', data))
export const resetPassword = (data) => call(api.post('/auth/reset-password', data))
export const changePassword = (data) => call(api.post('/auth/change-password', data))
