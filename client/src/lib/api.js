import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 60000, // Render free tier can take ~50s to wake up
  headers: { 'Content-Type': 'application/json' },
})

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Turn every failure into a plain Error with a readable message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expired or invalid -> log out
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token')
      window.dispatchEvent(new Event('auth:logout'))
    }

    let message = error.response?.data?.message
    if (!message) {
      message = error.request
        ? 'Cannot reach the server. Please try again in a moment.'
        : 'Something went wrong. Please try again.'
    }
    return Promise.reject(new Error(message))
  }
)