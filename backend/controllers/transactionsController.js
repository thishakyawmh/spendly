import sql from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
    try {
        const { userId } = req.params;
        console.log(userId);
        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
}

export async function createTransaction(req, res) {
    try {
        const { user_id, title, amount, category } = req.body;
        if (!user_id || !title || !amount || !category || amount == undefined || isNaN(amount)) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const [transaction] = await sql`
            INSERT INTO transactions (user_id, title, amount, category) 
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *;
        `;
        res.status(201).json({ message: "Transaction created successfully", transaction });
    } catch (error) {
        res.status(500).json({ message: "Failed to create transaction" });
    }
}


export async function deleteTransaction(req, res) {
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid Transaction ID" });
        }
        const result = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;

        if (result.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete transaction" });
    }
}


export async function getSummaryByUserId(req, res) {
    try {
        const { userId } = req.params;
        const balanceResult = await sql`SELECT COALESCE(SUM(amount), 0) AS balance, COUNT(*) AS total_transactions FROM transactions WHERE user_id = ${userId}`;
        const incomeResult = await sql`SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0`;
        const expenseResult = await sql`SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${userId} AND amount < 0`;
        const categoriesResult = await sql`SELECT category, SUM(amount) AS total_amount FROM transactions WHERE user_id = ${userId} GROUP BY category ORDER BY total_amount DESC`;
        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense,
            // total_transactions: balanceResult[0].total_transactions,
            // categories: categoriesResult
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch summary" });
    }
}
