import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import cors from 'cors'
import hpp from 'hpp'
import mongoSanitize from 'express-mongo-sanitize'
import pinoHttp from 'pino-http'
import authRoutes from './routes/auth.routes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'

const app = express()

app.disable('x-powered-by')
app.set('trust proxy', 1)

// Open CORS for all origins (with credentials support)
const corsOptions = {
  origin: true, // reflect any origin
  credentials: true, // allow cookies / auth headers
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Requested-With', 'X-CSRF-Token'],
}

// Security & parsing
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)

app.use(cors(corsOptions))
// No need for app.options('*', cors(...)) — cors() handles preflight automatically
// and '*' as a path breaks in Express 5.

app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())
app.use(hpp())
app.use(mongoSanitize())

app.use(
  pinoHttp({
    redact: [
      'req.headers.cookie',
      'req.headers.authorization',
      'req.body.password',
      'req.body.currentPassword',
      'req.body.newPassword',
      'res.headers["set-cookie"]',
    ],
  })
)

// Health check
app.get('/api/health', (_req, res) =>
  res.json({
    success: true,
    data: { uptime: process.uptime(), database: 'connected' },
  })
)

// Routes
app.use('/api/auth', authRoutes)

// 404 & error handling (must be last)
app.use(notFound)
app.use(errorHandler)

export default app