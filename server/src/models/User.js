import mongoose from 'mongoose'
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  company: { type: String, trim: true, maxlength: 120 }, role: { type: String, enum: ['client', 'specialist', 'admin'], default: 'client' },
  emailVerified: { type: Boolean, default: false }, status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  failedLoginAttempts: { type: Number, default: 0 }, lockUntil: Date, lastLoginAt: Date, passwordChangedAt: Date,
}, { timestamps: true, toJSON: { transform: (_doc, ret) => { delete ret.passwordHash; delete ret.__v; delete ret.failedLoginAttempts; delete ret.lockUntil; return ret } } })
export default mongoose.model('User', schema)
