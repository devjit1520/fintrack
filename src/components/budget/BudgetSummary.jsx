import {
  useContext,
  useMemo,
} from "react";

import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Gauge,
  PiggyBank,
  TrendingUp,
} from "lucide-react";

import { BudgetContext } from "../../context/BudgetContext";
import useFinance from "../../hooks/useFinance";

import AnimatedNumber from "../common/AnimatedNumber";
import PremiumCard from "../common/PremiumCard";

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
      const type = String(
        transaction?.type || ""
      ).toLowerCase();

      const category = String(
        transaction?.category || ""
      ).toLowerCase();

      return (
        type === "expense" &&
        category === budgetCategory
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

function getBudgetStatus(percentage) {
  if (percentage >= 100) {
    return {
      label: "Over budget",
      description:
        "Your spending has exceeded the allocated budget.",
      icon: AlertTriangle,
      badgeClass:
        "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400",
      iconClass:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      progressClass:
        "from-rose-500 to-red-500",
    };
  }

  if (percentage >= 80) {
    return {
      label: "Approaching limit",
      description:
        "You are close to reaching your total budget.",
      icon: TrendingUp,
      badgeClass:
        "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      iconClass:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      progressClass:
        "from-amber-400 to-orange-500",
    };
  }

  return {
    label: "On track",
    description:
      "Your overall spending is within the planned budget.",
    icon: CheckCircle2,
    badgeClass:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    iconClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    progressClass:
      "from-cyan-500 to-blue-500",
  };
}

function BudgetSummary() {
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

  const overview = useMemo(() => {
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

        if (spent > limit && limit > 0) {
          result.overBudgetCount += 1;
        }

        return result;
      },
      {
        totalBudget: 0,
        totalSpent: 0,
        overBudgetCount: 0,
      }
    );
  }, [
    safeBudgets,
    safeTransactions,
  ]);

  const remaining =
    overview.totalBudget -
    overview.totalSpent;

  const percentage =
    overview.totalBudget > 0
      ? (
          overview.totalSpent /
          overview.totalBudget
        ) * 100
      : 0;

  const progressPercentage = Math.min(
    Math.max(percentage, 0),
    100
  );

  const status =
    getBudgetStatus(percentage);

  const StatusIcon = status.icon;

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)]">
      {/* Main progress card */}
      <PremiumCard
        hover={false}
        className="min-w-0"
      >
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Gauge size={21} />
              </div>

              <div>
                <h2 className="section-title">
                  Overall Budget Usage
                </h2>

                <p className="section-description">
                  Combined usage across all
                  active budget categories.
                </p>
              </div>
            </div>

            <span
              className={[
                "inline-flex w-fit items-center",
                "gap-1.5 rounded-full border",
                "px-3 py-1.5 text-xs",
                "font-bold",
                status.badgeClass,
              ].join(" ")}
            >
              <StatusIcon size={14} />

              {status.label}
            </span>
          </div>

          {/* Main value */}
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="metric-label">
                  Budget used
                </p>

                <AnimatedNumber
                  value={percentage}
                  suffix="%"
                  decimals={1}
                  className="mt-2 block text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl"
                />
              </div>

              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                ₹
                {overview.totalSpent.toLocaleString(
                  "en-IN"
                )}{" "}
                of ₹
                {overview.totalBudget.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

            {/* Progress track */}
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={[
                  "h-full rounded-full",
                  "bg-gradient-to-r",
                  "transition-[width]",
                  "duration-700 ease-out",
                  status.progressClass,
                ].join(" ")}
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {status.description}
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <CircleDollarSign size={17} />

                <p className="text-xs font-bold uppercase tracking-wide">
                  Budget
                </p>
              </div>

              <AnimatedNumber
                value={overview.totalBudget}
                prefix="₹"
                className="mt-3 block text-lg font-black text-slate-900 dark:text-white"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <TrendingUp size={17} />

                <p className="text-xs font-bold uppercase tracking-wide">
                  Spent
                </p>
              </div>

              <AnimatedNumber
                value={overview.totalSpent}
                prefix="₹"
                className="mt-3 block text-lg font-black text-slate-900 dark:text-white"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
              <div
                className={[
                  "flex items-center gap-2",
                  remaining >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400",
                ].join(" ")}
              >
                <PiggyBank size={17} />

                <p className="text-xs font-bold uppercase tracking-wide">
                  Remaining
                </p>
              </div>

              <AnimatedNumber
                value={Math.abs(remaining)}
                prefix={
                  remaining < 0
                    ? "-₹"
                    : "₹"
                }
                className="mt-3 block text-lg font-black text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </PremiumCard>

      {/* Health card */}
      <PremiumCard
        hover={false}
        className="min-w-0"
      >
        <div className="flex h-full flex-col">
          <div
            className={[
              "flex size-14 items-center",
              "justify-center rounded-2xl",
              status.iconClass,
            ].join(" ")}
          >
            <StatusIcon size={26} />
          </div>

          <h3 className="mt-5 text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Budget Health
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Monitor your spending regularly
            to avoid exceeding category
            limits.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-100/80 px-4 py-3 dark:bg-slate-800/60">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Active budgets
              </span>

              <span className="font-bold text-slate-900 dark:text-white">
                {safeBudgets.length}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-100/80 px-4 py-3 dark:bg-slate-800/60">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Over budget
              </span>

              <span
                className={[
                  "font-bold",
                  overview.overBudgetCount > 0
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-emerald-600 dark:text-emerald-400",
                ].join(" ")}
              >
                {overview.overBudgetCount}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-100/80 px-4 py-3 dark:bg-slate-800/60">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Usage rate
              </span>

              <span className="font-bold text-slate-900 dark:text-white">
                {percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}

export default BudgetSummary;