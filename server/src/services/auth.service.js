import User from '../models/User.js'
import Session from '../models/Session.js'
import AuthToken from '../models/AuthToken.js'
import { env } from '../config/env.js'
import { hashPassword, verifyPassword, validatePasswordPolicy, dummyHash } from './password.service.js'
import { createSession, signAccessToken } from './token.service.js'
import { hashToken, randomToken } from '../utils/crypto.js'
import { ApiError } from '../utils/ApiError.js'
import { sendAuthEmail } from './email.service.js'

const publicUser = (user) => user.toJSON()

const issueLogin = async (user, meta) => {
  const access = signAccessToken(user)
  const refresh = await createSession(user, meta)
  return { user: publicUser(user), accessToken: access, refreshToken: refresh.raw }
}

const createAuthToken = async (user, type, ttl) => {
  const raw = randomToken()
  await AuthToken.create({
    user: user._id,
    type,
    tokenHash: hashToken(raw),
    expiresAt: new Date(Date.now() + ttl),
  })
  return raw
}

export const register = async (input, meta) => {
  validatePasswordPolicy(input.password, input.email, input.name)

  if (await User.exists({ email: input.email })) {
    throw new ApiError(409, 'DUPLICATE_EMAIL', 'An account with this email already exists.')
  }

  const user = await User.create({
    name: input.name,
    email: input.email,
    company: input.company,
    passwordHash: await hashPassword(input.password),
    emailVerified: true, // ✅ Auto-verify for now
  })

  // ✅ Instantly log the user in upon registration
  return issueLogin(user, meta)
}

export const login = async (input, meta) => {
  const user = await User.findOne({ email: input.email }).select('+passwordHash')

  if (user?.lockUntil && user.lockUntil > new Date()) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.')
  }

  const valid = await verifyPassword(user?.passwordHash || dummyHash, input.password).catch(() => false)

  if (!user || !valid || user.status !== 'active') {
    if (user) {
      const attempts = user.failedLoginAttempts + 1
      await User.updateOne(
        { _id: user._id },
        {
          failedLoginAttempts: attempts,
          ...(attempts >= 5 ? { lockUntil: new Date(Date.now() + 900000) } : {}),
        }
      )
    }
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.')
  }

  user.failedLoginAttempts = 0
  user.lockUntil = undefined
  user.lastLoginAt = new Date()
  await user.save()

  // ✅ Email verification check completely removed here!

  return issueLogin(user, meta)
}

export const refresh = async (raw, meta) => {
  if (!raw) throw new ApiError(401, 'TOKEN_INVALID', 'Refresh token is invalid.')

  const session = await Session.findOne({ tokenHash: hashToken(raw) })
  if (!session) throw new ApiError(401, 'TOKEN_INVALID', 'Refresh token is invalid.')

  if (session.revokedAt) {
    await Session.updateMany({ family: session.family }, { revokedAt: new Date() })
    throw new ApiError(401, 'TOKEN_REUSE', 'Refresh token reuse detected.')
  }

  const user = await User.findById(session.user)
  if (!user || user.status !== 'active' || session.expiresAt < new Date()) {
    throw new ApiError(401, 'TOKEN_INVALID', 'Refresh token is invalid.')
  }

  const next = await createSession(user, meta, session.family)
  session.revokedAt = new Date()
  session.replacedBy = next.session._id.toString()
  await session.save()

  return { user: publicUser(user), accessToken: signAccessToken(user), refreshToken: next.raw }
}

export const verifyEmail = async (raw) => {
  const token = await AuthToken.findOne({
    tokenHash: hashToken(raw),
    type: 'email_verify',
    usedAt: null,
  }).populate('user')
  if (!token || token.expiresAt < new Date()) {
    throw new ApiError(400, 'TOKEN_INVALID', 'Verification token is invalid or expired.')
  }
  token.usedAt = new Date()
  await token.save()
  token.user.emailVerified = true
  await token.user.save()
}

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email })
  if (user) {
    const token = await createAuthToken(user, 'password_reset', 1800000)
    await sendAuthEmail({
      to: user.email,
      subject: 'Reset your Rankfasta password',
      text: `${env.CLIENT_URL}/reset-password?token=${token}`,
    })
  }
}

export const resetPassword = async (raw, password) => {
  const token = await AuthToken.findOne({
    tokenHash: hashToken(raw),
    type: 'password_reset',
    usedAt: null,
  }).populate('user')
  if (!token || token.expiresAt < new Date()) {
    throw new ApiError(400, 'TOKEN_INVALID', 'Reset token is invalid or expired.')
  }
  validatePasswordPolicy(password, token.user.email, token.user.name)
  token.user.passwordHash = await hashPassword(password)
  token.user.passwordChangedAt = new Date()
  await token.user.save()
  token.usedAt = new Date()
  await token.save()
  await Session.updateMany({ user: token.user._id, revokedAt: null }, { revokedAt: new Date() })
}

export const changePassword = async (user, current, next) => {
  const full = await User.findById(user._id).select('+passwordHash')
  if (!(await verifyPassword(full.passwordHash, current))) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Current password is incorrect.')
  }
  validatePasswordPolicy(next, full.email, full.name)
  full.passwordHash = await hashPassword(next)
  full.passwordChangedAt = new Date()
  await full.save()
  await Session.updateMany({ user: full._id, revokedAt: null }, { revokedAt: new Date() })
}