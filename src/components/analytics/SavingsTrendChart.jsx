import { useMemo } from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  PiggyBank,
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

function formatMonth(date) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      month: "short",
      year: "2-digit",
    }
  ).format(date);
}

function formatCurrency(value) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(Number(value) || 0);
}

function formatCompactCurrency(value) {
  const amount = Number(value) || 0;

  if (Math.abs(amount) >= 10000000) {
    return `₹${(
      amount / 10000000
    ).toFixed(1)}Cr`;
  }

  if (Math.abs(amount) >= 100000) {
    return `₹${(
      amount / 100000
    ).toFixed(1)}L`;
  }

  if (Math.abs(amount) >= 1000) {
    return `₹${(
      amount / 1000
    ).toFixed(1)}K`;
  }

  return `₹${amount}`;
}

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

function SavingsTooltip({
  active,
  payload,
  label,
}) {
  if (
    !active ||
    !Array.isArray(payload) ||
    payload.length === 0
  ) {
    return null;
  }

  const data = payload[0]?.payload || {};

  return (
    <div className="min-w-[190px] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95">
      <p className="text-sm font-black text-slate-900 dark:text-white">
        {label}
      </p>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between gap-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Income
          </span>

          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(data.income)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Expenses
          </span>

          <span className="text-xs font-black text-rose-600 dark:text-rose-400">
            {formatCurrency(data.expense)}
          </span>
        </div>

        <div className="border-t border-slate-200 pt-2 dark:border-slate-700">
          <div className="flex items-center justify-between gap-5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Net savings
            </span>

            <span
              className={[
                "text-sm font-black",
                data.savings >= 0
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-rose-600 dark:text-rose-400",
              ].join(" ")}
            >
              {formatCurrency(data.savings)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

function SavingsTrendChart({
  transactions = [],
}) {
  const safeTransactions =
    Array.isArray(transactions)
      ? transactions
      : [];

  const chartData = useMemo(() => {
    const monthlyData = new Map();

    safeTransactions.forEach(
      (transaction) => {
        const date =
          getTransactionDate(
            transaction
          );

        if (!date) {
          return;
        }

        const key = getMonthKey(date);

        if (!monthlyData.has(key)) {
          monthlyData.set(key, {
            key,
            date: new Date(
              date.getFullYear(),
              date.getMonth(),
              1
            ),
            income: 0,
            expense: 0,
          });
        }

        const current =
          monthlyData.get(key);

        const amount =
          getSafeNumber(
            transaction?.amount
          );

        const type = String(
          transaction?.type || ""
        ).toLowerCase();

        if (type === "income") {
          current.income += amount;
        }

        if (type === "expense") {
          current.expense += amount;
        }
      }
    );

    return Array.from(
      monthlyData.values()
    )
      .sort(
        (first, second) =>
          first.date.getTime() -
          second.date.getTime()
      )
      .map((item) => ({
        month: formatMonth(item.date),
        income: item.income,
        expense: item.expense,
        savings:
          item.income -
          item.expense,
      }));
  }, [safeTransactions]);

  const totals = useMemo(() => {
    return chartData.reduce(
      (result, item) => {
        result.income += item.income;
        result.expense += item.expense;
        result.savings += item.savings;

        return result;
      },
      {
        income: 0,
        expense: 0,
        savings: 0,
      }
    );
  }, [chartData]);

  const averageSavings =
    chartData.length > 0
      ? totals.savings /
        chartData.length
      : 0;

  return (
    <section className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <TrendingUp size={21} />
            </div>

            <div className="min-w-0">
              <h2 className="section-title">
                Savings Trend
              </h2>

              <p className="section-description">
                Monthly income remaining after
                expenses.
              </p>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="w-fit rounded-2xl border border-violet-500/20 bg-violet-500/10 px-4 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet-500">
                Average savings
              </p>

              <p
                className={[
                  "mt-1 text-sm font-black",
                  averageSavings >= 0
                    ? "text-violet-700 dark:text-violet-300"
                    : "text-rose-600 dark:text-rose-400",
                ].join(" ")}
              >
                {formatCurrency(
                  averageSavings
                )}
              </p>
            </div>
          )}
        </div>

        {chartData.length === 0 ? (
          <EmptyState
            icon={PiggyBank}
            title="No savings data"
            description="Add income and expense transactions to view your monthly savings trend."
            className="min-h-[320px]"
          />
        ) : (
          <>
            {/* Summary */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/30">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total income
                </p>

                <p className="mt-2 truncate text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(
                    totals.income
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/30">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total expenses
                </p>

                <p className="mt-2 truncate text-sm font-black text-rose-600 dark:text-rose-400">
                  {formatCurrency(
                    totals.expense
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/30">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Net savings
                </p>

                <p
                  className={[
                    "mt-2 truncate text-sm font-black",
                    totals.savings >= 0
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-rose-600 dark:text-rose-400",
                  ].join(" ")}
                >
                  {formatCurrency(
                    totals.savings
                  )}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="mt-6 h-[310px] min-w-0">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 8,
                    left: -12,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="savingsTrendGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.4}
                      />

                      <stop
                        offset="95%"
                        stopColor="#8b5cf6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={
                      formatCompactCurrency
                    }
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                    width={62}
                  />

                  <Tooltip
                    content={
                      <SavingsTooltip />
                    }
                    cursor={{
                      stroke: "#8b5cf6",
                      strokeWidth: 1,
                      strokeDasharray:
                        "4 4",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="savings"
                    name="Savings"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fill="url(#savingsTrendGradient)"
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                      fill: "#8b5cf6",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/*
 * Required because Analytics.jsx uses:
 *
 * import SavingsTrendChart from
 * "../../components/analytics/SavingsTrendChart";
 */

export default SavingsTrendChart;