import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/config";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

interface Category {
  name: string;
  icon: string;
  color: string;
  limit: number;
  spent: number;
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
  category: string;
}

export const useBudget = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentMonth = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
  };

  const loadBudget = async () => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const currentMonth = getCurrentMonth();
      const budgetRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "budgets",
        currentMonth
      );
      const budgetDoc = await getDoc(budgetRef);

      if (budgetDoc.exists()) {
        const data = budgetDoc.data();
        setCategories(data.categories || []);
        setTotalBudget(data.totalBudget || 0);
        setTotalSpent(data.totalSpent || 0);

        // Sort transactions by date (most recent first)
        const sortedTransactions = (data.transactions || []).sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTransactions(sortedTransactions);
      } else {
        // Initialise new budget if none exists
        const newBudget = {
          categories: [],
          totalBudget: 0,
          totalSpent: 0,
          transactions: [],
          createdAt: new Date().toISOString(),
          month: currentMonth,
        };
        await setDoc(budgetRef, newBudget);
        setCategories([]);
        setTotalBudget(0);
        setTotalSpent(0);
        setTransactions([]);
      }
    } catch (error: any) {
      console.error("Error loading budget:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudget();
  }, []);

  // Additional functions for budget management
  // (add, edit, delete transactions, update budget, etc.)

  return {
    categories,
    transactions,
    totalBudget,
    totalSpent,
    loading,
    error,
    loadBudget,
    // Additional functions would be exposed here
  };
};
