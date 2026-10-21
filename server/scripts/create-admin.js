import { connectDb, disconnectDb } from '../src/config/db.js'
import User from '../src/models/User.js'
import { hashPassword, validatePasswordPolicy } from '../src/services/password.service.js'
const [name, email, password] = process.argv.slice(2)
if (!name || !email || !password) throw new Error('Usage: node scripts/create-admin.js "Name" email password')
await connectDb(); validatePasswordPolicy(password, email, name)
await User.create({ name, email: email.toLowerCase(), passwordHash: await hashPassword(password), role: 'admin', emailVerified: true })
await disconnectDb()
