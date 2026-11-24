import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import requireClerkAuth from "../src/middleware/requireClerkAuth.js";

const previousEnv = {
  CLERK_JWKS_URL: process.env.CLERK_JWKS_URL,
  CLERK_ISSUER: process.env.CLERK_ISSUER,
};
const previousFetch = global.fetch;
const issuer = "https://clerk.example.test";
const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const { privateKey: attackerPrivateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: "jwk" }), kid: "test-key", use: "sig", alg: "RS256" };

function makeToken(claimOverrides = {}, signingKey = privateKey) {
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT", kid: "test-key" })).toString("base64url");
  const claims = {
    iss: issuer,
    sub: "user_test_123",
    exp: Math.floor(Date.now() / 1000) + 300,
    ...claimOverrides,
  };
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  const signingInput = `${header}.${payload}`;
  const signature = sign("RSA-SHA256", Buffer.from(signingInput), signingKey).toString("base64url");
  return `${signingInput}.${signature}`;
}

function makeResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

async function authenticate(token) {
  const req = { headers: { authorization: token ? `Bearer ${token}` : "" } };
  const res = makeResponse();
  let nextCalled = false;
  await requireClerkAuth(req, res, () => { nextCalled = true; });
  return { req, res, nextCalled };
}

test.before(() => {
  process.env.CLERK_JWKS_URL = "https://clerk.example.test/.well-known/jwks.json";
  process.env.CLERK_ISSUER = issuer;
  global.fetch = async () => ({ ok: true, json: async () => ({ keys: [jwk] }) });
});

test.after(() => {
  if (previousEnv.CLERK_JWKS_URL === undefined) delete process.env.CLERK_JWKS_URL;
  else process.env.CLERK_JWKS_URL = previousEnv.CLERK_JWKS_URL;
  if (previousEnv.CLERK_ISSUER === undefined) delete process.env.CLERK_ISSUER;
  else process.env.CLERK_ISSUER = previousEnv.CLERK_ISSUER;
  global.fetch = previousFetch;
});

test("accepts a valid Clerk-signed token and attaches the authenticated subject", async () => {
  const result = await authenticate(makeToken());
  assert.equal(result.nextCalled, true);
  assert.equal(result.req.auth.userId, "user_test_123");
});

test("rejects requests without a Bearer token", async () => {
  const result = await authenticate(null);
  assert.equal(result.nextCalled, false);
  assert.equal(result.res.statusCode, 401);
});

test("rejects tokens with an invalid signature", async () => {
  const result = await authenticate(makeToken({}, attackerPrivateKey));
  assert.equal(result.nextCalled, false);
  assert.equal(result.res.statusCode, 401);
});

test("rejects expired tokens", async () => {
  const result = await authenticate(makeToken({ exp: Math.floor(Date.now() / 1000) - 1 }));
  assert.equal(result.nextCalled, false);
  assert.equal(result.res.statusCode, 401);
});

test("rejects tokens issued by another Clerk instance", async () => {
  const result = await authenticate(makeToken({ iss: "https://other-clerk.example.test" }));
  assert.equal(result.nextCalled, false);
  assert.equal(result.res.statusCode, 401);
});
