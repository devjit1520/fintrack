import { useMemo } from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  Minus,
  PiggyBank,
  ReceiptText,
  WalletCards,
} from "lucide-react";

import AnimatedNumber from "../common/AnimatedNumber";
import PremiumCard from "../common/PremiumCard";
import PremiumGrid from "../common/PremiumGrid";

/* =========================================================
   HELPERS
========================================================= */

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function getTransactionTimestamp(
  transaction
) {
  const value =
    transaction?.date ||
    transaction?.createdAt ||
    transaction?.updatedAt;

  if (!value) {
    return 0;
  }

  const timestamp =
    new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

function calculateSummary(transactions) {
  return transactions.reduce(
    (result, transaction) => {
      const amount = Math.abs(
        getSafeNumber(
          transaction?.amount
        )
      );

      const type = String(
        transaction?.type || ""
      ).toLowerCase();

      if (type === "income") {
        result.income += amount;
      }

      if (type === "expense") {
        result.expense += amount;
      }

      return result;
    },
    {
      income: 0,
      expense: 0,
    }
  );
}

function getDateBounds(
  startDate,
  endDate
) {
  if (!startDate || !endDate) {
    return null;
  }

  const startTimestamp = new Date(
    `${startDate}T00:00:00`
  ).getTime();

  const endTimestamp = new Date(
    `${endDate}T23:59:59.999`
  ).getTime();

  if (
    !Number.isFinite(startTimestamp) ||
    !Number.isFinite(endTimestamp) ||
    endTimestamp < startTimestamp
  ) {
    return null;
  }

  return {
    startTimestamp,
    endTimestamp,
  };
}

function getPreviousPeriodTransactions({
  allTransactions,
  range,
  startDate,
  endDate,
}) {
  if (range === "all") {
    return {
      transactions: [],
      available: false,
    };
  }

  const bounds = getDateBounds(
    startDate,
    endDate
  );

  if (!bounds) {
    return {
      transactions: [],
      available: false,
    };
  }

  const periodDuration =
    bounds.endTimestamp -
    bounds.startTimestamp +
    1;

  const previousEnd =
    bounds.startTimestamp - 1;

  const previousStart =
    previousEnd -
    periodDuration +
    1;

  const transactions =
    allTransactions.filter(
      (transaction) => {
        const timestamp =
          getTransactionTimestamp(
            transaction
          );

        return (
          timestamp >= previousStart &&
          timestamp <= previousEnd
        );
      }
    );

  return {
    transactions,
    available: true,
  };
}

function getPercentageChange(
  currentValue,
  previousValue
) {
  const current =
    getSafeNumber(currentValue);

  const previous =
    getSafeNumber(previousValue);

  if (previous === 0) {
    if (current === 0) {
      return 0;
    }

    return current > 0
      ? 100
      : -100;
  }

  return (
    (
      current -
      previous
    ) /
    Math.abs(previous)
  ) * 100;
}

function getTrendDetails({
  change,
  preferredDirection = "up",
}) {
  if (
    change === null ||
    change === undefined
  ) {
    return {
      icon: Minus,
      className:
        "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
    };
  }

  if (Math.abs(change) < 0.05) {
    return {
      icon: Minus,
      className:
        "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
    };
  }

  const increased = change > 0;

  const isPositive =
    preferredDirection === "up"
      ? increased
      : !increased;

  return {
    icon: increased
      ? ArrowUpRight
      : ArrowDownRight,

    className: isPositive
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  };
}

/* =========================================================
   COMPARISON BADGE
========================================================= */

function ComparisonBadge({
  change,
  available,
  preferredDirection = "up",
  mode = "percent",
}) {
  if (!available) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
        <Minus size={12} />

        All-time view
      </span>
    );
  }

  const trend = getTrendDetails({
    change,
    preferredDirection,
  });

  const Icon = trend.icon;

  const absoluteChange = Math.abs(
    getSafeNumber(change)
  );

  const sign =
    change > 0
      ? "+"
      : change < 0
        ? "-"
        : "";

  return (
    <span
      className={[
        "inline-flex items-center gap-1",
        "rounded-full border",
        "px-2.5 py-1 text-[11px]",
        "font-bold",
        trend.className,
      ].join(" ")}
    >
      <Icon size={12} />

      {sign}
      {absoluteChange.toFixed(1)}
      {mode === "points"
        ? " pts"
        : "%"}
    </span>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

function AnalyticsSummary({
  transactions = [],
  allTransactions = [],
  range = "6m",
  startDate = "",
  endDate = "",
}) {
  const currentTransactions =
    Array.isArray(transactions)
      ? transactions
      : [];

  const safeAllTransactions =
    Array.isArray(allTransactions)
      ? allTransactions
      : [];

  const analytics = useMemo(() => {
    const current =
      calculateSummary(
        currentTransactions
      );

    const previousPeriod =
      getPreviousPeriodTransactions({
        allTransactions:
          safeAllTransactions,
        range,
        startDate,
        endDate,
      });

    const previous =
      calculateSummary(
        previousPeriod.transactions
      );

    const currentBalance =
      current.income -
      current.expense;

    const previousBalance =
      previous.income -
      previous.expense;

    const currentSavingsRate =
      current.income > 0
        ? (
            currentBalance /
            current.income
          ) * 100
        : 0;

    const previousSavingsRate =
      previous.income > 0
        ? (
            previousBalance /
            previous.income
          ) * 100
        : 0;

    return {
      comparisonAvailable:
        previousPeriod.available,

      current: {
        ...current,
        balance: currentBalance,
        savingsRate:
          currentSavingsRate,
      },

      previous: {
        ...previous,
        balance: previousBalance,
        savingsRate:
          previousSavingsRate,
      },
    };
  }, [
    currentTransactions,
    safeAllTransactions,
    range,
    startDate,
    endDate,
  ]);

  const incomeChange =
    getPercentageChange(
      analytics.current.income,
      analytics.previous.income
    );

  const expenseChange =
    getPercentageChange(
      analytics.current.expense,
      analytics.previous.expense
    );

  const balanceChange =
    getPercentageChange(
      analytics.current.balance,
      analytics.previous.balance
    );

  const savingsRateChange =
    analytics.current.savingsRate -
    analytics.previous.savingsRate;

  const stats = [
    {
      title: "Total Income",
      value:
        analytics.current.income,
      prefix: "₹",
      decimals: 0,
      icon: CircleDollarSign,
      description:
        "Income received during this period",
      valueClass:
        "text-emerald-600 dark:text-emerald-400",
      iconClass:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      change: incomeChange,
      preferredDirection: "up",
      comparisonMode: "percent",
    },
    {
      title: "Total Expenses",
      value:
        analytics.current.expense,
      prefix: "₹",
      decimals: 0,
      icon: ReceiptText,
      description:
        "Money spent during this period",
      valueClass:
        "text-rose-600 dark:text-rose-400",
      iconClass:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      change: expenseChange,
      preferredDirection: "down",
      comparisonMode: "percent",
    },
    {
      title: "Net Balance",
      value: Math.abs(
        analytics.current.balance
      ),
      prefix:
        analytics.current.balance < 0
          ? "-₹"
          : "₹",
      decimals: 0,
      icon: WalletCards,
      description:
        analytics.current.balance >= 0
          ? "Income remaining after expenses"
          : "Expenses exceeded your income",
      valueClass:
        analytics.current.balance >= 0
          ? "text-blue-600 dark:text-blue-400"
          : "text-rose-600 dark:text-rose-400",
      iconClass:
        analytics.current.balance >= 0
          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
          : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      change: balanceChange,
      preferredDirection: "up",
      comparisonMode: "percent",
    },
    {
      title: "Savings Rate",
      value:
        analytics.current.savingsRate,
      prefix: "",
      suffix: "%",
      decimals: 1,
      icon: PiggyBank,
      description:
        analytics.current.savingsRate >= 20
          ? "Healthy portion of income retained"
          : "Consider increasing your savings",
      valueClass:
        analytics.current.savingsRate >= 20
          ? "text-violet-600 dark:text-violet-400"
          : "text-amber-600 dark:text-amber-400",
      iconClass:
        analytics.current.savingsRate >= 20
          ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
          : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      change: savingsRateChange,
      preferredDirection: "up",
      comparisonMode: "points",
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
            className="min-h-[190px]"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
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

                <ComparisonBadge
                  change={stat.change}
                  available={
                    analytics.comparisonAvailable
                  }
                  preferredDirection={
                    stat.preferredDirection
                  }
                  mode={
                    stat.comparisonMode
                  }
                />
              </div>

              <div className="mt-5">
                <p className="metric-label">
                  {stat.title}
                </p>

                <AnimatedNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  className={[
                    "mt-2 block text-2xl",
                    "font-black tracking-tight",
                    "sm:text-3xl",
                    stat.valueClass,
                  ].join(" ")}
                />
              </div>

              <p className="mt-auto pt-4 text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">
                {stat.description}
              </p>
            </div>
          </PremiumCard>
        );
      })}
    </PremiumGrid>
  );
}

export default AnalyticsSummary;