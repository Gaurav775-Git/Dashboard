import { createContext, useContext, useState, useEffect } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 1. Check for token on initial load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (token && storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setLoading(false)
    }

    checkAuth()

    // Listen for the logout event triggered by Axios interceptor (401 errors)
    const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    }

    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  // 2. Login function
  const login = async (data) => {
    const response = await authApi.login(data)
    
    // Save to localStorage
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    
    // Update state
    setUser(response.user)
    return response
  }

  // 3. Register function
  const register = async (data) => {
    const response = await authApi.register(data)
    
    // Save to localStorage
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    
    // Update state
    setUser(response.user)
    return response
  }

  // 4. Logout function
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)