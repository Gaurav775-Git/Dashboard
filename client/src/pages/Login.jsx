import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../validators/authSchemas'
import { useAuth } from '../context/AuthContext'
import { mapApiError } from '../lib/errors'
import Input from '../components/ui/Input'
import PasswordInput from '../components/ui/PasswordInput'
import Button from '../components/ui/Button'

const Login = () => {
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation(); const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError: setFieldError } = useForm({ resolver: zodResolver(loginSchema), mode: 'onBlur' })
  const submit = async (data) => { setError(''); try { await login(data); const from = location.state?.from; navigate(from?.pathname?.startsWith('/') ? `${from.pathname}${from.search || ''}` : '/', { replace: true }) } catch (caught) { const mapped = mapApiError(caught); Object.entries(mapped.fields).forEach(([field, message]) => setFieldError(field, { message })); setError(mapped.message) } }
  return <form onSubmit={handleSubmit(submit)} noValidate><h1 className="text-2xl font-bold text-rf-text">Welcome back</h1><p className="mt-2 text-sm text-rf-muted">Log in to your Rankfasta portal.</p>{error && <div role="alert" className="mt-5 rounded-lg border border-rf-danger/40 bg-rf-danger/10 p-3 text-sm text-rf-danger">{error}</div>}<div className="mt-6 space-y-4"><Input label="Email" id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register('email')} />{errors.email && <p className="text-xs text-rf-danger">{errors.email.message}</p>}<PasswordInput label="Password" id="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} /></div><div className="mt-3 text-right"><Link to="/forgot-password" className="text-sm text-rf-primary-light hover:underline">Forgot password?</Link></div><Button type="submit" disabled={isSubmitting} className="mt-6 w-full">{isSubmitting ? 'Logging in...' : 'Log in'}</Button><p className="mt-6 text-center text-sm text-rf-muted">New to Rankfasta? <Link to="/register" className="font-semibold text-rf-primary-light">Create an account</Link></p></form>
}
export default Login
