import axios from 'axios'

const authFreePaths = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email']
let refreshPromise = null

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config
    const path = request?.url || ''
    if (error.response?.status === 401 && request && !request._retry && !authFreePaths.some((item) => path.includes(item))) {
      request._retry = true
      refreshPromise ||= api.post('/auth/refresh').finally(() => { refreshPromise = null })
      try {
        await refreshPromise
        return api(request)
      } catch (refreshError) {
        window.dispatchEvent(new CustomEvent('auth:logout'))
        throw refreshError
      }
    }
    const response = error.response
    const backend = response?.data?.error
    throw {
      status: response?.status,
      code: backend?.code,
      message: backend?.message,
      details: backend?.details,
      retryAfter: response?.headers?.['retry-after'],
    }
  },
)
