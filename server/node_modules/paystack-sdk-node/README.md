# paystack-sdk-node

Type-safe, modern TypeScript SDK for the [Paystack](https://paystack.com) API.

This package helps you talk to Paystack from Node.js, with:

- A `PaystackClient` that wraps the core REST API
- First-class resource classes (customers, transactions, transfers, DVAs, etc.)
- Webhook signature verification utilities
- Framework helpers for Express, NestJS, and Next.js

> This SDK is not an official Paystack product.

---

## Installation

```bash
# with bun
bun add paystack-sdk-node

# or with npm
npm install paystack-sdk-node

# or with pnpm
pnpm add paystack-sdk-node
```

This library targets modern runtimes:

- Node.js 18+ or Bun
- TypeScript 5+ (types included)

---

## Quick start

### Create a client

```ts
import { PaystackClient } from 'paystack-sdk'

const client = new PaystackClient({
  apiKey: process.env.PAYSTACK_SECRET_KEY!,
})
```

You can optionally override:

- `baseUrl` (defaults to `https://api.paystack.co`)
- `maxRetries` (defaults to `3`)
- `fetchImpl` (custom fetch for environments without global `fetch`)

You can also create a client from environment variables using `createPaystackClient`, which reads standard config keys from your environment:

```ts
import { createPaystackClient } from '@samaasi/paystack-sdk'

const client = await createPaystackClient()
```

---

## Core resources

The client exposes strongly-typed resource helpers under `client.*`.

### Customers

```ts
// Create customer
const created = await client.customers.create({
  email: 'customer@example.com',
  first_name: 'Ada',
  last_name: 'Lovelace',
})

// List customers
const list = await client.customers.list({ perPage: 20, page: 1 })

// Update customer
await client.customers.update(created.data.customer_code, {
  phone: '+2348000000000',
})
```

### Transactions

```ts
// Initialize a transaction
const tx = await client.transactions.initialize({
  email: 'customer@example.com',
  amount: 20000, // amount in kobo
})

// Verify a transaction
const verified = await client.transactions.verify(tx.data.reference)
```

### Apple Pay

Manage Apple Pay domains for your integration.

```ts
// Register a domain
await client.applePay.registerDomain({
  domainName: 'example.com',
})

// List registered domains
const domains = await client.applePay.listDomains()

// Unregister a domain
await client.applePay.unregisterDomain({
  domainName: 'example.com',
})
```

### Webhooks

The SDK provides helper functions and an event enum to make handling webhooks type-safe and secure.

```ts
import { PaystackEvent } from 'paystack-sdk/enums'

// Check if an event string matches a known Paystack event
if (event === PaystackEvent.ChargeSuccess) {
  // Handle successful charge
}
```

#### Framework Integrations

**Express**

```ts
import { createPaystackExpressMiddleware } from 'paystack-sdk/express'

app.post(
  '/webhook',
  createPaystackExpressMiddleware({
    secretKey: process.env.PAYSTACK_SECRET_KEY!,
  }),
  (req, res) => {
    const event = req.paystackEvent
    // Handle event...
    res.sendStatus(200)
  },
)
```

**Next.js (App Router)**

```ts
import { verifyPaystackNextjsRequest } from 'paystack-sdk/nextjs'

export async function POST(req: Request) {
  const { valid, event } = await verifyPaystackNextjsRequest(req, {
    secretKey: process.env.PAYSTACK_SECRET_KEY!,
  })

  if (!valid) return new Response('Invalid signature', { status: 401 })

  // Handle event...
  return new Response('OK', { status: 200 })
}
```

**Fastify**

```ts
import { createPaystackFastifyHook } from 'paystack-sdk/fastify'

fastify.post(
  '/webhook',
  {
    preValidation: createPaystackFastifyHook({
      secretKey: process.env.PAYSTACK_SECRET_KEY!,
    }),
  },
  async (req, reply) => {
    const event = req.paystackEvent
    // Handle event...
    return { status: 'success' }
  },
)
```

### Transfers and recipients

```ts
// Create a transfer recipient
const recipient = await client.transferRecipients.create({
  type: 'nuban',
  name: 'Jane Doe',
  account_number: '0123456789',
  bank_code: '058',
  currency: 'NGN',
})

// Initiate a transfer
const transfer = await client.transfers.initiate(
  {
    source: 'balance',
    amount: 100000, // 1000 NGN in kobo
    recipient: recipient.data.recipient_code,
    reference: 'salary-2025-01-01',
  },
  { idempotencyKey: 'salary-2025-01-01' },
)
```

### Verification (bank + BVN)

```ts
// Resolve bank account name
const resolved = await client.verification.resolveAccount({
  account_number: '0123456789',
  bank_code: '058',
})

// Match BVN to bank account
const match = await client.verification.matchBvn({
  account_number: '0123456789',
  bank_code: '058',
  bvn: '12345678901',
})
```

### Subaccounts and subscriptions

```ts
// Create a subaccount
const sub = await client.subaccounts.create({
  business_name: 'Acme Partners',
  settlement_bank: '058',
  account_number: '0123456789',
  percentage_charge: 20,
})

// Create a subscription
const subscription = await client.subscriptions.create({
  customer: 'CUS_xxxxxxxx',
  plan: 'PLN_xxxxxxxx',
})
```

### Dedicated Virtual Accounts (DVAs)

```ts
const dva = await client.virtualAccounts.create({
  customer: 'CUS_xxxxxxxx',
  preferred_bank: 'titan-paystack',
})
```

---

## Webhooks

The SDK provides low-level signature helpers and some framework-specific utilities.

### Signature verification

Subpath: `paystack-sdk/webhooks`

```ts
import { verifyPaystackSignature } from 'paystack-sdk/webhooks'

const valid = await verifyPaystackSignature({
  payload: rawBody, // string or Uint8Array
  signature: req.headers['x-paystack-signature'] as string | undefined,
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
})
```

### Type-safe events

Subpath: root resources

```ts
import { isWebhookEvent, type WebhookEvent } from 'paystack-sdk'

if (isWebhookEvent(body)) {
  const event: WebhookEvent = body

  if (event.event === 'charge.success') {
    // handle successful charge
  }
}
```

---

## Framework integrations

### Express

Subpath: `paystack-sdk/express`

```ts
import express from 'express'
import { createPaystackExpressMiddleware } from 'paystack-sdk/express'

const app = express()

app.post(
  '/webhooks/paystack',
  createPaystackExpressMiddleware({
    secretKey: process.env.PAYSTACK_SECRET_KEY!,
  }),
  (req, res) => {
    const event = (req as any).paystackEvent
    // handle event
    res.sendStatus(200)
  },
)
```

Ensure your Express setup preserves the raw request body (for example by using a body parser that keeps `req.rawBody`, or by wiring a raw-body middleware).

### NestJS

Subpath: `paystack-sdk/nestjs`

```ts
import { Controller, Post, Req, UseGuards } from '@nestjs/common'
import { PaystackWebhookGuard } from 'paystack-sdk/nestjs'

@Controller('webhooks/paystack')
@UseGuards(
  new PaystackWebhookGuard({
    secretKey: process.env.PAYSTACK_SECRET_KEY!,
  }),
)
export class PaystackWebhookController {
  @Post()
  handle(@Req() req: any) {
    const event = req.body
    // handle event
    return 'ok'
  }
}
```

### Next.js (App Router)

Subpath: `paystack-sdk/nextjs`

```ts
// app/api/webhooks/paystack/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyPaystackNextjsRequest } from 'paystack-sdk/nextjs'

export async function POST(req: NextRequest) {
  const { valid, event } = await verifyPaystackNextjsRequest(req, {
    secretKey: process.env.PAYSTACK_SECRET_KEY!,
  })

  if (!valid) {
    return new NextResponse('Invalid signature', { status: 401 })
  }

  // handle event
  return new NextResponse('ok')
}
```

---

## Idempotency

The SDK includes helpers for idempotent requests via the `x-idempotency-key` header.

```ts
import { generateIdempotencyKey, withIdempotencyKey } from 'paystack-sdk'

const key = generateIdempotencyKey()

const init = withIdempotencyKey(
  {
    method: 'POST',
    body: JSON.stringify({}),
  },
  key,
)
```

Core resources that support idempotency (for example transfers) accept an `idempotencyKey` option and apply it internally.

---

## Development

Install dependencies:

```bash
bun install
```

Build the library:

```bash
bun run build
```

Run tests (if present):

```bash
bun test
```

Formatting:

- Use `bun format` locally for fast formatting during development.
- Run ESLint in CI (GitHub Actions) before releases to enforce consistency.

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
