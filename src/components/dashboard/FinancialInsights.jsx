import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";
import {
  TrendingUp,
  AlertTriangle,
  PieChart,
  DollarSign,
} from "lucide-react";

function FinancialInsights() {
  const { transactions, summary } = useFinance();

  const expenses = transactions.filter(
    (item) => item.type === "expense"
  );

  const highestExpense =
    expenses.length > 0
      ? expenses.reduce((max, item) =>
          Number(item.amount) > Number(max.amount)
            ? item
            : max
        )
      : null;

  const categoryTotals = {};

  expenses.forEach((item) => {
    categoryTotals[item.category] =
      (categoryTotals[item.category] || 0) +
      Number(item.amount);
  });

  const topCategory =
    Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    )[0];

  const averageExpense =
    expenses.length > 0
      ? summary.expense / expenses.length
      : 0;

  const cards = [
    {
      title: "Highest Expense",
      value: highestExpense
        ? `₹${Number(
            highestExpense.amount
          ).toLocaleString("en-IN")}`
        : "₹0",
      subtitle: highestExpense
        ? highestExpense.title
        : "No Expenses",
      icon: DollarSign,
      color:
        "from-red-500 to-pink-500",
    },

    {
      title: "Top Category",
      value: topCategory
        ? topCategory[0]
        : "None",
      subtitle: topCategory
        ? `₹${topCategory[1].toLocaleString(
            "en-IN"
          )}`
        : "No Data",
      icon: PieChart,
      color:
        "from-yellow-500 to-orange-500",
    },

    {
      title: "Average Expense",
      value: `₹${averageExpense.toFixed(
        0
      )}`,
      subtitle: "Per Transaction",
      icon: TrendingUp,
      color:
        "from-cyan-500 to-blue-500",
    },

    {
      title: "Financial Health",
      value:
        summary.balance >= 0
          ? "Excellent"
          : "Warning",
      subtitle:
        summary.balance >= 0
          ? "You're saving money."
          : "Expenses exceed income.",
      icon: AlertTriangle,
      color:
        summary.balance >= 0
          ? "from-green-500 to-emerald-500"
          : "from-red-500 to-red-700",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className="
              relative
              overflow-hidden
              bg-white
              dark:bg-slate-900
              border-slate-200
              dark:border-slate-800
            "
          >
            <div
              className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${card.color} opacity-10 blur-3xl`}
            />

            <div className="relative flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>

                <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                  {card.value}
                </h2>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {card.subtitle}
                </p>

              </div>

              <div
                className={`rounded-2xl bg-gradient-to-r ${card.color} p-4 shadow-lg`}
              >
                <Icon
                  size={26}
                  className="text-white"
                />
              </div>

            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default FinancialInsights;