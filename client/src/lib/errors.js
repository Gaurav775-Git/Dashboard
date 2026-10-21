export const friendlyMessage = (error) => {
  if (error?.code === 'INVALID_CREDENTIALS') return 'Invalid email or password.'
  if (error?.code === 'ACCOUNT_LOCKED') return 'Too many attempts. Try again in 15 minutes.'
  if (error?.code === 'EMAIL_NOT_VERIFIED') return 'Please verify your email before logging in.'
  if (error?.code === 'RATE_LIMITED') return `Too many requests. Try again in ${error.retryAfter || 60} seconds.`
  if (error?.status === 409) return 'An account with this email already exists.'
  if (error?.status >= 500) return 'Something went wrong. Please try again.'
  if (!error?.status) return 'Network error. Check your connection.'
  return error.message || 'Something went wrong. Please try again.'
}

export const mapApiError = (error) => {
  const normalized = { ...error, message: friendlyMessage(error) }
  const fields = {}
  if (Array.isArray(error?.details)) {
    error.details.forEach((detail) => {
      const field = detail.path?.[0] || detail.field
      if (field) fields[field] = detail.message
    })
  } else if (error?.details && typeof error.details === 'object') {
    Object.assign(fields, error.details)
  }
  return { ...normalized, fields }
}
