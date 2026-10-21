import rateLimit from 'express-rate-limit'
const limiter = (max, windowMs) => rateLimit({ max, windowMs, standardHeaders: true, legacyHeaders: false, message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Try again later.' } } })
export const loginLimiter = limiter(10, 900000)
export const registerLimiter = limiter(5, 3600000)
export const recoveryLimiter = limiter(5, 3600000)
export const refreshLimiter = limiter(60, 900000)
