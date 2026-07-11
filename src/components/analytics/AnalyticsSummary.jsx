import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function AnalyticsSummary() {
  const { transactions = [] } = useFinance();

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const balance = income - expense;

  const savingsRate =
    income > 0 ? ((balance / income) * 100).toFixed(1) : 0;

  const cards = [
    {
      title: "Total Income",
      value: `₹${income.toLocaleString("en-IN")}`,
      color: "text-green-400",
      bg: "bg-green-500/20",
      icon: TrendingUp,
    },
    {
      title: "Total Expense",
      value: `₹${expense.toLocaleString("en-IN")}`,
      color: "text-red-400",
      bg: "bg-red-500/20",
      icon: TrendingDown,
    },
    {
      title: "Current Balance",
      value: `₹${balance.toLocaleString("en-IN")}`,
      color: balance >= 0 ? "text-cyan-400" : "text-red-400",
      bg: "bg-cyan-500/20",
      icon: Wallet,
    },
    {
      title: "Savings Rate",
      value: `${savingsRate}%`,
      color: "text-yellow-400",
      bg: "bg-yellow-500/20",
      icon: PiggyBank,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    {card.title}
                  </p>

                  <h2 className={`mt-3 text-3xl font-bold ${card.color}`}>
                    {card.value}
                  </h2>
                </div>

                <div className={`rounded-2xl p-4 ${card.bg}`}>
                  <Icon
                    size={30}
                    className={card.color}
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

export default AnalyticsSummary;