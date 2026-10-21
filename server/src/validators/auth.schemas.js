import { z } from 'zod'
const email = z.string().trim().email().max(254).toLowerCase()
const password = z.string().min(10).max(128)
export const registerSchema = z.object({ name: z.string().trim().min(2).max(80), email, password, company: z.string().trim().max(120).optional() }).strict()
export const loginSchema = z.object({ email, password }).strict()
export const emailSchema = z.object({ email }).strict()
export const tokenSchema = z.object({ token: z.string().min(1) }).strict()
export const resetSchema = z.object({ token: z.string().min(1), password }).strict()
export const changePasswordSchema = z.object({ currentPassword: password, newPassword: password }).strict()
