import {
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function TransactionStats() {
  const { summary, transactions } = useFinance();

  const stats = [
    {
      title: "Transactions",
      value: transactions.length,
      icon: Wallet,
      color: "text-blue-400",
    },
    {
      title: "Income",
      value: `₹${summary.income.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-400",
    },
    {
      title: "Expenses",
      value: `₹${summary.expense.toLocaleString()}`,
      icon: TrendingDown,
      color: "text-red-400",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  {item.value}
                </h2>
              </div>

              <div className="rounded-2xl bg-slate-800 p-4">
                <Icon
                  size={28}
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