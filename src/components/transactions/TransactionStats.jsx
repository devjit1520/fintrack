import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function TransactionStats() {
  const { summary, transactions } = useFinance();

  const stats = [
    {
      title: "Total Transactions",
      value: transactions.length,
      icon: Wallet,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      trend: "All records",
    },
    {
      title: "Total Income",
      value: `₹${summary.income.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
      trend: "Money received",
    },
    {
      title: "Total Expenses",
      value: `₹${summary.expense.toLocaleString("en-IN")}`,
      icon: TrendingDown,
      color: "text-red-400",
      bg: "bg-red-500/10",
      trend: "Money spent",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title}>
            <div className="flex items-center justify-between">

              {/* Content */}
              <div>
                <p className="text-sm text-slate-400">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-black dark:text-white">
                  {item.value}
                </h2>

                <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                  {item.title.includes("Income") ? (
                    <ArrowUpRight size={14} className="text-green-400" />
                  ) : item.title.includes("Expenses") ? (
                    <ArrowDownRight size={14} className="text-red-400" />
                  ) : null}

                  {item.trend}
                </p>
              </div>


              {/* Icon */}
              <div
                className={`rounded-2xl p-4 ${item.bg}`}
              >
                <Icon
                  size={30}
                  className={item.color}
                />
              </div>

            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default TransactionStats;