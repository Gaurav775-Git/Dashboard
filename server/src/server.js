import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js'

const port = process.env.PORT || 5000
const mongoUri = process.env.MONGODB_URI

if (!mongoUri) {
  throw new Error('MONGODB_URI is not configured')
}

await mongoose.connect(mongoUri)

const server = app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})

const shutdown = async () => {
  await mongoose.connection.close()
  server.close(() => process.exit(0))
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
