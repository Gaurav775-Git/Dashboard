import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { hashToken, randomToken } from '../utils/crypto.js'
import Session from '../models/Session.js'
export const signAccessToken = (user) => jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL, algorithm: 'HS256' })
export const verifyAccessToken = (token) => jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms: ['HS256'] })
export const createSession = async (user, meta, family = randomToken(16)) => { const raw = randomToken(48); const session = await Session.create({ user: user._id, family, tokenHash: hashToken(raw), userAgent: meta.userAgent, ip: meta.ip, expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 86400000) }); return { raw, session } }
