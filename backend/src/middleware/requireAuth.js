import { verifyToken } from "@clerk/backend";

export default async function requireAuth(req, res, next) {
    const authorization = req.headers.authorization || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        const claims = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        if (!claims.sub) {
            return res.status(401).json({ message: "Invalid authentication token" });
        }

        req.auth = { userId: claims.sub };
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired authentication token" });
    }
}
