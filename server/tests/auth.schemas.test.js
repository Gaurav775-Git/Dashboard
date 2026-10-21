import { describe, expect, it } from 'vitest'
import { loginSchema, registerSchema } from '../src/validators/auth.schemas.js'
import { validatePasswordPolicy } from '../src/services/password.service.js'

describe('authentication validation', () => {
  it('normalizes emails and rejects unknown registration fields', () => {
    const result = registerSchema.safeParse({ name: 'Alex Carter', email: ' ALEX@example.com ', password: 'A-secure-pass1', unexpected: true })
    expect(result.success).toBe(false)
    expect(registerSchema.parse({ name: 'Alex Carter', email: ' ALEX@example.com ', password: 'A-secure-pass1' }).email).toBe('alex@example.com')
  })

  it('rejects weak passwords and accepts passphrases with letters and numbers', () => {
    expect(() => validatePasswordPolicy('password1', 'alex@example.com', 'Alex')).toThrow()
    expect(() => validatePasswordPolicy('A-longer-passphrase-42', 'alex@example.com', 'Alex')).not.toThrow()
  })

  it('requires both fields for login', () => {
    expect(loginSchema.safeParse({ email: 'alex@example.com' }).success).toBe(false)
  })
})
