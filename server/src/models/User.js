import mongoose from 'mongoose'

// This is the only data we need for a basic user account.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  // Passwords are never stored as plain text. The controller stores a bcrypt hash.
  password: {
    type: String,
    required: true,
    select: false,
  },
})

export default mongoose.model('User', userSchema)
