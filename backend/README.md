# Spendly API

Express API for Spendly's mobile application. Transaction data is stored in Neon PostgreSQL and rate-limited with Upstash Redis.

## Requirements

- Node.js 20 or later
- Neon PostgreSQL database
- Upstash Redis database
- Clerk application configured for the same instance used by the mobile app

## Local setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Copy `.env.example` to `.env` and fill in the real credentials.

3. In Clerk Dashboard, open the JWT keys for the same Clerk instance used by the mobile app. Set:
   - `CLERK_ISSUER`: the exact issuer URL shown for that instance
   - `CLERK_JWKS_URL`: that instance's JWKS endpoint, normally `<issuer>/.well-known/jwks.json`

   The issuer and JWKS URL must belong to the same Clerk instance. Do not commit real secrets.

4. Start the API:

   ```bash
   npm run dev
   ```

The API will refuse to start if the Clerk issuer or JWKS URL is missing.

## Authentication and data ownership

All transaction endpoints require a Clerk session JWT in the `Authorization: Bearer <token>` header. The API verifies the token signature using the configured Clerk JWKS, checks its issuer and expiry, and derives the transaction owner from the verified `sub` claim. The API does not trust a client-supplied `user_id`.

Users can only read their own transactions and summary, and delete operations include the authenticated user ID in the database condition.

## Endpoints

- `GET /api/transactions/:userId`
- `GET /api/transactions/summary/:userId`
- `POST /api/transactions`
- `DELETE /api/transactions/:id`

All endpoints above require authentication. The `:userId` in read endpoints must match the authenticated Clerk user ID.

## Tests

Run the backend tests with:

```bash
npm test
```
