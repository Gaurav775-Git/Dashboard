import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'

const app = express()

// The frontend sends the JWT in Authorization, so cookies are not needed.
app.use(cors({
  origin: true,
  credentials: false,
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())
app.use('/api/auth', authRoutes)

export default app
