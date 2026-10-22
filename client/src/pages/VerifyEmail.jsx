import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import Button from '../components/ui/Button'

const VerifyEmail = () => {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [state, setState] = useState(token ? 'loading' : 'error')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) return
    api
      .post('/auth/verify-email', { token })
      .then(() => setState('success'))
      .catch((err) => {
        setState('error')
        setMessage(err.message)
      })
  }, [token])

  const resend = async () => {
    const email = window.prompt('Enter your email address')
    if (!email) return
    try {
      await api.post('/auth/resend-verification', { email })
      setMessage('If the account is eligible, a verification email has been sent.')
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="text-center">
      {state === 'loading' && <p className="text-rf-muted">Verifying your email...</p>}

      {state === 'success' && (
        <>
          <h1 className="text-2xl font-bold text-rf-text">Email verified</h1>
          <p className="mt-3 text-sm text-rf-muted">Your account is ready to use.</p>
          <Link to="/login">
            <Button className="mt-6">Log in</Button>
          </Link>
        </>
      )}

      {state === 'error' && (
        <>
          <h1 className="text-2xl font-bold text-rf-text">Verification failed</h1>
          <p role="alert" className="mt-3 text-sm text-rf-danger">
            {message || 'This link is invalid or expired.'}
          </p>
          <Button onClick={resend} className="mt-6">Resend email</Button>
        </>
      )}
    </div>
  )
}

export default VerifyEmail