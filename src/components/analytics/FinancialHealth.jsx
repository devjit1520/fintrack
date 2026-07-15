import { useMemo } from "react";

import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  CircleDollarSign,
  Gauge,
  HeartPulse,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import EmptyState from "../common/EmptyState";

/* =========================================================
   HELPERS
========================================================= */

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? Math.abs(number)
    : 0;
}

function getTransactionDate(transaction) {
  const value =
    transaction?.date ||
    transaction?.createdAt ||
    transaction?.updatedAt;

  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function getMonthKey(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function clamp(value, minimum, maximum) {
  return Math.min(
    Math.max(value, minimum),
    maximum
  );
}

/* =========================================================
   SCORE CALCULATIONS
========================================================= */

function getSavingsScore(savingsRate) {
  if (savingsRate >= 30) {
    return 35;
  }

  if (savingsRate >= 20) {
    return 30;
  }

  if (savingsRate >= 10) {
    return 22;
  }

  if (savingsRate >= 0) {
    return 12;
  }

  return 0;
}

function getExpenseScore(expenseRatio) {
  if (expenseRatio <= 60) {
    return 25;
  }

  if (expenseRatio <= 75) {
    return 20;
  }

  if (expenseRatio <= 90) {
    return 13;
  }

  if (expenseRatio <= 100) {
    return 6;
  }

  return 0;
}

function getConsistencyScore(
  positiveMonthRate
) {
  return Math.round(
    clamp(
      positiveMonthRate,
      0,
      100
    ) * 0.2
  );
}

function getActivityScore(
  transactionCount
) {
  if (transactionCount >= 30) {
    return 10;
  }

  if (transactionCount >= 20) {
    return 8;
  }

  if (transactionCount >= 10) {
    return 6;
  }

  if (transactionCount >= 5) {
    return 4;
  }

  if (transactionCount > 0) {
    return 2;
  }

  return 0;
}

function getIncomeStabilityScore(
  incomeMonthRate
) {
  return Math.round(
    clamp(
      incomeMonthRate,
      0,
      100
    ) * 0.1
  );
}

/* =========================================================
   HEALTH STATUS
========================================================= */

function getHealthStatus(score) {
  if (score >= 85) {
    return {
      label: "Excellent",
      description:
        "Your finances show strong savings, healthy spending and consistent positive cash flow.",
      icon: BadgeCheck,
      color: "#10b981",
      textClass:
        "text-emerald-600 dark:text-emerald-400",
      backgroundClass:
        "border-emerald-500/20 bg-emerald-500/10",
      progressClass:
        "from-emerald-500 to-teal-500",
    };
  }

  if (score >= 70) {
    return {
      label: "Good",
      description:
        "Your finances are performing well, with a few areas that could still be improved.",
      icon: ShieldCheck,
      color: "#06b6d4",
      textClass:
        "text-cyan-600 dark:text-cyan-400",
      backgroundClass:
        "border-cyan-500/20 bg-cyan-500/10",
      progressClass:
        "from-cyan-500 to-blue-500",
    };
  }

  if (score >= 50) {
    return {
      label: "Fair",
      description:
        "Your finances are stable, but savings or spending habits need more attention.",
      icon: Gauge,
      color: "#f59e0b",
      textClass:
        "text-amber-600 dark:text-amber-400",
      backgroundClass:
        "border-amber-500/20 bg-amber-500/10",
      progressClass:
        "from-amber-400 to-orange-500",
    };
  }

  return {
    label: "Needs Attention",
    description:
      "Expenses, savings or cash-flow consistency need immediate improvement.",
    icon: AlertTriangle,
    color: "#f43f5e",
    textClass:
      "text-rose-600 dark:text-rose-400",
    backgroundClass:
      "border-rose-500/20 bg-rose-500/10",
    progressClass:
      "from-rose-500 to-red-500",
  };
}

/* =========================================================
   SCORE RING
========================================================= */

function HealthScoreRing({
  score,
  color,
}) {
  const radius = 62;
  const circumference =
    2 * Math.PI * radius;

  const safeScore = clamp(
    score,
    0,
    100
  );

  const offset =
    circumference -
    (
      safeScore /
      100
    ) *
      circumference;

  return (
    <div className="relative flex size-[170px] items-center justify-center">
      <svg
        viewBox="0 0 150 150"
        className="size-full -rotate-90"
      >
        <circle
          cx="75"
          cy="75"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="11"
          className="text-slate-200 dark:text-slate-800"
        />

        <circle
          cx="75"
          cy="75"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>

      <div className="absolute text-center">
        <p className="text-4xl font-black tracking-tight text-slate-950 dark:text-white">
          {score}
        </p>

        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
          out of 100
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SCORE ITEM
========================================================= */

function ScoreItem({
  title,
  description,
  score,
  maximum,
  icon: Icon,
  progressClass,
}) {
  const percentage =
    maximum > 0
      ? (
          score /
          maximum
        ) * 100
      : 0;

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>

            <span className="shrink-0 text-sm font-black text-slate-900 dark:text-white">
              {score}/{maximum}
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className={[
                "h-full rounded-full",
                "bg-gradient-to-r",
                "transition-[width]",
                "duration-700",
                progressClass,
              ].join(" ")}
              style={{
                width: `${clamp(
                  percentage,
                  0,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

function FinancialHealth({
  transactions = [],
}) {
  const safeTransactions =
    Array.isArray(transactions)
      ? transactions
      : [];

  const analytics = useMemo(() => {
    const monthlyData = new Map();

    let totalIncome = 0;
    let totalExpense = 0;
    let incomeTransactions = 0;
    let expenseTransactions = 0;

    safeTransactions.forEach(
      (transaction) => {
        const type = String(
          transaction?.type || ""
        ).toLowerCase();

        if (
          type !== "income" &&
          type !== "expense"
        ) {
          return;
        }

        const amount = getSafeNumber(
          transaction?.amount
        );

        if (amount <= 0) {
          return;
        }

        if (type === "income") {
          totalIncome += amount;
          incomeTransactions += 1;
        }

        if (type === "expense") {
          totalExpense += amount;
          expenseTransactions += 1;
        }

        const date =
          getTransactionDate(
            transaction
          );

        if (!date) {
          return;
        }

        const monthKey =
          getMonthKey(date);

        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            income: 0,
            expense: 0,
          });
        }

        monthlyData.get(monthKey)[type] +=
          amount;
      }
    );

    const months = Array.from(
      monthlyData.values()
    );

    const positiveMonths =
      months.filter(
        (month) =>
          month.income >=
          month.expense
      ).length;

    const incomeMonths =
      months.filter(
        (month) =>
          month.income > 0
      ).length;

    const balance =
      totalIncome -
      totalExpense;

    const savingsRate =
      totalIncome > 0
        ? (
            balance /
            totalIncome
          ) * 100
        : totalExpense > 0
          ? -100
          : 0;

    const expenseRatio =
      totalIncome > 0
        ? (
            totalExpense /
            totalIncome
          ) * 100
        : totalExpense > 0
          ? 100
          : 0;

    const positiveMonthRate =
      months.length > 0
        ? (
            positiveMonths /
            months.length
          ) * 100
        : 0;

    const incomeMonthRate =
      months.length > 0
        ? (
            incomeMonths /
            months.length
          ) * 100
        : 0;

    const scores = {
      savings:
        getSavingsScore(
          savingsRate
        ),

      expenses:
        getExpenseScore(
          expenseRatio
        ),

      consistency:
        getConsistencyScore(
          positiveMonthRate
        ),

      activity:
        getActivityScore(
          safeTransactions.length
        ),

      stability:
        getIncomeStabilityScore(
          incomeMonthRate
        ),
    };

    const healthScore = clamp(
      scores.savings +
        scores.expenses +
        scores.consistency +
        scores.activity +
        scores.stability,
      0,
      100
    );

    return {
      totalIncome,
      totalExpense,
      balance,
      savingsRate,
      expenseRatio,
      positiveMonths,
      incomeMonths,
      monthCount: months.length,
      incomeTransactions,
      expenseTransactions,
      scores,
      healthScore,
    };
  }, [safeTransactions]);

  if (safeTransactions.length === 0) {
    return (
      <section className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <EmptyState
          icon={HeartPulse}
          title="No financial health data"
          description="Add income and expense transactions to calculate your financial health score."
          className="min-h-[420px]"
        />
      </section>
    );
  }

  const status = getHealthStatus(
    analytics.healthScore
  );

  const StatusIcon = status.icon;

  const scoreItems = [
    {
      title: "Savings performance",
      description: `${analytics.savingsRate.toFixed(
        1
      )}% of income retained`,
      score:
        analytics.scores.savings,
      maximum: 35,
      icon: PiggyBank,
      progressClass:
        "from-violet-500 to-purple-500",
    },
    {
      title: "Expense control",
      description: `${analytics.expenseRatio.toFixed(
        1
      )}% expense-to-income ratio`,
      score:
        analytics.scores.expenses,
      maximum: 25,
      icon: ReceiptText,
      progressClass:
        "from-rose-500 to-orange-500",
    },
    {
      title: "Cash-flow consistency",
      description: `${analytics.positiveMonths} of ${analytics.monthCount} months positive`,
      score:
        analytics.scores.consistency,
      maximum: 20,
      icon: TrendingUp,
      progressClass:
        "from-emerald-500 to-teal-500",
    },
    {
      title: "Tracking activity",
      description: `${safeTransactions.length} transactions reviewed`,
      score:
        analytics.scores.activity,
      maximum: 10,
      icon: Activity,
      progressClass:
        "from-blue-500 to-cyan-500",
    },
    {
      title: "Income stability",
      description: `${analytics.incomeMonths} of ${analytics.monthCount} months had income`,
      score:
        analytics.scores.stability,
      maximum: 10,
      icon: CircleDollarSign,
      progressClass:
        "from-amber-400 to-orange-500",
    },
  ];

  return (
    <section className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HeartPulse size={21} />
            </div>

            <div className="min-w-0">
              <h2 className="section-title">
                Financial Health
              </h2>

              <p className="section-description">
                A financial wellness score based
                on savings, spending and cash-flow
                consistency.
              </p>
            </div>
          </div>

          <span
            className={[
              "inline-flex w-fit items-center",
              "gap-1.5 rounded-full border",
              "px-3 py-1.5 text-xs",
              "font-bold",
              status.backgroundClass,
              status.textClass,
            ].join(" ")}
          >
            <StatusIcon size={14} />

            {status.label}
          </span>
        </div>

        {/* Main score */}
        <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
          <div className="flex justify-center">
            <HealthScoreRing
              score={
                analytics.healthScore
              }
              color={status.color}
            />
          </div>

          <div className="min-w-0">
            <h3
              className={[
                "text-2xl font-black",
                "tracking-tight",
                status.textClass,
              ].join(" ")}
            >
              {status.label} financial health
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              {status.description}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Income
                </p>

                <p className="mt-2 truncate text-sm font-black text-emerald-700 dark:text-emerald-300">
                  {formatCurrency(
                    analytics.totalIncome
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Expenses
                </p>

                <p className="mt-2 truncate text-sm font-black text-rose-700 dark:text-rose-300">
                  {formatCurrency(
                    analytics.totalExpense
                  )}
                </p>
              </div>

              <div
                className={[
                  "rounded-2xl border p-3.5",
                  analytics.balance >= 0
                    ? "border-blue-500/20 bg-blue-500/10"
                    : "border-rose-500/20 bg-rose-500/10",
                ].join(" ")}
              >
                <p
                  className={[
                    "text-[10px] font-bold",
                    "uppercase tracking-wider",
                    analytics.balance >= 0
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-rose-600 dark:text-rose-400",
                  ].join(" ")}
                >
                  Balance
                </p>

                <p
                  className={[
                    "mt-2 truncate text-sm",
                    "font-black",
                    analytics.balance >= 0
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-rose-700 dark:text-rose-300",
                  ].join(" ")}
                >
                  {formatCurrency(
                    analytics.balance
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="mt-7">
          <div className="mb-4 flex items-center gap-2">
            <Gauge
              size={17}
              className="text-slate-500"
            />

            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Score Breakdown
            </h3>
          </div>

          <div className="grid gap-3">
            {scoreItems.map((item) => (
              <ScoreItem
                key={item.title}
                {...item}
              />
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div
          className={[
            "mt-6 rounded-2xl border p-4",
            status.backgroundClass,
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            <StatusIcon
              size={19}
              className={[
                "mt-0.5 shrink-0",
                status.textClass,
              ].join(" ")}
            />

            <div>
              <p
                className={[
                  "text-sm font-bold",
                  status.textClass,
                ].join(" ")}
              >
                Health recommendation
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                {analytics.savingsRate < 20
                  ? "Aim to retain at least 20% of your income by reducing discretionary expenses and automating regular savings."
                  : analytics.expenseRatio > 80
                    ? "Your savings rate is positive, but expenses remain high. Review your largest spending categories for reductions."
                    : analytics.positiveMonths <
                        analytics.monthCount
                      ? "Your overall performance is healthy. Focus on keeping every month cash-flow positive."
                      : "Your financial habits are performing strongly. Continue maintaining your savings rate and expense discipline."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinancialHealth;