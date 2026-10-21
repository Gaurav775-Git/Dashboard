import { z } from 'zod'

const requiredString = (message) => z.string({ error: message }).min(1, message)
const password = requiredString('Password is required').max(128).min(10, 'Use at least 10 characters.').regex(/[A-Za-z]/, 'Include at least one letter.').regex(/[0-9]/, 'Include at least one number.')
export const loginSchema = z.object({ email: z.string({ error: 'Email is required' }).email('Enter a valid email.'), password: requiredString('Password is required') })
export const registerSchema = z.object({
  name: requiredString('Name is required'),
  email: z.string({ error: 'Email is required' }).email('Enter a valid work email.'),
  company: z.string(),
  password,
  confirmPassword: requiredString('Confirm password is required'),
  terms: z.literal(true, { errorMap: () => ({ message: 'Accept the Terms and Privacy Policy.' }) }),
}).refine((data) => data.password === data.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' })
export const resetSchema = z.object({ password, confirmPassword: requiredString('Confirm password is required') }).refine((data) => data.password === data.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' })
export const emailSchema = z.object({ email: z.string({ error: 'Email is required' }).email('Enter a valid email.') })
export const passwordRules = (value, identity = '') => ({
  length: value.length >= 10,
  letter: /[A-Za-z]/.test(value),
  number: /\d/.test(value),
  identity: Boolean(value) && !identity.toLowerCase().includes(value.toLowerCase()),
})
