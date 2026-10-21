import 'dotenv/config'
import { z } from 'zod'

export const normalizeOrigin = (value) => value.trim().replace(/\/+$/, '')

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1),
  CLIENT_URL: z.string().url().transform(normalizeOrigin),
  CLIENT_URLS: z.string().optional().default('').transform((value) => value.split(',').map((url) => normalizeOrigin(url)).filter(Boolean)),
  JWT_ACCESS_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(14),
  COOKIE_DOMAIN: z.string().optional().or(z.literal('')),
  COOKIE_SECURE: z.coerce.boolean().default(false),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  REQUIRE_EMAIL_VERIFICATION: z.coerce.boolean().default(false),
  TRUST_PROXY: z.coerce.boolean().default(false),
  SMTP_HOST: z.string().optional().or(z.literal('')),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional().or(z.literal('')),
  SMTP_PASS: z.string().optional().or(z.literal('')),
  EMAIL_FROM: z.string().default('Rankfasta <no-reply@rankfasta.com>'),
})

const result = schema.safeParse(process.env)
if (!result.success) {
  throw new Error(`Invalid environment: ${result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')}`)
}
export const env = result.data
export const clientUrls = [...new Set([env.CLIENT_URL, ...env.CLIENT_URLS])]
