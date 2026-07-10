import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function FinancialInsights() {
  const { transactions, summary } = useFinance();

  // Expense Transactions
  const expenses = transactions.filter(
    (item) => item.type === "expense"
  );

  // Highest Expense
  const highestExpense =
    expenses.length > 0
      ? expenses.reduce((max, item) =>
          item.amount > max.amount ? item : max
        )
      : null;

  // Category Totals
  const categoryTotals = {};

  expenses.forEach((item) => {
    categoryTotals[item.category] =
      (categoryTotals[item.category] || 0) +
      Number(item.amount);
  });

  // Highest Spending Category
  const topCategory =
    Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    )[0];

  // Average Expense
  const averageExpense =
    expenses.length > 0
      ? summary.expense / expenses.length
      : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <Card>
        <p className="text-sm text-slate-400">
          Highest Expense
        </p>

        <h2 className="mt-3 text-2xl font-bold text-red-400">
          {highestExpense
            ? `₹${highestExpense.amount.toLocaleString()}`
            : "₹0"}
        </h2>

        <p className="mt-2 text-slate-500">
          {highestExpense
            ? highestExpense.title
            : "No expenses"}
        </p>
      </Card>

      <Card>
        <p className="text-sm text-slate-400">
          Top Spending Category
        </p>

        <h2 className="mt-3 text-2xl font-bold text-yellow-400">
          {topCategory
            ? topCategory[0]
            : "None"}
        </h2>

        <p className="mt-2 text-slate-500">
          {topCategory
            ? `₹${topCategory[1].toLocaleString()}`
            : "No Data"}
        </p>
      </Card>

      <Card>
        <p className="text-sm text-slate-400">
          Average Expense
        </p>

        <h2 className="mt-3 text-2xl font-bold text-cyan-400">
          ₹{averageExpense.toFixed(0)}
        </h2>

        <p className="mt-2 text-slate-500">
          Per Transaction
        </p>
      </Card>

      <Card>
        <p className="text-sm text-slate-400">
          Financial Health
        </p>

        <h2
          className={`mt-3 text-2xl font-bold ${
            summary.balance >= 0
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {summary.balance >= 0
            ? "Excellent"
            : "Warning"}
        </h2>

        <p className="mt-2 text-slate-500">
          {summary.balance >= 0
            ? "You're saving money."
            : "Expenses exceed income."}
        </p>
      </Card>

    </div>
  );
}

export default FinancialInsights;