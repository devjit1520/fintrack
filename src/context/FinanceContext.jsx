import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const FinanceContext = createContext();

function calculateSummary(transactions) {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount), 0);

  const expense = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount), 0);

  const balance = income - expense;

  return {
    income,
    expense,
    balance,
    savings: balance,
  };
}

function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...transaction,
      },
      ...prev,
    ]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((item) =>
        item.id === updatedTransaction.id
          ? updatedTransaction
          : item
      )
    );
  };

  const summary = useMemo(
    () => calculateSummary(transactions),
    [transactions]
  );

  return (
    <FinanceContext.Provider
  value={{
    transactions,
    summary,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  }}
>
      {children}
    </FinanceContext.Provider>
  );
}

export default FinanceProvider;