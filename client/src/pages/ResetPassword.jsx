import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '../lib/api'
import PasswordInput from '../components/ui/PasswordInput'
import Button from '../components/ui/Button'

const resetSchema = z
  .object({
    password: z.string().min(6, 'Use at least 6 characters.'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

const ResetPassword = () => {
  const [params] = useSearchParams()
  const token = params.get('token')
  const navigate = useNavigate()
  const [error, setError] = useState(token ? '' : 'This reset link is missing or invalid.')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const submit = async ({ password }) => {
    setError('')
    try {
      await api.post('/auth/reset-password', { token, password })
      navigate('/login', { state: { message: 'Password reset successfully.' } })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <h1 className="text-2xl font-bold text-rf-text">Set a new password</h1>
      {error && <p role="alert" className="mt-4 text-sm text-rf-danger">{error}</p>}

      <div className="mt-6 space-y-4">
        <PasswordInput
          label="New password"
          id="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordInput
          label="Confirm password"
          id="confirmPassword"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      <Button type="submit" disabled={isSubmitting || !token} className="mt-6 w-full">
        {isSubmitting ? 'Resetting...' : 'Reset password'}
      </Button>

      <p className="mt-6 text-center text-sm">
        <Link to="/forgot-password" className="text-rf-primary-light">Request a new link</Link>
      </p>
    </form>
  )
}

export default ResetPassword