import { motion } from "framer-motion";

import {
  ArrowDownRight,
  ArrowUpRight,
  Landmark,
  PiggyBank,
  ReceiptText,
  Target,
  WalletCards,
} from "lucide-react";

import ProfileCard from "./ProfileCard";

import useFinance from "../../hooks/useFinance";
import useGoal from "../../hooks/useGoal";
import useBudget from "../../hooks/useBudget";
import useProfile from "../../hooks/useProfile";

function getNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function getTransactionAmount(transaction) {
  return getNumber(
    transaction.amount ??
      transaction.value ??
      transaction.total ??
      0
  );
}

function getTransactionType(transaction) {
  return String(
    transaction.type ??
      transaction.transactionType ??
      ""
  ).toLowerCase();
}

function formatCurrency(
  amount,
  currency = "INR"
) {
  try {
    return new Intl.NumberFormat(
      currency === "INR"
        ? "en-IN"
        : "en-US",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }
    ).format(amount);
  } catch {
    return `₹${amount.toLocaleString(
      "en-IN"
    )}`;
  }
}

const cardStyles = {
  blue: {
    container:
      "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30",

    iconBox:
      "bg-blue-100 dark:bg-blue-900/50",

    icon: "text-blue-600 dark:text-blue-400",
  },

  green: {
    container:
      "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30",

    iconBox:
      "bg-emerald-100 dark:bg-emerald-900/50",

    icon: "text-emerald-600 dark:text-emerald-400",
  },

  red: {
    container:
      "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",

    iconBox:
      "bg-red-100 dark:bg-red-900/50",

    icon: "text-red-600 dark:text-red-400",
  },

  purple: {
    container:
      "border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/30",

    iconBox:
      "bg-violet-100 dark:bg-violet-900/50",

    icon: "text-violet-600 dark:text-violet-400",
  },

  orange: {
    container:
      "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30",

    iconBox:
      "bg-orange-100 dark:bg-orange-900/50",

    icon: "text-orange-600 dark:text-orange-400",
  },

  cyan: {
    container:
      "border-cyan-200 bg-cyan-50 dark:border-cyan-900 dark:bg-cyan-950/30",

    iconBox:
      "bg-cyan-100 dark:bg-cyan-900/50",

    icon: "text-cyan-600 dark:text-cyan-400",
  },
};

