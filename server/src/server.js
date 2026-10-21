import http from 'node:http'
import app from './app.js'
import { env } from './config/env.js'
import { connectDb, disconnectDb } from './config/db.js'
const server = http.createServer(app)
await connectDb()
server.listen(env.PORT, () => console.info(`Rankfasta API listening on ${env.PORT}`))
const shutdown = async () => { server.close(async () => { await disconnectDb(); process.exit(0) }) }
process.on('SIGTERM', shutdown); process.on('SIGINT', shutdown)
process.on('unhandledRejection', (error) => { console.error(error); shutdown() })
