import { motion } from "framer-motion";
// import CountUp from "react-countup";
import {
  Receipt,
  TrendingUp,
  TrendingDown,
  CalendarDays,
} from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function AnalyticsCards() {
  const { transactions = [] } = useFinance();

  const totalTransactions = transactions.length;

  const highestIncome = transactions
    .filter((item) => item.type === "income")
    .reduce(
      (max, item) => Math.max(max, Number(item.amount)),
      0
    );

  const highestExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce(
      (max, item) => Math.max(max, Number(item.amount)),
      0
    );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTotal = transactions
    .filter((item) => {
      const date = new Date(item.date);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce(
      (total, item) => total + Number(item.amount),
      0
    );

  const analytics = [
    {
      id: 1,
      title: "Transactions",
      value: totalTransactions,
      prefix: "",
      icon: Receipt,
      color: "text-cyan-500",
      bg: "from-cyan-500 to-blue-600",
    },
    {
      id: 2,
      title: "Highest Income",
      value: highestIncome,
      prefix: "₹",
      icon: TrendingUp,
      color: "text-green-500",
      bg: "from-green-500 to-emerald-600",
    },
    {
      id: 3,
      title: "Highest Expense",
      value: highestExpense,
      prefix: "₹",
      icon: TrendingDown,
      color: "text-red-500",
      bg: "from-red-500 to-pink-600",
    },
    {
      id: 4,
      title: "This Month",
      value: monthlyTotal,
      prefix: "₹",
      icon: CalendarDays,
      color: "text-purple-500",
      bg: "from-purple-500 to-indigo-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {analytics.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.id}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.1,
            }}
          >
            <Card
              className="
                relative
                overflow-hidden

                bg-white
                dark:bg-slate-900

                border-slate-200
                dark:border-slate-800
              "
            >
              {/* Glow */}
              <div
                className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${item.bg} opacity-10 blur-3xl`}
              />

              <div className="relative flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.title}
                  </p>

<h2
  className={`mt-3 text-3xl font-bold ${item.color}`}
>
  {item.prefix}
  {Number(item.value).toLocaleString("en-IN")}
</h2>

                </div>

                <div
                  className={`rounded-2xl bg-gradient-to-r ${item.bg} p-4 shadow-lg`}
                >
                  <Icon
                    size={28}
                    className="text-white"
                  />
                </div>

              </div>

            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

export default AnalyticsCards; 