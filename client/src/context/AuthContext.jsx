/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as authApi from '../lib/authApi'

const AuthContext = createContext(null)
const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window ? new BroadcastChannel('rankfasta-auth') : null

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading')

  const refreshUser = async () => {
    try {
      const result = await authApi.getMe()
      setUser(result?.user || result)
      setStatus('authenticated')
      return result
    } catch {
      setUser(null)
      setStatus('unauthenticated')
      return null
    }
  }
  useEffect(() => {
    let active = true
    authApi.getMe().then((result) => {
      if (active) { setUser(result?.user || result); setStatus('authenticated') }
    }).catch(() => {
      if (active) { setUser(null); setStatus('unauthenticated') }
    })
    const handleLogout = () => { setUser(null); setStatus('unauthenticated') }
    window.addEventListener('auth:logout', handleLogout)
    channel?.addEventListener('message', handleLogout)
    return () => { active = false; window.removeEventListener('auth:logout', handleLogout); channel?.removeEventListener('message', handleLogout) }
  }, [])
  const value = useMemo(() => ({
    user, status, refreshUser,
    async login(credentials) { const result = await authApi.login(credentials); setUser(result?.user || result); setStatus('authenticated'); return result },
    async register(data) { const result = await authApi.register(data); if (result?.user) { setUser(result.user); setStatus('authenticated') }; return result },
    async logout() { try { await authApi.logout() } finally { setUser(null); setStatus('unauthenticated'); channel?.postMessage('logout') } },
  }), [user, status])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
