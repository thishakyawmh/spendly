import { useState, useCallback } from "react";
import { API_URL } from "../../constants/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expense: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [transRes, summaryRes] = await Promise.all([
        fetch(`${API_URL}/transactions/${userId}`),
        fetch(`${API_URL}/transactions/summary/${userId}`),
      ]);

      const transData = await transRes.json();
      const summaryData = await summaryRes.json();

      setTransactions(transData);
      setSummary(summaryData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      // Reload data after delete
      await loadData();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
