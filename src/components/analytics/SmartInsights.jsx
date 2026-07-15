import { useMemo } from "react";
import { motion } from "framer-motion";

import {
  AlertTriangle,
  BadgeCheck,
  BrainCircuit,
  CircleDollarSign,
  Lightbulb,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

/* =========================================================
   FORMATTERS
========================================================= */

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return currencyFormatter.format(
    Number(value) || 0
  );
}

function formatPercentage(value) {
  return `${Math.round(
    Number(value) || 0
  )}%`;
}

/* =========================================================
   DATE HELPERS
========================================================= */

function parseTransactionDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value;
  }

  const dateText = String(value).slice(
    0,
    10
  );

  const parts = dateText
    .split("-")
    .map(Number);

  if (
    parts.length === 3 &&
    Number.isFinite(parts[0]) &&
    Number.isFinite(parts[1]) &&
    Number.isFinite(parts[2])
  ) {
    const [year, month, day] = parts;

    const parsedDate = new Date(
      year,
      month - 1,
      day
    );

    return Number.isNaN(
      parsedDate.getTime()
    )
      ? null
      : parsedDate;
  }

  const fallbackDate = new Date(value);

  return Number.isNaN(
    fallbackDate.getTime()
  )
    ? null
    : fallbackDate;
}

function isSameMonth(firstDate, secondDate) {
  if (!firstDate || !secondDate) {
    return false;
  }

  return (
    firstDate.getFullYear() ===
      secondDate.getFullYear() &&
    firstDate.getMonth() ===
      secondDate.getMonth()
  );
}

function getMonthLabel(date) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  ).format(date);
}

/* =========================================================
   INSIGHT STYLES
========================================================= */

const insightStyles = {
  warning: {
    container:
      "border-amber-500/20 bg-amber-500/[0.06]",

    iconContainer:
      "bg-amber-500/10 text-amber-500",

    itemIcon:
      "bg-amber-500/10 text-amber-500",

    title:
      "text-amber-600 dark:text-amber-400",

    border:
      "border-amber-500/10",
  },

  recommendation: {
    container:
      "border-cyan-500/20 bg-cyan-500/[0.06]",

    iconContainer:
      "bg-cyan-500/10 text-cyan-500",

    itemIcon:
      "bg-cyan-500/10 text-cyan-500",

    title:
      "text-cyan-600 dark:text-cyan-400",

    border:
      "border-cyan-500/10",
  },

  positive: {
    container:
      "border-emerald-500/20 bg-emerald-500/[0.06]",

    iconContainer:
      "bg-emerald-500/10 text-emerald-500",

    itemIcon:
      "bg-emerald-500/10 text-emerald-500",

    title:
      "text-emerald-600 dark:text-emerald-400",

    border:
      "border-emerald-500/10",
  },
};

/* =========================================================
   METRIC CARD
========================================================= */

