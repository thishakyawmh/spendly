import sql from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;
    if (userId !== req.auth.userId) {
      return res.status(403).json({ message: "You cannot access another user's transactions" });
    }

    const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${req.auth.userId} ORDER BY created_at DESC, id DESC`;
    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return res.status(500).json({ message: "Failed to fetch transactions" });
  }
}

export async function createTransaction(req, res) {
  try {
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    const category = typeof req.body.category === "string" ? req.body.category.trim() : "";
    const amount = Number(req.body.amount);

    if (
      !title ||
      title.length > 255 ||
      !category ||
      category.length > 255 ||
      req.body.amount === "" ||
      !Number.isFinite(amount) ||
      amount === 0 ||
      Math.abs(amount) >= 100000000
    ) {
      return res.status(400).json({ message: "Provide a valid title, non-zero amount, and category" });
    }

    const [transaction] = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${req.auth.userId}, ${title}, ${amount.toFixed(2)}, ${category})
      RETURNING *
    `;

    return res.status(201).json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return res.status(500).json({ message: "Failed to create transaction" });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const result = await sql`
      DELETE FROM transactions
      WHERE id = ${id} AND user_id = ${req.auth.userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    return res.status(500).json({ message: "Failed to delete transaction" });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;
    if (userId !== req.auth.userId) {
      return res.status(403).json({ message: "You cannot access another user's summary" });
    }

    const [summary] = await sql`
      SELECT
        COALESCE(SUM(amount), 0) AS balance,
        COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END), 0) AS expense,
        COUNT(*)::int AS total_transactions
      FROM transactions
      WHERE user_id = ${req.auth.userId}
    `;

    const categories = await sql`
      SELECT category, SUM(amount) AS total_amount
      FROM transactions
      WHERE user_id = ${req.auth.userId}
      GROUP BY category
      ORDER BY total_amount DESC
    `;

    return res.status(200).json({ ...summary, categories });
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    return res.status(500).json({ message: "Failed to fetch summary" });
  }
}
