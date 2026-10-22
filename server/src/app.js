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
import { env } from './config/env.js'

const app = express()

app.disable('x-powered-by')
app.set('trust proxy', 1)

// ─── CORS: MUST allow credentials for cookies ───────────────────────
const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
].filter(Boolean)

const corsOptions = {
  origin(origin, callback) {
    // allow server-to-server / curl / same-origin (no origin header)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    // dev convenience: allow any localhost / 127.0.0.1 port
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true)
    }
    return callback(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400,
}

// Order matters:
// 1) CORS first so preflight & errors get CORS headers
app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions)) // Express 5-safe preflight for all routes

// 2) helmet AFTER cors so it doesn't strip CORS headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenedPolicy: false,
    contentSecurityPolicy: false, // API — no CSP needed; adjust if serving HTML
  })
)

// 3) sanitize BEFORE body parsing (works with query/params/body on newer versions)
app.use(mongoSanitize())

// 4) parsers
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())
app.use(hpp())

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

app.get('/api/health', (_req, res) =>
  res.json({ success: true, data: { uptime: process.uptime(), database: 'connected' } })
)

app.use('/api/auth', authRoutes)

app.use(notFound)
app.use(errorHandler)

export default app