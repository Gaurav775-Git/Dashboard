import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import cors from 'cors'
import hpp from 'hpp'
import mongoSanitize from 'express-mongo-sanitize'
import pinoHttp from 'pino-http'
import authRoutes from './routes/auth.routes.js'
import { clientUrls } from './config/env.js'
import { csrf } from './middleware/csrf.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
const app = express()
app.disable('x-powered-by'); app.set('trust proxy', 1)
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, false)
    return callback(null, clientUrls.includes(origin) ? origin : false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Requested-With'],
}
app.use(helmet()); app.use(cors(corsOptions)); app.options('*', cors(corsOptions))
app.use(express.json({ limit: '10kb' })); app.use(cookieParser()); app.use(hpp()); app.use(mongoSanitize()); app.use(pinoHttp({ redact: ['req.headers.cookie', 'req.headers.authorization', 'req.body.password', 'req.body.currentPassword', 'req.body.newPassword', 'res.headers["set-cookie"]'] }))
app.use(csrf)
app.get('/api/health', (_req, res) => res.json({ success: true, data: { uptime: process.uptime(), database: 'connected' } }))
app.use('/api/auth', authRoutes)
app.use(notFound); app.use(errorHandler)
export default app
