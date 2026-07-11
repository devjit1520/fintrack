import { motion } from "framer-motion";
// import CountUp from "react-countup";
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
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expense;

  const savingsRate =
    income > 0
      ? ((balance / income) * 100).toFixed(1)
      : 0;

  const cards = [
    {
      title: "Balance",
      value: balance,
      color: "text-cyan-400",
      bg: "from-cyan-500 to-blue-500",
      icon: Wallet,
      suffix: "",
      trend: "+8.2%",
    },
    {
      title: "Income",
      value: income,
      color: "text-green-400",
      bg: "from-green-500 to-emerald-500",
      icon: TrendingUp,
      suffix: "",
      trend: "+12.4%",
    },
    {
      title: "Expense",
      value: expense,
      color: "text-red-400",
      bg: "from-red-500 to-pink-500",
      icon: TrendingDown,
      suffix: "",
      trend: "-4.1%",
    },
    {
      title: "Savings",
      value: Number(savingsRate),
      color: "text-yellow-400",
      bg: "from-yellow-500 to-orange-500",
      icon: PiggyBank,
      suffix: "%",
      trend: "+2.3%",
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
            transition={{
              delay: index * 0.1,
            }}
          >
            <Card className="relative overflow-hidden">

              <div
                className={`absolute right-0 top-0 h-28 w-28 rounded-full bg-gradient-to-br ${card.bg} opacity-20 blur-3xl`}
              />

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-slate-400">
                    {card.title}
                  </p>

                  <h2
                    className={`mt-3 text-3xl font-bold ${card.color}`}
                  >
                    {card.suffix === "%" ? (
                      <>
                       {card.value}
                        %
                      </>
                    ) : (
                      <>
                        ₹
                       {card.value}
                      </>
                    )}
                  </h2>

                  <span className="mt-3 inline-block rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
                    {card.trend} this month
                  </span>

                </div>

                <div
                  className={`rounded-2xl bg-gradient-to-r ${card.bg} p-4`}
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