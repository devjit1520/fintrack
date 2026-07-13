import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function PremiumStats() {
  const { transactions } = useFinance();

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const balance = income - expense;

  const savingsRate =
    income > 0
      ? ((balance / income) * 100).toFixed(1)
      : 0;

  const cards = [
    {
      title: "Total Balance",
      value: balance,
      icon: Wallet,
      color: "text-cyan-500",
      bg: "from-cyan-500 to-blue-600",
      badge: "Available",
      isMoney: true,
    },
    {
      title: "Income",
      value: income,
      icon: TrendingUp,
      color: "text-green-500",
      bg: "from-green-500 to-emerald-600",
      badge: "Received",
      isMoney: true,
    },
    {
      title: "Expenses",
      value: expense,
      icon: TrendingDown,
      color: "text-red-500",
      bg: "from-red-500 to-pink-600",
      badge: "Spent",
      isMoney: true,
    },
    {
      title: "Savings Rate",
      value: Number(savingsRate),
      icon: PiggyBank,
      color: "text-yellow-500",
      bg: "from-yellow-500 to-orange-500",
      badge: "Healthy",
      isMoney: false,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
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
              <div
                className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${card.bg} opacity-10 blur-3xl`}
              />

              <div className="relative flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {card.title}
                  </p>

                  <h2
                    className={`mt-3 text-3xl font-bold ${card.color}`}
                  >
                    {card.isMoney ? (
                      <>
                        ₹
                        {card.value.toLocaleString("en-IN")}
                      </>
                    ) : (
                      <>
                        {card.value}
                        %
                      </>
                    )}
                  </h2>

                  <span className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {card.badge}
                  </span>

                </div>

                <div
                  className={`rounded-2xl bg-gradient-to-r ${card.bg} p-4 shadow-lg`}
                >
                  <Icon
                    size={30}
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

export default PremiumStats;