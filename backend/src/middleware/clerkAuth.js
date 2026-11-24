import { createPublicKey, verify as verifySignature } from "node:crypto";

let jwksCache = null;
let jwksFetchedAt = 0;
const JWKS_CACHE_TTL_MS = 10 * 60 * 1000;

function decodeBase64Url(value) {
    return Buffer.from(value, "base64url");
}

export function verifyClerkJwt(token, jwk, expectedIssuer, nowSeconds = Math.floor(Date.now() / 1000)) {
    const parts = String(token || "").split(".");
    if (parts.length !== 3) throw new Error("Malformed JWT");

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const header = JSON.parse(decodeBase64Url(encodedHeader).toString("utf8"));
    const claims = JSON.parse(decodeBase64Url(encodedPayload).toString("utf8"));

    if (header.alg !== "RS256" || header.kid !== jwk.kid || jwk.kty !== "RSA") {
        throw new Error("Unsupported JWT signing key");
    }

    const publicKey = createPublicKey({ key: jwk, format: "jwk" });
    const isValid = verifySignature(
        "RSA-SHA256",
        Buffer.from(`${encodedHeader}.${encodedPayload}`),
        publicKey,
        decodeBase64Url(encodedSignature)
    );
    if (!isValid) throw new Error("Invalid JWT signature");

    if (claims.iss !== expectedIssuer) throw new Error("Invalid JWT issuer");
    if (!Number.isFinite(claims.exp) || claims.exp <= nowSeconds) throw new Error("Expired JWT");
    if (claims.nbf !== undefined && claims.nbf > nowSeconds) throw new Error("JWT not active yet");
    if (typeof claims.sub !== "string" || !claims.sub) throw new Error("Missing subject claim");

    return claims;
}

async function getClerkJwks() {
    const jwksUrl = process.env.CLERK_JWKS_URL;
    if (!jwksUrl) throw new Error("CLERK_JWKS_URL is not configured");

    if (jwksCache && Date.now() - jwksFetchedAt < JWKS_CACHE_TTL_MS) {
        return jwksCache;
    }

    const response = await fetch(jwksUrl, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Unable to load Clerk signing keys");

    const jwks = await response.json();
    if (!Array.isArray(jwks.keys) || jwks.keys.length === 0) {
        throw new Error("Clerk JWKS did not contain signing keys");
    }

    jwksCache = jwks.keys;
    jwksFetchedAt = Date.now();
    return jwksCache;
}

export async function authenticateClerkToken(req, res, next) {
    const authorization = req.get("Authorization");
    if (!authorization) {
        return res.status(401).json({ message: "Authentication required" });
    }

    const [scheme, token, ...extra] = authorization.trim().split(/\s+/);
    if (scheme !== "Bearer" || !token || extra.length > 0) {
        return res.status(401).json({ message: "Invalid Authorization header" });
    }

    try {
        const parts = token.split(".");
        if (parts.length !== 3) throw new Error("Malformed JWT");
        const header = JSON.parse(decodeBase64Url(parts[0]).toString("utf8"));
        const keys = await getClerkJwks();
        const key = keys.find((candidate) => candidate.kid === header.kid);
        if (!key) {
            jwksCache = null;
            throw new Error("Unknown Clerk signing key");
        }

        const issuer = process.env.CLERK_ISSUER;
        if (!issuer) throw new Error("CLERK_ISSUER is not configured");
        const claims = verifyClerkJwt(token, key, issuer);
        req.auth = {
            userId: claims.sub,
            sessionId: claims.sid || null,
        };
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired authentication token" });
    }
}
