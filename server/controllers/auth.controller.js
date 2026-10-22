import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// --- MODEL (Kept here to keep files minimal) ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', userSchema)

// --- HELPER: Generate Token ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// --- CONTROLLERS ---

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // 1. Check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' })
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // 3. Create user
    const user = await User.create({ name, email, password: hashedPassword })

    // 4. Return token and user data
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // 3. Return token and user data
    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}