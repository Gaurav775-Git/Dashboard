import express from 'express'
import * as controller from '../controllers/auth.controller.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/authenticate.js'
import { loginLimiter, recoveryLimiter, refreshLimiter, registerLimiter } from '../middleware/rateLimiters.js'
import { registerSchema, loginSchema, emailSchema, tokenSchema, resetSchema, changePasswordSchema } from '../validators/auth.schemas.js'
const router = express.Router()
router.post('/register', registerLimiter, validate(registerSchema), controller.register)
router.post('/login', loginLimiter, validate(loginSchema), controller.login)
router.post('/logout', controller.logout)
router.post('/logout-all', authenticate, controller.logoutAll)
router.post('/refresh', refreshLimiter, controller.refresh)
router.get('/me', authenticate, controller.me)
router.post('/verify-email', validate(tokenSchema), controller.verifyEmail)
router.post('/resend-verification', recoveryLimiter, validate(emailSchema), controller.resendVerification)
router.post('/forgot-password', recoveryLimiter, validate(emailSchema), controller.forgotPassword)
router.post('/reset-password', validate(resetSchema), controller.resetPassword)
router.post('/change-password', authenticate, validate(changePasswordSchema), controller.changePassword)
export default router
