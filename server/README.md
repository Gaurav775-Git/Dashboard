# Rankfasta authentication API

## Setup

```bash
npm install
cp .env.example .env
# Set MONGODB_URI and a JWT_ACCESS_SECRET with at least 32 characters.
npm run dev
```

The API listens on `PORT` (default `5000`). In development, email links are logged to the server console unless SMTP is configured.

### Deployed frontend

For the Render service used by the Vercel frontend, configure these environment variables:

```env
NODE_ENV=production
CLIENT_URL=https://rankfasta-dashboard.vercel.app
COOKIE_SECURE=true
COOKIE_SAME_SITE=none
TRUST_PROXY=true
```

Configure the Vercel project with:

```env
VITE_API_URL=https://dashboard-sj7c.onrender.com/api
VITE_USE_MOCK=true
```

`COOKIE_SAME_SITE=none` is required because the Vercel and Render deployments are on different sites. Leave `COOKIE_DOMAIN` empty unless both services are moved under the same custom parent domain.

## Endpoints

All mutation requests require `X-Requested-With: XMLHttpRequest` and an `Origin` matching `CLIENT_URL`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health and uptime |
| POST | `/api/auth/register` | Create a client account |
| POST | `/api/auth/login` | Log in and issue HttpOnly cookies |
| POST | `/api/auth/logout` | Revoke the current session |
| POST | `/api/auth/logout-all` | Revoke every session |
| POST | `/api/auth/refresh` | Rotate a refresh token |
| GET | `/api/auth/me` | Get the authenticated user |
| POST | `/api/auth/verify-email` | Consume an email verification token |
| POST | `/api/auth/resend-verification` | Request verification email |
| POST | `/api/auth/forgot-password` | Request a password reset |
| POST | `/api/auth/reset-password` | Consume a password reset token |
| POST | `/api/auth/change-password` | Change the authenticated user's password |

Example:

```bash
curl -i -X POST http://localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'Origin: http://localhost:5173' \
  -d '{"name":"Alex Carter","email":"alex@example.com","password":"A-secure-pass1"}'
```

## Admin bootstrap

```bash
node scripts/create-admin.js "Admin User" admin@example.com "A-secure-admin1"
```

## Security notes

Passwords use Argon2id. Access tokens are short-lived JWTs in HttpOnly cookies; refresh tokens are opaque, hashed in MongoDB, rotated, and protected against family reuse. Login lockout, rate limits, strict Zod validation, Helmet, CORS, CSRF headers, HPP, Mongo sanitization, redacted request logging, suspended-user checks, and password-change invalidation are enabled.

Intentionally deferred: a shared Redis rate-limit store for multi-instance deployments, 2FA, OAuth login, and device management.
