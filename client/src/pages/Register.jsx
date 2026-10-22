import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../validators/authSchemas'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const { user, register: signUp } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  if (user) return <Navigate to="/dashboard" replace />

  const submit = async ({ name, email, password }) => {
    setError('')
    try {
      await signUp({ name, email, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to create account.')
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
        <p className="text-slate-400 text-sm">Start improving your search visibility.</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="name"
              autoComplete="name"
              placeholder="John Doe"
              className={`w-full rounded-xl border border-slate-700 bg-slate-900/50 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 ${
                errors.name ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : ''
              }`}
              {...register('name')}
            />
          </div>
          {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className={`w-full rounded-xl border border-slate-700 bg-slate-900/50 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 ${
                errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : ''
              }`}
              {...register('email')}
            />
          </div>
          {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              className={`w-full rounded-xl border border-slate-700 bg-slate-900/50 pl-11 pr-12 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 ${
                errors.password ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : ''
              }`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-indigo-400 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-300">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className={`w-full rounded-xl border border-slate-700 bg-slate-900/50 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 ${
                errors.confirmPassword ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : ''
              }`}
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-70 mt-4"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </button>
      </form>

      {/* Footer Link */}
      <p className="mt-8 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
          Log in
        </Link>
      </p>
    </div>
  )
}

export default Register