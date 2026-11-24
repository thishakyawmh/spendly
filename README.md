# Spendly

Spendly is a personal expense-tracking application with an Expo/React Native mobile client and an Express API backed by Neon PostgreSQL and Upstash Redis.

## Architecture

- **Mobile:** Expo, React Native, Clerk authentication
- **API:** Node.js, Express
- **Authentication:** Clerk session JWTs verified against the Clerk instance's JWKS
- **Database:** Neon PostgreSQL
- **Rate limiting:** Upstash Redis

## Local development

### Backend

1. Copy `backend/.env.example` to `backend/.env`.
2. Configure the Neon database, Clerk issuer/JWKS URL, and Upstash credentials.
3. Install and start:

   ```bash
   cd backend
   npm ci
   npm run dev
   ```

The API refuses to start if the Clerk issuer, JWKS URL, or database URL is missing.

### Mobile

1. Copy `mobile/.env.example` to `mobile/.env`.
2. Set `EXPO_PUBLIC_API_URL` to an API URL reachable from the device or simulator.
3. Install and start:

   ```bash
   cd mobile
   npm ci
   npx expo start
   ```

For the Android emulator, `http://10.0.2.2:5001/api` maps to the host machine. For a physical device, use the host computer's LAN address or a deployed HTTPS endpoint.

## Data ownership and security

Every transaction route requires a Clerk Bearer token. The API verifies its RS256 signature using the configured Clerk JWKS, checks issuer and expiry, and derives the owner from the verified `sub` claim. It ignores client-supplied `user_id` values and scopes reads/deletes to the authenticated account.

Never commit `.env` files or production secrets. Set `CORS_ORIGINS` to the exact browser origins that should call the API. Native mobile requests without an Origin header are allowed.

## Tests

Run backend authentication tests:

```bash
cd backend
npm test
```

GitHub Actions runs the authentication tests and JavaScript syntax checks for backend changes.
