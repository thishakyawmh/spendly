import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync, sign, createPublicKey } from "node:crypto";
import requireClerkAuth from "../src/middleware/requireClerkAuth.js";

const issuer = "https://example.clerk.accounts.dev";
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});
const jwk = createJwk(publicKey);
const originalFetch = globalThis.fetch;

function createJwk(pem) {
  const key = createPublicKey(pem).export({ format: "jwk" });
  return { ...key, kid: "test-key", alg: "RS256", use: "sig" };
}

function createToken(claimOverrides = {}, signingKey = privateKey) {
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT", kid: "test-key" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss: issuer,
    sub: "user_test_123",
    exp: Math.floor(Date.now() / 1000) + 300,
    ...claimOverrides,
  })).toString("base64url");
  const signingInput = `${header}.${payload}`;
  const signature = sign("RSA-SHA256", Buffer.from(signingInput), signingKey).toString("base64url");
  return `${signingInput}.${signature}`;
}

function responseRecorder() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test.before(() => {
  process.env.CLERK_ISSUER = issuer;
  process.env.CLERK_JWKS_URL = "https://example.test/.well-known/jwks.json";
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ keys: [jwk] }),
  });
});

test.after(() => {
  globalThis.fetch = originalFetch;
  delete process.env.CLERK_ISSUER;
  delete process.env.CLERK_JWKS_URL;
});

test("accepts a valid Clerk session token and attaches its user ID", async () => {
  const req = { headers: { authorization: `Bearer ${createToken()}` } };
  const res = responseRecorder();
  let nextCalled = false;

  await requireClerkAuth(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, true);
  assert.deepEqual(req.auth, { userId: "user_test_123" });
});

test("rejects requests without a bearer token", async () => {
  const req = { headers: {} };
  const res = responseRecorder();

  await requireClerkAuth(req, res, () => assert.fail("next must not be called"));

  assert.equal(res.statusCode, 401);
});

test("rejects expired tokens", async () => {
  const req = { headers: { authorization: `Bearer ${createToken({ exp: Math.floor(Date.now() / 1000) - 10 })}` } };
  const res = responseRecorder();

  await requireClerkAuth(req, res, () => assert.fail("next must not be called"));

  assert.equal(res.statusCode, 401);
});

test("rejects tokens issued by a different Clerk instance", async () => {
  const req = { headers: { authorization: `Bearer ${createToken({ iss: "https://attacker.example" })}` } };
  const res = responseRecorder();

  await requireClerkAuth(req, res, () => assert.fail("next must not be called"));

  assert.equal(res.statusCode, 401);
});
