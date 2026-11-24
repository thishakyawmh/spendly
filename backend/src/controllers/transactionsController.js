import sql from "../config/db.js";

export async function getTransactions(req, res) {
    try {
        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${req.auth.userId} ORDER BY created_at DESC`;
        return res.status(200).json(transactions);
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        return res.status(500).json({ message: "Failed to fetch transactions" });
    }
}

export async function createTransaction(req, res) {
    try {
        const { title, amount, category } = req.body;

        if (
            typeof title !== "string" ||
            !title.trim() ||
            title.trim().length > 255 ||
            typeof amount !== "number" ||
            !Number.isFinite(amount) ||
            amount === 0 ||
            typeof category !== "string" ||
            !category.trim() ||
            category.trim().length > 100
        ) {
            return res.status(400).json({ message: "A valid title, non-zero amount, and category are required" });
        }

        const [transaction] = await sql`
            INSERT INTO transactions (user_id, title, amount, category)
            VALUES (${req.auth.userId}, ${title.trim()}, ${amount}, ${category.trim()})
            RETURNING *;
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

export async function getSummary(req, res) {
    try {
        const [summary] = await sql`
            SELECT
                COALESCE(SUM(amount), 0) AS balance,
                COALESCE(SUM(amount) FILTER (WHERE amount > 0), 0) AS income,
                COALESCE(SUM(amount) FILTER (WHERE amount < 0), 0) AS expense
            FROM transactions
            WHERE user_id = ${req.auth.userId}
        `;

        return res.status(200).json(summary);
    } catch (error) {
        console.error("Failed to fetch transaction summary:", error);
        return res.status(500).json({ message: "Failed to fetch summary" });
    }
}
