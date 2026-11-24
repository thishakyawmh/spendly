import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./src/config/db.js";
import rateLimiter from "./src/middleware/rateLimiter.js";
import transactionsRoute from "./src/routes/transactionsRoute.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5001;

if (!process.env.CLERK_JWKS_URL || !process.env.CLERK_ISSUER) {
    throw new Error("CLERK_JWKS_URL and CLERK_ISSUER must be configured before starting the API");
}
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be configured before starting the API");
}

const allowedOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true
}));

app.use(express.json({ limit: "64kb" }));
app.set("trust proxy", process.env.TRUST_PROXY === "true" ? 1 : false);
app.use(rateLimiter);

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/transactions", transactionsRoute);

initDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Spendly API listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to initialize Spendly API:", error.message);
        process.exit(1);
    });
