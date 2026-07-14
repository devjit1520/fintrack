import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const BudgetContext = createContext();

function BudgetProvider({ children }) {
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("budgets");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "budgets",
      JSON.stringify(budgets)
    );
  }, [budgets]);

  const addBudget = (budget) => {
    setBudgets((prev) => [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...budget,
      },
      ...prev,
    ]);
  };

  const updateBudget = (updatedBudget) => {
    setBudgets((prev) =>
      prev.map((item) =>
        item.id === updatedBudget.id
          ? updatedBudget
          : item
      )
    );
  };

  const deleteBudget = (id) => {
    setBudgets((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const totalBudget = useMemo(() => {
    return budgets.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );
  }, [budgets]);

  const clearBudgets = () => {
  setBudgets([]);
  localStorage.removeItem("budgets");
};

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        totalBudget,
        addBudget,
        updateBudget,
        deleteBudget,
        clearBudgets,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export default BudgetProvider;