function StatisticsCard() {
  const financeData = useFinance();
  const goalData = useGoal();
  const budgetData = useBudget();

  const { profile } = useProfile();

  const transactions =
    financeData?.transactions || [];

  const goals =
    goalData?.goals || [];

  const budgets =
    budgetData?.budgets || [];

  const totalIncome =
    transactions.reduce(
      (total, transaction) => {
        const type =
          getTransactionType(
            transaction
          );

        if (type === "income") {
          return (
            total +
            getTransactionAmount(
              transaction
            )
          );
        }

        return total;
      },
      0
    );

  const totalExpenses =
    transactions.reduce(
      (total, transaction) => {
        const type =
          getTransactionType(
            transaction
          );

        if (
          type === "expense" ||
          type === "expenses"
        ) {
          return (
            total +
            getTransactionAmount(
              transaction
            )
          );
        }

        return total;
      },
      0
    );

  const totalSavings =
    totalIncome - totalExpenses;

  const completedGoals =
    goals.filter((goal) => {
      const target = getNumber(
        goal.targetAmount ??
          goal.target ??
          goal.amount
      );

      const saved = getNumber(
        goal.savedAmount ??
          goal.saved ??
          goal.currentAmount
      );

      const status = String(
        goal.status || ""
      ).toLowerCase();

      return (
        status === "completed" ||
        (target > 0 && saved >= target)
      );
    }).length;

  const totalBudgetAmount =
    budgets.reduce(
      (total, budget) =>
        total +
        getNumber(
          budget.limit ??
            budget.amount ??
            budget.budgetAmount ??
            budget.total
        ),
      0
    );

  const totalBudgetSpent =
    budgets.reduce(
      (total, budget) =>
        total +
        getNumber(
          budget.spent ??
            budget.used ??
            budget.expense ??
            budget.currentAmount
        ),
      0
    );

  const budgetUsage =
    totalBudgetAmount > 0
      ? Math.min(
          Math.round(
            (totalBudgetSpent /
              totalBudgetAmount) *
              100
          ),
          100
        )
      : 0;

  const savingsRate =
    totalIncome > 0
      ? Math.round(
          (totalSavings /
            totalIncome) *
            100
        )
      : 0;

  const currency =
    profile.preferences?.currency ||
    "INR";

  const stats = [
    {
      title: "Transactions",
      value: transactions.length,
      subtitle: "Total records",
      icon: ReceiptText,
      color: "blue",
      trend:
        transactions.length > 0
          ? "Active"
          : "No records",
      positive:
        transactions.length > 0,
    },

    {
      title: "Total Income",
      value: formatCurrency(
        totalIncome,
        currency
      ),
      subtitle: "Money received",
      icon: Landmark,
      color: "green",
      trend: `${totalIncome > 0 ? "+" : ""}${formatCurrency(
        totalIncome,
        currency
      )}`,
      positive: true,
    },

    {
      title: "Total Expenses",
      value: formatCurrency(
        totalExpenses,
        currency
      ),
      subtitle: "Money spent",
      icon: WalletCards,
      color: "red",
      trend: formatCurrency(
        totalExpenses,
        currency
      ),
      positive: false,
    },

    {
      title: "Net Savings",
      value: formatCurrency(
        totalSavings,
        currency
      ),
      subtitle: `${savingsRate}% savings rate`,
      icon: PiggyBank,
      color:
        totalSavings >= 0
          ? "purple"
          : "red",
      trend: `${savingsRate}%`,
      positive:
        totalSavings >= 0,
    },

    {
      title: "Goals Completed",
      value: `${completedGoals}/${goals.length}`,
      subtitle: "Saving goals",
      icon: Target,
      color: "orange",
      trend:
        goals.length > 0
          ? `${Math.round(
              (completedGoals /
                goals.length) *
                100
            )}%`
          : "0%",
      positive:
        completedGoals > 0,
    },

    {
      title: "Budget Usage",
      value: `${budgetUsage}%`,
      subtitle:
        totalBudgetAmount > 0
          ? `${formatCurrency(
              totalBudgetSpent,
              currency
            )} spent`
          : "No budget created",
      icon: WalletCards,
      color:
        budgetUsage >= 90
          ? "red"
          : "cyan",
      trend: `${budgetUsage}%`,
      positive:
        budgetUsage < 90,
    },
  ];

  return (
    <ProfileCard title="Account Statistics">
      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
        "
      >
        {stats.map(
          (stat, index) => {
            const Icon = stat.icon;

            const style =
              cardStyles[stat.color];

            return (
              <motion.article
                key={stat.title}
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.07,
                }}
                whileHover={{
                  y: -4,
                }}
                className={`
                  rounded-2xl
                  border
                  p-5
                  transition-shadow
                  hover:shadow-lg
                  ${style.container}
                `}
              >
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  "
                >
                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      ${style.iconBox}
                    `}
                  >
                    <Icon
                      size={22}
                      className={
                        style.icon
                      }
                    />
                  </div>

                  <div
                    className={`
                      flex
                      items-center
                      gap-1
                      rounded-full
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      ${
                        stat.positive
                          ? `
                            bg-emerald-100
                            text-emerald-700
                            dark:bg-emerald-950/60
                            dark:text-emerald-400
                          `
                          : `
                            bg-red-100
                            text-red-700
                            dark:bg-red-950/60
                            dark:text-red-400
                          `
                      }
                    `}
                  >
                    {stat.positive ? (
                      <ArrowUpRight
                        size={14}
                      />
                    ) : (
                      <ArrowDownRight
                        size={14}
                      />
                    )}

                    <span>
                      {stat.trend}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <p
                    className="
                      text-sm
                      font-medium
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {stat.title}
                  </p>

                  <h3
                    className="
                      mt-1
                      break-words
                      text-2xl
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {stat.value}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {stat.subtitle}
                  </p>
                </div>
              </motion.article>
            );
          }
        )}
      </div>
    </ProfileCard>
  );
}

export default StatisticsCard;