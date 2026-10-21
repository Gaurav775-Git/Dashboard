import User from '../models/User.js'
import { verifyAccessToken } from '../services/token.service.js'
import { ApiError } from '../utils/ApiError.js'
export const authenticate = async (req, _res, next) => { try { const token = req.cookies.access_token; if (!token) throw new ApiError(401, 'UNAUTHORIZED', 'Authentication required.'); const payload = verifyAccessToken(token); const user = await User.findById(payload.sub); if (!user || user.status !== 'active' || (user.passwordChangedAt && payload.iat * 1000 < user.passwordChangedAt.getTime())) throw new ApiError(401, 'UNAUTHORIZED', 'Authentication required.'); req.user = user; next() } catch (error) { next(error.statusCode ? error : new ApiError(401, 'UNAUTHORIZED', 'Authentication required.')) } }
