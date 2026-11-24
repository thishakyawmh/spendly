import express from "express";
import {
    getTransactions,
    createTransaction,
    deleteTransaction,
    getSummary,
} from "../controllers/transactionsController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getTransactions);
router.get("/summary", getSummary);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;
