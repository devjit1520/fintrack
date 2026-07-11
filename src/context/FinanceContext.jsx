import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const FinanceContext = createContext();

function calculateSummary(transactions) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

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

  // =========================
  // ADD TRANSACTION
  // =========================
  const addTransaction = (transaction) => {
    const newTransaction = {
      id: crypto.randomUUID(),
      title: transaction.title,
      amount: Number(transaction.amount),
      category: transaction.category,
      type: transaction.type,
      date: transaction.date,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [
      newTransaction,
      ...prev,
    ]);
  };

  // =========================
  // UPDATE TRANSACTION
  // =========================
  const updateTransaction = (updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((item) =>
        item.id === updatedTransaction.id
          ? {
              ...item,
              ...updatedTransaction,
              amount: Number(updatedTransaction.amount),
            }
          : item
      )
    );
  };

  // =========================
  // DELETE TRANSACTION
  // =========================
  const deleteTransaction = (id) => {
    setTransactions((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // =========================
  // CLEAR ALL
  // =========================
  const clearTransactions = () => {
    setTransactions([]);
  };

  // =========================
  // EXPORT CSV
  // =========================
  const exportCSV = () => {
    if (!transactions.length) {
      alert("No transactions available.");
      return;
    }

    const headers = [
      "Title",
      "Category",
      "Type",
      "Amount",
      "Date",
    ];

    const rows = transactions.map((item) => [
      item.title,
      item.category,
      item.type,
      item.amount,
      item.date,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "transactions.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const summary = useMemo(
    () => calculateSummary(transactions),
    [transactions]
  );

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        setTransactions,
        summary,

        addTransaction,
        updateTransaction,
        deleteTransaction,

        clearTransactions,
        exportCSV,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export default FinanceProvider;