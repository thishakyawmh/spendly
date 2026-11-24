import { useState, useCallback } from "react";
import { API_URL } from "../../constants/api";

export const useTransactions = (userId, getToken) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expense: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const getAuthHeaders = useCallback(async () => {
    const token = await getToken();
    if (!token) throw new Error("Your session has expired. Please sign in again.");
    return { Authorization: `Bearer ${token}` };
  }, [getToken]);

  const loadData = useCallback(async () => {
    if (!userId) {
      setTransactions([]);
      setSummary({ balance: 0, income: 0, expense: 0 });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const headers = await getAuthHeaders();
      const [transRes, summaryRes] = await Promise.all([
        fetch(`${API_URL}/transactions`, { headers }),
        fetch(`${API_URL}/transactions/summary`, { headers }),
      ]);

      if (!transRes.ok || !summaryRes.ok) {
        throw new Error("Unable to load your transactions. Please try again.");
      }

      const [transData, summaryData] = await Promise.all([
        transRes.json(),
        summaryRes.json(),
      ]);

      setTransactions(transData);
      setSummary(summaryData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, getAuthHeaders]);

  const deleteTransaction = async (id) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) throw new Error("Failed to delete transaction");
      await loadData();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
