import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '../lib/api'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const emailSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email.'),
})

const ForgotPassword = () => {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(emailSchema), defaultValues: { email: '' } })

  const submit = async (data) => {
    setError('')
    try {
      await api.post('/auth/forgot-password', data)
      setSent(true)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <h1 className="text-2xl font-bold text-rf-text">Forgot password?</h1>
      <p className="mt-2 text-sm text-rf-muted">Enter your email and we’ll send reset instructions.</p>

      {sent && (
        <div role="status" className="mt-5 rounded-lg bg-rf-primary/10 p-3 text-sm text-rf-primary-light">
          If an account exists for that email, we’ve sent a reset link.
        </div>
      )}
      {error && <p role="alert" className="mt-4 text-sm text-rf-danger">{error}</p>}

      <div className="mt-6">
        <Input label="Email" id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email && <p className="text-xs text-rf-danger">{errors.email.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-6 w-full">
        {isSubmitting ? 'Sending...' : 'Send reset link'}
      </Button>

      <p className="mt-6 text-center text-sm">
        <Link to="/login" className="text-rf-primary-light">Back to login</Link>
      </p>
    </form>
  )
}

export default ForgotPassword