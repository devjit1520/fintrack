import { useMemo, useState } from "react";
import useFinance from "./useFinance";
import useGoal from "./useGoal";
import useBudget from "./useBudget";

function useSearch() {
  const { transactions } = useFinance();
  const { goals } = useGoal();
  const { budgets } = useBudget();

  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();

    const transactionResults = transactions
      .filter(
        (t) =>
          t.category?.toLowerCase().includes(q) ||
          t.note?.toLowerCase().includes(q)
      )
      .map((t) => ({
        type: "Transaction",
        title: t.category,
        subtitle: `₹${t.amount}`,
      }));

    const goalResults = goals
      .filter((g) => g.title?.toLowerCase().includes(q))
      .map((g) => ({
        type: "Goal",
        title: g.title,
        subtitle: `₹${g.saved} / ₹${g.target}`,
      }));

    const budgetResults = budgets
      .filter((b) => b.category?.toLowerCase().includes(q))
      .map((b) => ({
        type: "Budget",
        title: b.category,
        subtitle: `₹${b.amount}`,
      }));

    return [
      ...transactionResults,
      ...goalResults,
      ...budgetResults,
    ];
  }, [query, transactions, goals, budgets]);

  return {
    query,
    setQuery,
    results,
  };
}

export default useSearch;