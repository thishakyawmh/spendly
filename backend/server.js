import express from "express";
import dotenv from "dotenv";
import { initDB } from "./src/config/db.js";
import rateLimiter from "./src/middleware/rateLimiter.js";
import transactionsRoute from "./src/routes/transactionsRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

if (!process.env.CLERK_JWKS_URL || !process.env.CLERK_ISSUER) {
    throw new Error("CLERK_JWKS_URL and CLERK_ISSUER must be configured before starting the API");
}

app.use(express.json());

app.set("trust proxy", 1);
app.use(rateLimiter);

app.use("/api/transactions", transactionsRoute)

initDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((error) => {
    console.error("Failed to start server:", error)
    process.exit(1)
})