function InsightMetric({
  icon: Icon,
  label,
  value,
  description,
  valueClassName = "",
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <h4
            className={`mt-1 truncate text-xl font-bold text-slate-900 dark:text-white ${valueClassName}`}
          >
            {value}
          </h4>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INSIGHT SECTION
========================================================= */

function InsightSection({
  type,
  title,
  subtitle,
  icon: SectionIcon,
  insights,
}) {
  const styles = insightStyles[type];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className={`h-full rounded-3xl border p-5 ${styles.container}`}
    >
      <div className="mb-5 flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styles.iconContainer}`}
        >
          <SectionIcon size={21} />
        </div>

        <div>
          <h3
            className={`text-base font-bold ${styles.title}`}
          >
            {title}
          </h3>

          <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map(
          (insight, index) => {
            const ItemIcon =
              insight.icon || Sparkles;

            return (
              <motion.div
                key={insight.id}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.08,
                }}
                className={`rounded-2xl border bg-white/60 p-4 dark:bg-slate-950/20 ${styles.border}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${styles.itemIcon}`}
                  >
                    <ItemIcon size={16} />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {insight.title}
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                      {
                        insight.description
                      }
                    </p>

                    {insight.value && (
                      <p
                        className={`mt-2 text-sm font-bold ${styles.title}`}
                      >
                        {insight.value}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          }
        )}
      </div>
    </motion.div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function SmartInsights({
  transactions:
    filteredTransactions,
  range = "all",
  startDate = "",
  endDate = "",
}) {
  const finance = useFinance() || {};

  const contextTransactions =
    Array.isArray(finance.transactions)
      ? finance.transactions
      : [];

  /*
    Use transactions received from Analytics.jsx.
    If the prop is unavailable, use FinanceContext data.
  */

  const transactions = Array.isArray(
    filteredTransactions
  )
    ? filteredTransactions
    : contextTransactions;

  const analytics = useMemo(() => {
    const normalizedTransactions = (
      Array.isArray(transactions)
        ? transactions
        : []
    )
      .map((transaction) => {
        const amount = Math.abs(
          Number(transaction.amount) || 0
        );

        const type = String(
          transaction.type || ""
        ).toLowerCase();

        const parsedDate =
          parseTransactionDate(
            transaction.date ||
              transaction.createdAt ||
              transaction.updatedAt
          );

        return {
          ...transaction,
          amount,
          type,
          parsedDate,
          category:
            transaction.category ||
            "Other",
        };
      })
      .filter(
        (transaction) =>
          transaction.amount > 0 &&
          transaction.parsedDate
      );

    const today = new Date();

    const hasCurrentMonthActivity =
      normalizedTransactions.some(
        (transaction) =>
          isSameMonth(
            transaction.parsedDate,
            today
          )
      );

    const latestTransactionDate =
      normalizedTransactions.reduce(
        (latestDate, transaction) => {
          if (
            !latestDate ||
            transaction.parsedDate >
              latestDate
          ) {
            return transaction.parsedDate;
          }

          return latestDate;
        },
        null
      );

    /*
      Current month is used when current
      transactions exist.

      Otherwise, the most recent month from
      the selected analytics range is used.
    */

    const referenceDate =
      hasCurrentMonthActivity
        ? today
        : latestTransactionDate || today;

    const previousMonthDate = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() - 1,
      1
    );

    const currentMonthTransactions =
      normalizedTransactions.filter(
        (transaction) =>
          isSameMonth(
            transaction.parsedDate,
            referenceDate
          )
      );

    const previousMonthTransactions =
      normalizedTransactions.filter(
        (transaction) =>
          isSameMonth(
            transaction.parsedDate,
            previousMonthDate
          )
      );

    function getTotal(items, type) {
      return items
        .filter(
          (transaction) =>
            transaction.type === type
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0
        );
    }

    const currentIncome = getTotal(
      currentMonthTransactions,
      "income"
    );

    const currentExpense = getTotal(
      currentMonthTransactions,
      "expense"
    );

    const previousExpense = getTotal(
      previousMonthTransactions,
      "expense"
    );

    const currentBalance =
      currentIncome - currentExpense;

    const savingsRate =
      currentIncome > 0
        ? (currentBalance /
            currentIncome) *
          100
        : 0;

    const expenseTransactions =
      currentMonthTransactions.filter(
        (transaction) =>
          transaction.type ===
          "expense"
      );

    const expensesByCategory =
      expenseTransactions.reduce(
        (
          categoryTotals,
          transaction
        ) => {
          const category =
            transaction.category ||
            "Other";

          categoryTotals[category] =
            (categoryTotals[
              category
            ] || 0) +
            transaction.amount;

          return categoryTotals;
        },
        {}
      );

    const sortedCategories =
      Object.entries(
        expensesByCategory
      ).sort(
        (
          [, firstAmount],
          [, secondAmount]
        ) =>
          secondAmount -
          firstAmount
      );

    const topCategory =
      sortedCategories[0] || null;

    const topCategoryName =
      topCategory?.[0] ||
      "No category";

    const topCategoryAmount =
      topCategory?.[1] || 0;

    const topCategoryPercentage =
      currentExpense > 0
        ? (topCategoryAmount /
            currentExpense) *
          100
        : 0;

    const largestExpense =
      expenseTransactions.reduce(
        (largest, transaction) =>
          transaction.amount >
          (largest?.amount || 0)
            ? transaction
            : largest,
        null
      );

    const spendingChange =
      previousExpense > 0
        ? ((currentExpense -
            previousExpense) /
            previousExpense) *
          100
        : null;

    /* =====================================================
       SPENDING WARNINGS
    ===================================================== */

    const warnings = [];

    if (
      currentMonthTransactions.length ===
      0
    ) {
      warnings.push({
        id: "no-monthly-data",
        icon: AlertTriangle,
        title:
          "No transaction activity found",
        description:
          "Add income and expense transactions to generate automatic financial insights.",
      });
    }

    if (
      currentIncome > 0 &&
      currentExpense > currentIncome
    ) {
      warnings.push({
        id: "overspending",
        icon: AlertTriangle,
        title:
          "Expenses exceed income",
        description:
          "Your recorded expenses are currently higher than your income for this month.",
        value: `${formatCurrency(
          currentExpense -
            currentIncome
        )} over income`,
      });
    } else if (
      currentIncome > 0 &&
      currentExpense >=
        currentIncome * 0.9
    ) {
      warnings.push({
        id: "limited-balance",
        icon: WalletCards,
        title:
          "Limited balance remaining",
        description:
          "You have already used at least 90% of your recorded monthly income.",
        value: `${formatCurrency(
          Math.max(
            currentBalance,
            0
          )
        )} remaining`,
      });
    }

    if (
      currentIncome === 0 &&
      currentExpense > 0
    ) {
      warnings.push({
        id: "missing-income",
        icon: CircleDollarSign,
        title:
          "No income recorded",
        description:
          "Expenses are available, but no income transaction is recorded for this month.",
        value: `${formatCurrency(
          currentExpense
        )} spent`,
      });
    }

    if (
      spendingChange !== null &&
      spendingChange >= 15
    ) {
      warnings.push({
        id: "spending-increase",
        icon: TrendingUp,
        title:
          "Monthly spending increased",
        description:
          "Your expenses are higher than the previous month.",
        value: `${formatPercentage(
          spendingChange
        )} higher`,
      });
    }

    if (
      topCategory &&
      topCategoryPercentage >= 40
    ) {
      warnings.push({
        id: "category-concentration",
        icon: AlertTriangle,
        title: `${topCategoryName} dominates spending`,
        description:
          "A large percentage of your total expenses belongs to one category.",
        value: `${formatPercentage(
          topCategoryPercentage
        )} of expenses`,
      });
    }

    if (
      largestExpense &&
      currentIncome > 0 &&
      largestExpense.amount >=
        currentIncome * 0.3
    ) {
      warnings.push({
        id: "large-expense",
        icon: AlertTriangle,
        title:
          "Large transaction detected",
        description: `${
          largestExpense.title ||
          largestExpense.category ||
          "A transaction"
        } used a significant part of your monthly income.`,
        value: formatCurrency(
          largestExpense.amount
        ),
      });
    }

    if (
      warnings.length === 0 &&
      currentMonthTransactions.length > 0
    ) {
      warnings.push({
        id: "no-major-warning",
        icon: ShieldCheck,
        title:
          "No major warning detected",
        description:
          "Your current transaction activity does not show any critical spending risks.",
      });
    }

    /* =====================================================
       SAVINGS RECOMMENDATIONS
    ===================================================== */

    const recommendations = [];

    if (currentIncome > 0) {
      const recommendedSavings =
        currentIncome * 0.2;

      const availableSavings =
        Math.max(
          currentBalance,
          0
        );

      const savingsGap = Math.max(
        recommendedSavings -
          availableSavings,
        0
      );

      if (savingsGap > 0) {
        recommendations.push({
          id: "saving-target",
          icon: PiggyBank,
          title:
            "Work toward a 20% savings rate",
          description:
            "Saving around 20% of your income can strengthen your emergency fund and financial goals.",
          value: `Save ${formatCurrency(
            savingsGap
          )} more`,
        });
      } else {
        recommendations.push({
          id: "automate-savings",
          icon: PiggyBank,
          title:
            "Automate your monthly savings",
          description:
            "Your available balance supports a healthy savings target. Move savings before discretionary spending.",
          value: `Suggested transfer: ${formatCurrency(
            recommendedSavings
          )}`,
        });
      }
    }

    if (
      topCategory &&
      topCategoryAmount > 0
    ) {
      const possibleReduction =
        topCategoryAmount * 0.1;

      recommendations.push({
        id: "reduce-category",
        icon: TrendingDown,
        title: `Reduce ${topCategoryName} spending`,
        description:
          "Reducing your largest spending category by only 10% can create additional monthly savings.",
        value: `Potential saving: ${formatCurrency(
          possibleReduction
        )}`,
      });
    }

    if (
      currentIncome > 0 &&
      currentExpense > 0
    ) {
      const suggestedExpenseLimit =
        currentIncome * 0.8;

      const availableBuffer =
        suggestedExpenseLimit -
        currentExpense;

      if (availableBuffer > 0) {
        recommendations.push({
          id: "spending-buffer",
          icon: WalletCards,
          title:
            "Protect your spending buffer",
          description:
            "Keep expenses below approximately 80% of income to support a consistent savings habit.",
          value: `${formatCurrency(
            availableBuffer
          )} buffer available`,
        });
      }
    }

    if (
      recommendations.length === 0
    ) {
      recommendations.push({
        id: "more-data",
        icon: Lightbulb,
        title:
          "Add more transaction data",
        description:
          "Record regular income and expenses to receive more personalized savings recommendations.",
      });
    }

    /* =====================================================
       POSITIVE HIGHLIGHTS
    ===================================================== */

    const positiveHighlights = [];

    if (currentBalance > 0) {
      positiveHighlights.push({
        id: "positive-balance",
        icon: BadgeCheck,
        title:
          "Positive monthly balance",
        description:
          "Your recorded income is currently higher than your expenses.",
        value: `${formatCurrency(
          currentBalance
        )} surplus`,
      });
    }

    if (savingsRate >= 20) {
      positiveHighlights.push({
        id: "strong-savings",
        icon: PiggyBank,
        title:
          "Strong savings performance",
        description:
          "Your current savings rate meets or exceeds the recommended 20% target.",
        value: `${formatPercentage(
          savingsRate
        )} savings rate`,
      });
    } else if (
      savingsRate > 0 &&
      savingsRate < 20
    ) {
      positiveHighlights.push({
        id: "saving-progress",
        icon: PiggyBank,
        title:
          "You are saving money",
        description:
          "Your month has a positive savings rate. Small improvements can help you reach the 20% target.",
        value: `${formatPercentage(
          savingsRate
        )} savings rate`,
      });
    }

    if (
      spendingChange !== null &&
      spendingChange < 0
    ) {
      positiveHighlights.push({
        id: "expense-decrease",
        icon: TrendingDown,
        title:
          "Monthly spending decreased",
        description:
          "Your total expenses are lower than the previous month.",
        value: `${formatPercentage(
          Math.abs(
            spendingChange
          )
        )} lower`,
      });
    }

    if (
      sortedCategories.length >= 3 &&
      topCategoryPercentage < 40
    ) {
      positiveHighlights.push({
        id: "balanced-spending",
        icon: ShieldCheck,
        title:
          "Balanced spending distribution",
        description:
          "Your expenses are spread across multiple categories without excessive concentration.",
      });
    }

    if (
      positiveHighlights.length ===
      0
    ) {
      positiveHighlights.push({
        id: "baseline-created",
        icon: Sparkles,
        title:
          "Financial baseline created",
        description:
          "Your transaction data provides a useful starting point for improving future financial decisions.",
      });
    }

    return {
      periodLabel:
        getMonthLabel(referenceDate),

      currentIncome,
      currentExpense,
      currentBalance,
      savingsRate,

      warnings: warnings.slice(0, 4),

      recommendations:
        recommendations.slice(0, 4),

      positiveHighlights:
        positiveHighlights.slice(0, 4),
    };
  }, [transactions]);

  const expenseUsage =
    analytics.currentIncome > 0
      ? Math.min(
          (analytics.currentExpense /
            analytics.currentIncome) *
            100,
          100
        )
      : analytics.currentExpense > 0
        ? 100
        : 0;

  const rangeLabel = useMemo(() => {
    if (range === "30d") {
      return "Last 30 days";
    }

    if (range === "3m") {
      return "Last 3 months";
    }

    if (range === "6m") {
      return "Last 6 months";
    }

    if (range === "1y") {
      return "Last year";
    }

    if (range === "custom") {
      if (startDate && endDate) {
        return `${startDate} to ${endDate}`;
      }

      return "Custom range";
    }

    return "All transactions";
  }, [
    range,
    startDate,
    endDate,
  ]);

  const balanceValueClassName =
    analytics.currentBalance < 0
      ? "!text-rose-500"
      : analytics.currentBalance > 0
        ? "!text-emerald-500"
        : "";

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {/* Background decoration */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative">
          {/* Header */}

          <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-500">
                <BrainCircuit size={25} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Smart Insights
                  </h2>

                  <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-500">
                    Automatic
                  </span>
                </div>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Personalized warnings,
                  recommendations and positive
                  highlights generated from your
                  transaction activity.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start lg:justify-end lg:self-auto">
              <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                {rangeLabel}
              </span>

              <span className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                <Sparkles
                  size={15}
                  className="text-violet-500"
                />

                {analytics.periodLabel}
              </span>
            </div>
          </div>

          {/* Overview metrics */}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InsightMetric
              icon={CircleDollarSign}
              label="Monthly income"
              value={formatCurrency(
                analytics.currentIncome
              )}
              description="Income recorded for the analyzed month."
            />

            <InsightMetric
              icon={WalletCards}
              label="Monthly spending"
              value={formatCurrency(
                analytics.currentExpense
              )}
              description={`${formatPercentage(
                expenseUsage
              )} of recorded income used.`}
            />

            <InsightMetric
              icon={PiggyBank}
              label="Available balance"
              value={formatCurrency(
                analytics.currentBalance
              )}
              valueClassName={
                balanceValueClassName
              }
              description="Income remaining after expenses."
            />

            <InsightMetric
              icon={TrendingUp}
              label="Savings rate"
              value={formatPercentage(
                Math.max(
                  analytics.savingsRate,
                  0
                )
              )}
              description="Recommended monthly target is 20%."
            />
          </div>

          {/* Income usage progress */}

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.025]">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Income usage
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Monthly expenses compared
                  with recorded income
                </p>
              </div>

              <span
                className={`text-sm font-bold ${
                  expenseUsage >= 90
                    ? "text-rose-500"
                    : expenseUsage >= 75
                      ? "text-amber-500"
                      : "text-emerald-500"
                }`}
              >
                {formatPercentage(
                  expenseUsage
                )}
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${expenseUsage}%`,
                }}
                transition={{
                  duration: 0.9,
                  ease: "easeOut",
                }}
                className={`h-full rounded-full ${
                  expenseUsage >= 90
                    ? "bg-gradient-to-r from-rose-500 to-red-500"
                    : expenseUsage >= 75
                      ? "bg-gradient-to-r from-amber-500 to-orange-500"
                      : "bg-gradient-to-r from-cyan-500 to-emerald-500"
                }`}
              />
            </div>
          </div>

          {/* Insight sections */}

          <div className="mt-6 grid gap-5 xl:grid-cols-3">
            <InsightSection
              type="warning"
              title="Spending Warnings"
              subtitle="Potential financial risks requiring attention."
              icon={AlertTriangle}
              insights={
                analytics.warnings
              }
            />

            <InsightSection
              type="recommendation"
              title="Savings Recommendations"
              subtitle="Practical actions based on your spending data."
              icon={Lightbulb}
              insights={
                analytics.recommendations
              }
            />

            <InsightSection
              type="positive"
              title="Positive Highlights"
              subtitle="Healthy financial patterns and improvements."
              icon={BadgeCheck}
              insights={
                analytics.positiveHighlights
              }
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default SmartInsights;