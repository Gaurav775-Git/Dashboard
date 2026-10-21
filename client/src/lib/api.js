import axios from 'axios'

const authFreePaths = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email']
let refreshPromise = null

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 60000,
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
    const isBackendEnvelope = response?.data?.success === false && backend && typeof backend === 'object'
    throw {
      status: response?.status,
      code: isBackendEnvelope ? backend.code : 'SERVER_UNREACHABLE',
      message: isBackendEnvelope ? backend.message : "Can't reach the server. Please try again.",
      details: isBackendEnvelope ? backend.details : undefined,
      retryAfter: response?.headers?.['retry-after'],
    }
  },
)
