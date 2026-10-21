import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetSchema } from '../validators/authSchemas'
import { resetPassword } from '../lib/authApi'
import { mapApiError } from '../lib/errors'
import PasswordInput from '../components/ui/PasswordInput'
import Button from '../components/ui/Button'
const ResetPassword = () => { const [params] = useSearchParams(); const token = params.get('token'); const navigate = useNavigate(); const [error, setError] = useState(!token ? 'This reset link is missing or invalid.' : ''); const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(resetSchema) }); const submit = async (data) => { try { await resetPassword({ token, password: data.password }); navigate('/login', { state: { message: 'Password reset successfully.' } }) } catch (caught) { setError(mapApiError(caught).message) } }; return <form onSubmit={handleSubmit(submit)}><h1 className="text-2xl font-bold text-rf-text">Set a new password</h1>{error && <p role="alert" className="mt-4 text-sm text-rf-danger">{error}</p>}<div className="mt-6 space-y-4"><PasswordInput label="New password" id="password" autoComplete="new-password" {...register('password')} error={errors.password?.message} /><PasswordInput label="Confirm password" id="confirmPassword" autoComplete="new-password" {...register('confirmPassword')} error={errors.confirmPassword?.message} /></div><Button type="submit" disabled={isSubmitting || !token} className="mt-6 w-full">Reset password</Button><p className="mt-6 text-center text-sm"><Link to="/forgot-password" className="text-rf-primary-light">Request a new link</Link></p></form> }
export default ResetPassword
