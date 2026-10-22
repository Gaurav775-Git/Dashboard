import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Ensure your VITE_API_URL ends with /api
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

// 1. Automatically attach the JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 2. Simple error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the token is invalid/expired (401), log the user out
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }
    
    // Throw a clean error for your UI to catch
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || 'Something went wrong. Please try again.',
    }
  }
)