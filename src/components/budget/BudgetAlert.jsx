import {
  useContext,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  CircleAlert,
  TrendingUp,
  X,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  BudgetContext,
} from "../../context/BudgetContext";

import useFinance from "../../hooks/useFinance";

/* =========================================================
   HELPERS
========================================================= */

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function getBudgetId(budget, index) {
  return (
    budget?.id ??
    budget?._id ??
    budget?.budgetId ??
    `${budget?.category || "budget"}-${index}`
  );
}

function getBudgetLimit(budget) {
  return getSafeNumber(
    budget?.amount ??
      budget?.limit ??
      budget?.budgetAmount ??
      budget?.targetAmount
  );
}

function getBudgetCategory(budget) {
  return String(
    budget?.category ||
      budget?.title ||
      budget?.name ||
      "Other"
  ).trim();
}

function getCategorySpent(
  budget,
  transactions
) {
  /*
   * Use the stored spent value only when no matching
   * expense transaction exists.
   */

  const budgetCategory =
    getBudgetCategory(budget).toLowerCase();

  const matchingExpenses =
    transactions.filter((transaction) => {
      const transactionType = String(
        transaction?.type || ""
      ).toLowerCase();

      const transactionCategory = String(
        transaction?.category || ""
      )
        .trim()
        .toLowerCase();

      return (
        transactionType === "expense" &&
        transactionCategory ===
          budgetCategory
      );
    });

  if (matchingExpenses.length > 0) {
    return matchingExpenses.reduce(
      (total, transaction) =>
        total +
        getSafeNumber(
          transaction?.amount
        ),
      0
    );
  }

  return getSafeNumber(
    budget?.spent
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(getSafeNumber(value));
}

function getAlertType(percentage) {
  if (percentage >= 100) {
    return "danger";
  }

  if (percentage >= 80) {
    return "warning";
  }

  return null;
}

/* =========================================================
   ALERT ITEM
========================================================= */

function AlertItem({
  alert,
  index,
  onDismiss,
}) {
  const shouldReduceMotion =
    useReducedMotion();

  const isDanger =
    alert.type === "danger";

  const Icon = isDanger
    ? AlertTriangle
    : TrendingUp;

  const percentageDisplay =
    Number.isFinite(alert.percentage)
      ? alert.percentage.toFixed(1)
      : "0.0";

  return (
    <motion.article
      layout
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: -10,
              scale: 0.98,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        height: 0,
        marginTop: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }}
      transition={{
        duration: 0.3,
        delay: Math.min(
          index * 0.05,
          0.2
        ),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={[
        "relative overflow-hidden",
        "rounded-2xl border p-4",
        isDanger
          ? [
              "border-rose-500/20",
              "bg-rose-500/10",
            ].join(" ")
          : [
              "border-amber-500/20",
              "bg-amber-500/10",
            ].join(" "),
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute",
          "-right-12 -top-12",
          "size-28 rounded-full blur-3xl",
          isDanger
            ? "bg-rose-500/20"
            : "bg-amber-500/20",
        ].join(" ")}
      />

      <div className="relative flex items-start gap-3">
        <div
          className={[
            "flex size-10 shrink-0",
            "items-center justify-center",
            "rounded-xl",
            isDanger
              ? [
                  "bg-rose-500/15",
                  "text-rose-600",
                  "dark:text-rose-400",
                ].join(" ")
              : [
                  "bg-amber-500/15",
                  "text-amber-600",
                  "dark:text-amber-400",
                ].join(" "),
          ].join(" ")}
        >
          <Icon
            size={19}
            strokeWidth={2}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className={[
                  "truncate text-sm",
                  "font-bold",
                  isDanger
                    ? [
                        "text-rose-700",
                        "dark:text-rose-300",
                      ].join(" ")
                    : [
                        "text-amber-700",
                        "dark:text-amber-300",
                      ].join(" "),
                ].join(" ")}
              >
                {alert.category}
              </h3>

              <p
                className={[
                  "mt-1 text-xs",
                  "leading-5",
                  isDanger
                    ? [
                        "text-rose-600/90",
                        "dark:text-rose-300/80",
                      ].join(" ")
                    : [
                        "text-amber-700/90",
                        "dark:text-amber-300/80",
                      ].join(" "),
                ].join(" ")}
              >
                {isDanger
                  ? `You exceeded this budget by ${formatCurrency(
                      alert.exceededAmount
                    )}.`
                  : `You have used ${percentageDisplay}% of this budget.`}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                onDismiss(alert.id)
              }
              aria-label={`Dismiss ${alert.category} alert`}
              className={[
                "flex size-8 shrink-0",
                "items-center justify-center",
                "rounded-lg transition-colors",
                isDanger
                  ? [
                      "text-rose-500",
                      "hover:bg-rose-500/15",
                    ].join(" ")
                  : [
                      "text-amber-600",
                      "hover:bg-amber-500/15",
                    ].join(" "),
              ].join(" ")}
            >
              <X size={15} />
            </button>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between gap-3 text-[11px] font-semibold">
              <span
                className={
                  isDanger
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-amber-700 dark:text-amber-400"
                }
              >
                {formatCurrency(alert.spent)}
              </span>

              <span className="text-slate-500 dark:text-slate-400">
                Limit{" "}
                {formatCurrency(alert.limit)}
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/60 dark:bg-slate-950/40">
              <motion.div
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        width: 0,
                      }
                }
                animate={{
                  width: `${Math.min(
                    Math.max(
                      alert.percentage,
                      0
                    ),
                    100
                  )}%`,
                }}
                transition={{
                  duration: 0.65,
                  delay: Math.min(
                    index * 0.05,
                    0.2
                  ),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={[
                  "h-full rounded-full",
                  "bg-gradient-to-r",
                  isDanger
                    ? "from-rose-500 to-red-500"
                    : "from-amber-400 to-orange-500",
                ].join(" ")}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function BudgetAlert() {
  const budgetContext =
    useContext(BudgetContext) || {};

  const finance =
    useFinance() || {};

  const rawBudgets =
    budgetContext.budgets;

  const rawTransactions =
    finance.transactions;

  const budgets = Array.isArray(
    rawBudgets
  )
    ? rawBudgets
    : [];

  const transactions = Array.isArray(
    rawTransactions
  )
    ? rawTransactions
    : [];

  const [dismissedIds, setDismissedIds] =
    useState([]);

  const alerts = useMemo(() => {
    return budgets
      .map((budget, index) => {
        const limit =
          getBudgetLimit(budget);

        const spent =
          getCategorySpent(
            budget,
            transactions
          );

        const percentage =
          limit > 0
            ? (spent / limit) * 100
            : spent > 0
              ? 100
              : 0;

        const type =
          getAlertType(percentage);

        if (!type) {
          return null;
        }

        return {
          id: getBudgetId(
            budget,
            index
          ),

          category:
            getBudgetCategory(budget),

          limit,
          spent,
          percentage,
          type,

          exceededAmount:
            Math.max(
              spent - limit,
              0
            ),
        };
      })
      .filter(Boolean)
      .sort((first, second) => {
        if (
          first.type === "danger" &&
          second.type !== "danger"
        ) {
          return -1;
        }

        if (
          first.type !== "danger" &&
          second.type === "danger"
        ) {
          return 1;
        }

        return (
          second.percentage -
          first.percentage
        );
      });
  }, [
    budgets,
    transactions,
  ]);

  const visibleAlerts =
    alerts.filter(
      (alert) =>
        !dismissedIds.includes(
          alert.id
        )
    );

  const overBudgetCount =
    visibleAlerts.filter(
      (alert) =>
        alert.type === "danger"
    ).length;

  const warningCount =
    visibleAlerts.filter(
      (alert) =>
        alert.type === "warning"
    ).length;

  const handleDismiss = (alertId) => {
    setDismissedIds((previous) => {
      if (previous.includes(alertId)) {
        return previous;
      }

      return [
        ...previous,
        alertId,
      ];
    });
  };

  const handleDismissAll = () => {
    setDismissedIds(
      alerts.map(
        (alert) => alert.id
      )
    );
  };

  /*
   * Do not render an empty card when every
   * budget is safely below 80%.
   */

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <section className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <BellRing
                size={21}
                strokeWidth={2}
              />
            </div>

            <div className="min-w-0">
              <h2 className="section-title">
                Budget Alerts
              </h2>

              <p className="section-description">
                Review categories approaching or
                exceeding their spending limits.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismissAll}
            className="inline-flex h-9 w-fit shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Dismiss all
          </button>
        </div>

        {/* Summary */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle size={16} />

              <span className="text-xs font-bold uppercase tracking-wide">
                Over budget
              </span>
            </div>

            <p className="mt-2 text-2xl font-black text-rose-700 dark:text-rose-300">
              {overBudgetCount}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <CircleAlert size={16} />

              <span className="text-xs font-bold uppercase tracking-wide">
                Near limit
              </span>
            </div>

            <p className="mt-2 text-2xl font-black text-amber-700 dark:text-amber-300">
              {warningCount}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={16} />

              <span className="text-xs font-bold uppercase tracking-wide">
                Total alerts
              </span>
            </div>

            <p className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {visibleAlerts.length}
            </p>
          </div>
        </div>

        {/* Alerts */}
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <AnimatePresence initial={false}>
            {visibleAlerts.map(
              (alert, index) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  index={index}
                  onDismiss={
                    handleDismiss
                  }
                />
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default BudgetAlert;