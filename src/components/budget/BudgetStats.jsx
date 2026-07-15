import {
  useContext,
  useMemo,
} from "react";

import {
  CircleDollarSign,
  PiggyBank,
  ReceiptText,
  WalletCards,
} from "lucide-react";

import { BudgetContext } from "../../context/BudgetContext";
import useFinance from "../../hooks/useFinance";

import AnimatedNumber from "../common/AnimatedNumber";
import PremiumCard from "../common/PremiumCard";
import PremiumGrid from "../common/PremiumGrid";

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function getBudgetLimit(budget) {
  return getSafeNumber(
    budget?.amount ??
      budget?.limit ??
      budget?.budgetAmount ??
      budget?.targetAmount
  );
}

function getBudgetSpent(
  budget,
  transactions
) {
  if (
    budget?.spent !== undefined &&
    budget?.spent !== null
  ) {
    return getSafeNumber(budget.spent);
  }

  const budgetCategory = String(
    budget?.category || ""
  ).toLowerCase();

  return transactions
    .filter((transaction) => {
      const transactionType = String(
        transaction?.type || ""
      ).toLowerCase();

      const transactionCategory = String(
        transaction?.category || ""
      ).toLowerCase();

      return (
        transactionType === "expense" &&
        transactionCategory ===
          budgetCategory
      );
    })
    .reduce(
      (total, transaction) =>
        total +
        getSafeNumber(
          transaction?.amount
        ),
      0
    );
}

function BudgetStats() {
  const budgetContext =
    useContext(BudgetContext) || {};

  const {
    budgets = [],
  } = budgetContext;

  const finance = useFinance() || {};

  const {
    transactions = [],
  } = finance;

  const safeBudgets = Array.isArray(budgets)
    ? budgets
    : [];

  const safeTransactions =
    Array.isArray(transactions)
      ? transactions
      : [];

  const totals = useMemo(() => {
    return safeBudgets.reduce(
      (result, budget) => {
        const limit =
          getBudgetLimit(budget);

        const spent =
          getBudgetSpent(
            budget,
            safeTransactions
          );

        result.totalBudget += limit;
        result.totalSpent += spent;

        return result;
      },
      {
        totalBudget: 0,
        totalSpent: 0,
      }
    );
  }, [
    safeBudgets,
    safeTransactions,
  ]);

  const remaining =
    totals.totalBudget -
    totals.totalSpent;

  const stats = [
    {
      title: "Active Budgets",
      value: safeBudgets.length,
      prefix: "",
      icon: WalletCards,
      description:
        safeBudgets.length === 1
          ? "1 category tracked"
          : `${safeBudgets.length} categories tracked`,
      valueClass:
        "text-violet-600 dark:text-violet-400",
      iconClass:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
      title: "Total Budget",
      value: totals.totalBudget,
      prefix: "₹",
      icon: CircleDollarSign,
      description: "Total allocated amount",
      valueClass:
        "text-blue-600 dark:text-blue-400",
      iconClass:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Spent",
      value: totals.totalSpent,
      prefix: "₹",
      icon: ReceiptText,
      description: "Expenses across budgets",
      valueClass:
        "text-rose-600 dark:text-rose-400",
      iconClass:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    {
      title: "Remaining",
      value: remaining,
      prefix:
        remaining < 0
          ? "-₹"
          : "₹",
      displayValue:
        Math.abs(remaining),
      icon: PiggyBank,
      description:
        remaining >= 0
          ? "Available to spend"
          : "Over total budget",
      valueClass:
        remaining >= 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-rose-600 dark:text-rose-400",
      iconClass:
        remaining >= 0
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <PremiumGrid size="small">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <PremiumCard
            key={stat.title}
            delay={index * 0.06}
            className="min-h-[170px]"
          >
            <div className="flex h-full items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="metric-label">
                  {stat.title}
                </p>

                <AnimatedNumber
                  value={
                    stat.displayValue ??
                    stat.value
                  }
                  prefix={stat.prefix}
                  className={[
                    "mt-4 block text-2xl",
                    "font-black tracking-tight",
                    "sm:text-3xl",
                    stat.valueClass,
                  ].join(" ")}
                />

                <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.description}
                </p>
              </div>

              <div
                className={[
                  "flex size-12 shrink-0",
                  "items-center justify-center",
                  "rounded-2xl",
                  stat.iconClass,
                ].join(" ")}
              >
                <Icon
                  size={23}
                  strokeWidth={2}
                />
              </div>
            </div>
          </PremiumCard>
        );
      })}
    </PremiumGrid>
  );
}

export default BudgetStats;