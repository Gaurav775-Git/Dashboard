import { useState } from 'react'

const ADMIN_PASSWORD = '12345678' // 👈 Change this to whatever you want

const AdminPasswordGate = ({ children }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  // Check if already authenticated in this session
  const isAuthenticated = sessionStorage.getItem('admin_auth') === 'true'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      setError('')
      // Force a re-render to show the children
      window.location.reload() 
    } else {
      setError('Incorrect password')
    }
  }

  if (isAuthenticated) {
    return children
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="mt-2 text-sm text-slate-400">Enter the master password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-400 border border-red-500/20">
              {error}
            </div>
          )}
          
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-center text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminPasswordGate