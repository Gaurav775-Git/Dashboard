import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

let app

beforeAll(async () => {
  process.env.NODE_ENV = 'test'
  process.env.CLIENT_URL = 'https://rankfasta-dashboard.vercel.app/'
  process.env.CLIENT_URLS = ''
  process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/rankfasta'
  process.env.JWT_ACCESS_SECRET ||= 'test-secret-that-is-at-least-32-characters-long'
  const imported = await import('../src/app.js')
  app = imported.default
}, 30000)

describe('CORS', () => {
  it('normalizes a trailing slash in CLIENT_URL for preflight responses', async () => {
    const response = await request(app)
      .options('/api/auth/me')
      .set('Origin', 'https://rankfasta-dashboard.vercel.app')
      .set('Access-Control-Request-Method', 'GET')

    expect(response.status).toBe(204)
    expect(response.headers['access-control-allow-origin']).toBe('https://rankfasta-dashboard.vercel.app')
    expect(response.headers['access-control-allow-credentials']).toBe('true')
  })
})
