import { z } from 'zod'

const password = z.string().min(10, 'Use at least 10 characters.').max(128).regex(/[A-Za-z]/, 'Include at least one letter.').regex(/[0-9]/, 'Include at least one number.')
export const loginSchema = z.object({ email: z.string().email('Enter a valid email.'), password: z.string().min(1, 'Enter your password.') })
export const registerSchema = z.object({
  name: z.string().min(1, 'Enter your full name.'),
  email: z.string().email('Enter a valid work email.'),
  company: z.string().optional(),
  password,
  confirmPassword: z.string(),
  terms: z.literal(true, { errorMap: () => ({ message: 'Accept the Terms and Privacy Policy.' }) }),
}).refine((data) => data.password === data.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match.' })
export const resetSchema = z.object({ password, confirmPassword: z.string() }).refine((data) => data.password === data.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match.' })
export const emailSchema = z.object({ email: z.string().email('Enter a valid email.') })
export const passwordRules = (value, identity = '') => ({
  length: value.length >= 10,
  letter: /[A-Za-z]/.test(value),
  number: /\d/.test(value),
  identity: Boolean(value) && !identity.toLowerCase().includes(value.toLowerCase()),
})
