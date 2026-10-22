import rateLimit from 'express-rate-limit'

// Dummy middleware that lets everything pass (No limits for testing)
const bypassLimiter = (req, res, next) => next();

export const loginLimiter = bypassLimiter;
export const registerLimiter = bypassLimiter;
export const recoveryLimiter = bypassLimiter;
export const refreshLimiter = bypassLimiter;