import express from 'express'
import * as controller from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/authenticate.js'

const router = express.Router()

router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/logout', controller.logout)
router.post('/refresh', controller.refresh)
router.get('/me', authenticate, controller.me)
router.post('/change-password', authenticate, controller.changePassword)

router.post('/forgot-password', controller.forgotPassword)
router.post('/reset-password', controller.resetPassword)

export default router