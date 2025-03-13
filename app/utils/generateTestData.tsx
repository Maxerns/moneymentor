import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export const generateTestData = async (userId: string, count = 100) => {
  // Generate many budget transactions
  const transactions = [];
  const currentMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
  
  for (let i = 0; i < count; i++) {
    transactions.push({
      id: `test-${Date.now()}-${i}`,
      amount: Math.random() * 1000,
      description: `Test Transaction ${i}`,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      type: Math.random() > 0.5 ? "expense" : "income",
      category: ["Food", "Transport", "Entertainment", "Utilities", "Shopping"][Math.floor(Math.random() * 5)]
    });
  }
  
  // Add to Firestore
  await setDoc(doc(db, "users", userId, "budgets", currentMonth), {
    transactions,
    totalBudget: 10000,
    totalSpent: transactions.reduce<number>((sum, t) => t.type === "expense" ? sum + t.amount : sum, 0),
  });
  
  console.log(`Generated ${count} test transactions for user ${userId}`);
  return transactions;
};