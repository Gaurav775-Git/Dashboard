import express from 'express'
import * as controller from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/authenticate.js'
// Temporarily remove limiters and validators for login to debug
import { loginLimiter } from '../middleware/rateLimiters.js' 

const router = express.Router()

// We keep the limiter (which is now bypassed)
router.post('/login', loginLimiter, controller.login)
router.post('/register', controller.register)
router.post('/refresh', controller.refresh)
router.get('/me', authenticate, controller.me)
router.post('/logout', controller.logout)

export default router