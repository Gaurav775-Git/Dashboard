import rateLimit from 'express-rate-limit'

/**
 * Helper function to create a rate limiter.
 * We disable the trust proxy validation to prevent crashes on Render/Heroku.
 */
const limiter = (max, windowMs) =>
  rateLimit({
    max,
    windowMs,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
    // This prevents express-rate-limit from throwing an error if Render's proxy
    // is not perfectly detected. It will safely fall back to the request IP.
    validate: { trustProxy: false },
    message: {
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Please try again later.',
      },
    },
  })

// 15 minutes window for login/refresh
const FIFTEEN_MINUTES = 15 * 60 * 1000
// 1 hour window for register/recovery
const ONE_HOUR = 60 * 60 * 1000

// Increased from 10 to 50 for easier testing and better UX
export const loginLimiter = limiter(50, FIFTEEN_MINUTES)

// Increased from 5 to 20 for easier testing
export const registerLimiter = limiter(20, ONE_HOUR)

// Increased from 5 to 20 for easier testing
export const recoveryLimiter = limiter(20, ONE_HOUR)

// Increased from 60 to 200 (Refresh happens frequently in background)
export const refreshLimiter = limiter(200, FIFTEEN_MINUTES)