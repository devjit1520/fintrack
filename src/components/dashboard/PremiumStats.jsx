import { motion } from "framer-motion";

import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import useFinance from "../../hooks/useFinance";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function PremiumStats() {
  const {
    transactions = [],
    summary = {},
    loading,
    error,
  } = useFinance();

  const calculatedIncome = transactions
    .filter(
      (transaction) =>
        String(
          transaction.type || ""
        ).toLowerCase() === "income"
    )
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount || 0),
      0
    );

  const calculatedExpense = transactions
    .filter(
      (transaction) =>
        String(
          transaction.type || ""
        ).toLowerCase() === "expense"
    )
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount || 0),
      0
    );

  const income =
    Number(summary.income) ||
    calculatedIncome;

  const expense =
    Number(summary.expense) ||
    calculatedExpense;

  const balance =
    summary.balance !== undefined
      ? Number(summary.balance) || 0
      : income - expense;

  const savingsRate =
    income > 0
      ? Math.max(
          0,
          (balance / income) * 100
        )
      : 0;

  const incomeCount =
    transactions.filter(
      (transaction) =>
        String(
          transaction.type || ""
        ).toLowerCase() === "income"
    ).length;

  const expenseCount =
    transactions.filter(
      (transaction) =>
        String(
          transaction.type || ""
        ).toLowerCase() === "expense"
    ).length;

  const cards = [
    {
      id: "balance",
      title: "Total Balance",
      value: formatCurrency(balance),
      description:
        "Current available balance",
      icon: Wallet,
      trendIcon:
        balance >= 0
          ? ArrowUpRight
          : ArrowDownRight,
      trendText:
        balance >= 0
          ? "Positive balance"
          : "Negative balance",
      iconClasses:
        "bg-cyan-500/15 text-cyan-500",
      glowClasses:
        "bg-cyan-500/20",
      valueClasses:
        "text-cyan-600 dark:text-cyan-400",
      trendClasses:
        balance >= 0
          ? "text-emerald-500"
          : "text-red-500",
    },
    {
      id: "income",
      title: "Total Income",
      value: formatCurrency(income),
      description: "Money received",
      icon: TrendingUp,
      trendIcon: ArrowUpRight,
      trendText: `${incomeCount} income ${
        incomeCount === 1
          ? "record"
          : "records"
      }`,
      iconClasses:
        "bg-emerald-500/15 text-emerald-500",
      glowClasses:
        "bg-emerald-500/20",
      valueClasses:
        "text-emerald-600 dark:text-emerald-400",
      trendClasses:
        "text-emerald-500",
    },
    {
      id: "expense",
      title: "Total Expenses",
      value: formatCurrency(expense),
      description: "Money spent",
      icon: TrendingDown,
      trendIcon: ArrowDownRight,
      trendText: `${expenseCount} expense ${
        expenseCount === 1
          ? "record"
          : "records"
      }`,
      iconClasses:
        "bg-red-500/15 text-red-500",
      glowClasses:
        "bg-red-500/20",
      valueClasses:
        "text-red-600 dark:text-red-400",
      trendClasses: "text-red-500",
    },
    {
      id: "savings",
      title: "Savings Rate",
      value: `${savingsRate.toFixed(
        1
      )}%`,
      description:
        "Income successfully retained",
      icon: PiggyBank,
      trendIcon: ArrowUpRight,
      trendText:
        savingsRate >= 30
          ? "Excellent progress"
          : savingsRate >= 15
          ? "Healthy progress"
          : "Needs improvement",
      iconClasses:
        "bg-violet-500/15 text-violet-500",
      glowClasses:
        "bg-violet-500/20",
      valueClasses:
        "text-violet-600 dark:text-violet-400",
      trendClasses:
        savingsRate >= 15
          ? "text-emerald-500"
          : "text-amber-500",
    },
  ];

  if (loading) {
    return (
      <div
        className="
          grid
          gap-5
          sm:grid-cols-2
          2xl:grid-cols-4
        "
      >
        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="
                h-52
                animate-pulse
                rounded-3xl
                border
                border-slate-200
                bg-slate-100
                dark:border-slate-800
                dark:bg-slate-900
              "
            />
          )
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-red-200
          bg-red-50
          px-5
          py-4
          text-sm
          text-red-600
          dark:border-red-900
          dark:bg-red-950/30
          dark:text-red-400
        "
      >
        {error}
      </div>
    );
  }

  return (
    <div
      className="
        grid
        gap-5
        sm:grid-cols-2
        2xl:grid-cols-4
      "
    >
      {cards.map(
        (card, index) => {
          const IconComponent =
            card.icon;

          const TrendIconComponent =
            card.trendIcon;

          return (
            <motion.article
              key={card.id}
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay:
                  index * 0.08,
              }}
              whileHover={{
                y: -5,
              }}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-slate-200/80
                bg-white
                p-6
                shadow-sm
                transition-shadow
                hover:shadow-xl
                dark:border-slate-800
                dark:bg-slate-900
                dark:hover:shadow-black/20
              "
            >
              <div
                className={`
                  pointer-events-none
                  absolute
                  -right-16
                  -top-16
                  h-40
                  w-40
                  rounded-full
                  opacity-60
                  blur-3xl
                  transition
                  group-hover:opacity-100
                  ${card.glowClasses}
                `}
              />

              <div className="relative">
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-600
                        dark:text-slate-300
                      "
                    >
                      {card.title}
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-400
                        dark:text-slate-500
                      "
                    >
                      {card.description}
                    </p>
                  </div>

                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      ${card.iconClasses}
                    `}
                  >
                    <IconComponent
                      size={23}
                    />
                  </div>
                </div>

                <h3
                  className={`
                    mt-7
                    break-words
                    text-3xl
                    font-black
                    tracking-tight
                    ${card.valueClasses}
                  `}
                >
                  {card.value}
                </h3>

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    gap-2
                    border-t
                    border-slate-100
                    pt-4
                    text-xs
                    font-medium
                    text-slate-500
                    dark:border-slate-800
                    dark:text-slate-400
                  "
                >
                  <TrendIconComponent
                    size={15}
                    className={
                      card.trendClasses
                    }
                  />

                  <span>
                    {card.trendText}
                  </span>
                </div>
              </div>
            </motion.article>
          );
        }
      )}
    </div>
  );
}

export default PremiumStats;