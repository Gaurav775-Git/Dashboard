import crypto from 'node:crypto'
export const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString('base64url')
export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex')
