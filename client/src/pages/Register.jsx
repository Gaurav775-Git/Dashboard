import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, passwordRules } from '../validators/authSchemas'
import { useAuth } from '../context/AuthContext'
import { mapApiError } from '../lib/errors'
import Input from '../components/ui/Input'
import PasswordInput from '../components/ui/PasswordInput'
import Button from '../components/ui/Button'

const Register = () => {
  const { register: signUp } = useAuth(); const navigate = useNavigate(); const [error, setError] = useState(''); const [password, setPassword] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError: setFieldError } = useForm({ resolver: zodResolver(registerSchema), mode: 'onBlur', defaultValues: { terms: false } })
  const submit = async (data) => { setError(''); try { const payload = { name: data.name, email: data.email, company: data.company, password: data.password }; const result = await signUp(payload); if (result?.user || result) navigate('/', { replace: true }); else navigate('/verify-email', { replace: true }) } catch (caught) { const mapped = mapApiError(caught); Object.entries(mapped.fields).forEach(([field, message]) => setFieldError(field, { message })); setError(mapped.message) } }
  const rules = passwordRules(password)
  return <form onSubmit={handleSubmit(submit)} noValidate><h1 className="text-2xl font-bold text-rf-text">Create your account</h1><p className="mt-2 text-sm text-rf-muted">Start improving your search visibility.</p>{error && <div role="alert" className="mt-5 rounded-lg border border-rf-danger/40 bg-rf-danger/10 p-3 text-sm text-rf-danger">{error}</div>}<div className="mt-6 space-y-4"><div><Input label="Full name" id="name" autoComplete="name" {...register('name')} />{errors.name && <p className="text-xs text-rf-danger">{errors.name.message}</p>}</div><div><Input label="Work email" id="email" type="email" autoComplete="email" {...register('email')} />{errors.email && <p className="text-xs text-rf-danger">{errors.email.message}</p>}</div><div><Input label="Company (optional)" id="company" autoComplete="organization" {...register('company')} /></div><PasswordInput label="Password" id="password" autoComplete="new-password" onChange={(event) => { setPassword(event.target.value); register('password').onChange(event) }} error={errors.password?.message} />{password && <ul className="space-y-1 text-xs text-rf-muted">{[['length', '10+ characters'], ['letter', 'At least one letter'], ['number', 'At least one number'], ['identity', 'Not your email or name']].map(([key, label]) => <li key={key} className={rules[key] ? 'text-rf-success' : ''}>{rules[key] ? '✓' : '○'} {label}</li>)}</ul>}<PasswordInput label="Confirm password" id="confirmPassword" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} /><label className="flex items-start gap-2 text-sm text-rf-muted"><input type="checkbox" className="mt-1 accent-rf-primary" {...register('terms')} /> <span>I agree to the Terms and Privacy Policy.</span></label>{errors.terms && <p className="text-xs text-rf-danger">{errors.terms.message}</p>}</div><Button type="submit" disabled={isSubmitting} className="mt-6 w-full">{isSubmitting ? 'Creating account...' : 'Create account'}</Button><p className="mt-6 text-center text-sm text-rf-muted">Already have an account? <Link to="/login" className="font-semibold text-rf-primary-light">Log in</Link></p></form>
}
export default Register
