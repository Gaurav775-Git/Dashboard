import User from '../models/User.js'
import { verifyAccessToken } from '../services/token.service.js'
import { ApiError } from '../utils/ApiError.js'

export const authenticate = async (req, _res, next) => {
  try {
    const token = req.cookies.access_token
    if (!token) throw new ApiError(401, 'UNAUTHORIZED', 'Authentication required.')

    let payload
    try {
      payload = verifyAccessToken(token)
    } catch (err) {
      if (err?.name === 'TokenExpiredError') {
        return next(new ApiError(401, 'TOKEN_EXPIRED', 'Access token expired.'))
      }
      return next(new ApiError(401, 'TOKEN_INVALID', 'Invalid access token.'))
    }

    const user = await User.findById(payload.sub)
    if (!user || user.status !== 'active') {
      throw new ApiError(401, 'UNAUTHORIZED', 'Authentication required.')
    }
    if (user.passwordChangedAt && payload.iat * 1000 < user.passwordChangedAt.getTime()) {
      throw new ApiError(401, 'TOKEN_REVOKED', 'Session revoked.')
    }

    req.user = user
    next()
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, 'UNAUTHORIZED', 'Authentication required.'))
  }
}