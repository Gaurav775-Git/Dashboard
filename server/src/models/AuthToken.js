import mongoose from 'mongoose'
const schema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, type: { type: String, enum: ['email_verify', 'password_reset'], required: true }, tokenHash: { type: String, required: true, unique: true }, expiresAt: { type: Date, required: true, expires: 0 }, usedAt: Date }, { timestamps: true })
export default mongoose.model('AuthToken', schema)
