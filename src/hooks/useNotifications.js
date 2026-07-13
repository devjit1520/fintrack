import { useMemo } from "react";
import useFinance from "./useFinance";
import useBudget from "./useBudget";
import useGoal from "./useGoal";

function useNotifications() {
  const { transactions } = useFinance();
  const { budgets } = useBudget();
  const { goals } = useGoal();

  const notifications = useMemo(() => {
    const items = [];

    // Latest Transactions
    transactions
      .slice(-5)
      .reverse()
      .forEach((t) => {
        items.push({
          id: crypto.randomUUID(),
          title:
            t.type === "income"
              ? "Income Added"
              : "Expense Added",
          message: `${t.category} • ₹${t.amount}`,
          type: t.type,
        });
      });

    // Budget Warning
    budgets.forEach((budget) => {
      const spent = transactions
        .filter(
          (t) =>
            t.type === "expense" &&
            t.category === budget.category
        )
        .reduce(
          (sum, t) => sum + Number(t.amount),
          0
        );

      const percent =
        budget.amount > 0
          ? (spent / budget.amount) * 100
          : 0;

      if (percent >= 80) {
        items.push({
          id: crypto.randomUUID(),
          title: "Budget Alert",
          message: `${budget.category} budget is ${percent.toFixed(
            0
          )}% used.`,
          type: "warning",
        });
      }
    });

    // Goals
    goals.forEach((goal) => {
      if (goal.saved >= goal.target) {
        items.push({
          id: crypto.randomUUID(),
          title: "Goal Achieved 🎉",
          message: goal.title,
          type: "success",
        });
      }
    });

    return items.reverse();
  }, [transactions, budgets, goals]);

  return {
    notifications,
    unread: notifications.length,
  };
}

export default useNotifications;