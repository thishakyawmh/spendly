import express from "express";
import requireClerkAuth from "../middleware/requireClerkAuth.js";
import {
  getTransactionsByUserId,
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.use(requireClerkAuth);

router.get("/summary/:userId", getSummaryByUserId);
router.get("/:userId", getTransactionsByUserId);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;
