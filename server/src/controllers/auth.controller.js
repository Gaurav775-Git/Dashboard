import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Keep the secret in an environment variable. JWT_ACCESS_SECRET is supported
// as well so existing deployments do not need an immediate variable rename.
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }
  return secret
}

const createToken = (userId) =>
  jwt.sign({ userId }, getJwtSecret(), { expiresIn: '7d' })

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
})

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    })

    return res.status(201).json({
      token: createToken(user._id.toString()),
      user: publicUser(user),
    })
  } catch (error) {
    console.error('Registration failed:', error)
    return res.status(500).json({ message: 'Registration failed' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password')
    const passwordMatches = user && await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    return res.json({
      token: createToken(user._id.toString()),
      user: publicUser(user),
    })
  } catch (error) {
    console.error('Login failed:', error)
    return res.status(500).json({ message: 'Login failed' })
  }
}

// Protect a route by checking "Authorization: Bearer <token>".
export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required' })
    }

    const token = header.slice(7)
    const payload = jwt.verify(token, getJwtSecret())
    if (typeof payload === 'string' || !payload.userId) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    const user = await User.findById(payload.userId)

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    req.user = user
    return next()
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    console.error('Authentication failed:', error)
    return res.status(500).json({ message: 'Authentication failed' })
  }
}

export const me = (req, res) => res.json({ user: publicUser(req.user) })
