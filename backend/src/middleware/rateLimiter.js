import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        const { success } = await ratelimit.limit(req.ip)
        if (!success) {
            return res.status(429).json({ message: "Too many requests, Please try again later" });
        }
        next();
    } catch (error) {
        console.error("Error in rate limiting:", error);
        next();
    }
}

export default rateLimiter;