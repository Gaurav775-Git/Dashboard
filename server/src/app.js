import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'

const app = express()

app.set('trust proxy', 1)
app.disable('x-powered-by')

// ✅ BULLETPROOF CORS (Allow anything, allow cookies)
app.use(cors({
  origin: true, // Reflects the request origin
  credentials: true, // Allows cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)

// ✅ Add a catch-all GET for login just in case a redirect happens
app.get('/api/auth/login', (req, res) => {
  res.status(200).json({ success: true, message: "You made a GET request. You must use POST to login." })
})

app.use(notFound)
app.use(errorHandler)

export default app