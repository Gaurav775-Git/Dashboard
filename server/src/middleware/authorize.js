import { ApiError } from '../utils/ApiError.js'
export const authorize = (...roles) => (req, _res, next) => roles.includes(req.user?.role) ? next() : next(new ApiError(403, 'FORBIDDEN', 'You do not have permission to access this resource.'))
