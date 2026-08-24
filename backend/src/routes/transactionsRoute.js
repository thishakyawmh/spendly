import express from "express";
import sql from "../config/db.js";
import { getTransactionsByUserId, createTransaction, deleteTransaction, getSummaryByUserId } from "../controllers/transactionsController.js";

const router = express.Router();


router.get("/:userId", getTransactionsByUserId)

router.post("/", createTransaction)

router.delete("/:id", deleteTransaction)

router.get("/summary/:userId", getSummaryByUserId)

export default router
