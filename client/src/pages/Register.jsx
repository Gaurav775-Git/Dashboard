import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiAlertCircle, FiEye, FiEyeOff, FiLoader, FiLock, FiMail, FiShield, FiUser } from 'react-icons/fi'
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
          <FiAlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
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
              <FiUser className="h-5 w-5" aria-hidden="true" />
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
              <FiMail className="h-5 w-5" aria-hidden="true" />
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
              <FiLock className="h-5 w-5" aria-hidden="true" />
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
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <FiEye className="h-5 w-5" aria-hidden="true" />
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
              <FiShield className="h-5 w-5" aria-hidden="true" />
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
              <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" />
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