import express from 'express'
import { authenticate, login, me, register } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticate, me)

export default router
