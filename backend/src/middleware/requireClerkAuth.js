import { createPublicKey, verify as verifySignature } from "node:crypto";

let cachedKeys = new Map();
let cacheExpiresAt = 0;

async function getSigningKey(kid) {
  const jwksUrl = process.env.CLERK_JWKS_URL;
  if (!jwksUrl) {
    throw new Error("CLERK_JWKS_URL is not configured");
  }

  if (Date.now() >= cacheExpiresAt || !cachedKeys.has(kid)) {
    const response = await fetch(jwksUrl, { headers: { accept: "application/json" } });
    if (!response.ok) {
      throw new Error("Unable to retrieve Clerk signing keys");
    }

    const jwks = await response.json();
    if (!Array.isArray(jwks.keys)) {
      throw new Error("Invalid Clerk JWKS response");
    }

    cachedKeys = new Map(jwks.keys
      .filter((key) => key.kid && key.kty === "RSA" && (!key.use || key.use === "sig") && (!key.alg || key.alg === "RS256"))
      .map((key) => [key.kid, key]));
    cacheExpiresAt = Date.now() + 10 * 60 * 1000;
  }

  const jwk = cachedKeys.get(kid);
  if (!jwk) {
    throw new Error("Unknown JWT signing key");
  }

  return createPublicKey({ key: jwk, format: "jwk" });
}

export default async function requireClerkAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const [scheme, token, ...extra] = authorization.trim().split(/\s+/);

    if (scheme !== "Bearer" || !token || extra.length > 0) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    const header = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));

    if (header.alg !== "RS256" || !header.kid) {
      return res.status(401).json({ message: "Unsupported authentication token" });
    }

    const publicKey = await getSigningKey(header.kid);
    const validSignature = verifySignature(
      "RSA-SHA256",
      Buffer.from(`${parts[0]}.${parts[1]}`),
      publicKey,
      Buffer.from(parts[2], "base64url")
    );

    const issuer = process.env.CLERK_ISSUER;
    const now = Math.floor(Date.now() / 1000);
    if (
      !validSignature ||
      !issuer ||
      claims.iss !== issuer ||
      typeof claims.sub !== "string" ||
      !claims.sub ||
      typeof claims.exp !== "number" ||
      claims.exp <= now ||
      (claims.nbf !== undefined && (typeof claims.nbf !== "number" || claims.nbf > now))
    ) {
      return res.status(401).json({ message: "Invalid or expired authentication token" });
    }

    req.auth = { userId: claims.sub };
    return next();
  } catch (error) {
    console.error("Authentication verification failed:", error.message);
    return res.status(401).json({ message: "Unable to authenticate request" });
  }
}
