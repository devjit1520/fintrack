import { useMemo } from "react";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarRange,
  ChartNoAxesCombined,
  CircleDollarSign,
  ReceiptText,
  Scale,
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
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "2-digit",
  }).format(date);
}

function formatFullMonth(date) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatCompactCurrency(value) {
  const amount = Number(value) || 0;
  const absoluteAmount = Math.abs(amount);

  if (absoluteAmount >= 10000000) {
    return `₹${(
      amount / 10000000
    ).toFixed(1)}Cr`;
  }

  if (absoluteAmount >= 100000) {
    return `₹${(
      amount / 100000
    ).toFixed(1)}L`;
  }

  if (absoluteAmount >= 1000) {
    return `₹${(
      amount / 1000
    ).toFixed(1)}K`;
  }

  return `₹${Math.round(amount)}`;
}

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

function MonthlyTrendTooltip({
  active,
  payload,
}) {
  if (
    !active ||
    !Array.isArray(payload) ||
    payload.length === 0
  ) {
    return null;
  }

  const data = payload[0]?.payload || {};

  const income =
    Number(data.income) || 0;

  const expense =
    Number(data.expense) || 0;

  const balance =
    Number(data.balance) || 0;

  const savingsRate =
    income > 0
      ? (balance / income) * 100
      : 0;

  return (
    <div className="min-w-[220px] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95">
      <p className="text-sm font-black text-slate-900 dark:text-white">
        {data.fullMonth || data.month}
      </p>

      <div className="mt-3 space-y-2.5">
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="size-2 rounded-full bg-emerald-500" />

            Income
          </span>

          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(income)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="size-2 rounded-full bg-rose-500" />

            Expenses
          </span>

          <span className="text-xs font-black text-rose-600 dark:text-rose-400">
            {formatCurrency(expense)}
          </span>
        </div>

        <div className="border-t border-slate-200 pt-2.5 dark:border-slate-700">
          <div className="flex items-center justify-between gap-6">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Net balance
            </span>

            <span
              className={[
                "text-sm font-black",
                balance >= 0
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-rose-600 dark:text-rose-400",
              ].join(" ")}
            >
              {formatCurrency(balance)}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-6">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Savings rate
            </span>

            <span
              className={[
                "text-xs font-black",
                savingsRate >= 20
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-amber-600 dark:text-amber-400",
              ].join(" ")}
            >
              {savingsRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CUSTOM LEGEND
========================================================= */

function TrendLegend({
  payload = [],
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-5">
      {payload.map((entry) => (
        <div
          key={entry.value}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
        >
          <span
            className="size-2.5 rounded-full"
            style={{
              backgroundColor:
                entry.color,
            }}
          />

          {entry.value}
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

function MonthlyTrendChart({
  transactions = [],
}) {
  const safeTransactions =
    Array.isArray(transactions)
      ? transactions
      : [];

  const chartData = useMemo(() => {
    const monthMap = new Map();

    safeTransactions.forEach(
      (transaction) => {
        const date =
          getTransactionDate(
            transaction
          );

        if (!date) {
          return;
        }

        const monthKey =
          getMonthKey(date);

        if (!monthMap.has(monthKey)) {
          const monthDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            1
          );

          monthMap.set(monthKey, {
            key: monthKey,
            date: monthDate,
            month:
              formatMonth(monthDate),
            fullMonth:
              formatFullMonth(monthDate),
            income: 0,
            expense: 0,
            transactionCount: 0,
          });
        }

        const currentMonth =
          monthMap.get(monthKey);

        const amount =
          getSafeNumber(
            transaction?.amount
          );

        const type = String(
          transaction?.type || ""
        ).toLowerCase();

        if (type === "income") {
          currentMonth.income +=
            amount;
        }

        if (type === "expense") {
          currentMonth.expense +=
            amount;
        }

        if (
          type === "income" ||
          type === "expense"
        ) {
          currentMonth.transactionCount +=
            1;
        }
      }
    );

    return Array.from(
      monthMap.values()
    )
      .sort(
        (first, second) =>
          first.date.getTime() -
          second.date.getTime()
      )
      .map((item) => {
        const balance =
          item.income -
          item.expense;

        const savingsRate =
          item.income > 0
            ? (
                balance /
                item.income
              ) * 100
            : 0;

        return {
          ...item,
          balance,
          savingsRate,
        };
      });
  }, [safeTransactions]);

  const analytics = useMemo(() => {
    if (chartData.length === 0) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        totalBalance: 0,
        averageBalance: 0,
        positiveMonths: 0,
        negativeMonths: 0,
        bestMonth: null,
        weakestMonth: null,
      };
    }

    const totals = chartData.reduce(
      (result, item) => {
        result.totalIncome +=
          item.income;

        result.totalExpense +=
          item.expense;

        result.totalBalance +=
          item.balance;

        if (item.balance >= 0) {
          result.positiveMonths += 1;
        } else {
          result.negativeMonths += 1;
        }

        return result;
      },
      {
        totalIncome: 0,
        totalExpense: 0,
        totalBalance: 0,
        positiveMonths: 0,
        negativeMonths: 0,
      }
    );

    const sortedByBalance = [
      ...chartData,
    ].sort(
      (first, second) =>
        second.balance -
        first.balance
    );

    return {
      ...totals,

      averageBalance:
        totals.totalBalance /
        chartData.length,

      bestMonth:
        sortedByBalance[0] ||
        null,

      weakestMonth:
        sortedByBalance[
          sortedByBalance.length - 1
        ] || null,
    };
  }, [chartData]);

  const expenseRatio =
    analytics.totalIncome > 0
      ? (
          analytics.totalExpense /
          analytics.totalIncome
        ) * 100
      : analytics.totalExpense > 0
        ? 100
        : 0;

  const isPositive =
    analytics.totalBalance >= 0;

  return (
    <section className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ChartNoAxesCombined
                size={21}
                strokeWidth={2}
              />
            </div>

            <div className="min-w-0">
              <h2 className="section-title">
                Monthly Financial Trend
              </h2>

              <p className="section-description">
                Track income, expenses and
                net balance changes over time.
              </p>
            </div>
          </div>

          {chartData.length > 0 && (
            <div
              className={[
                "w-fit rounded-2xl border",
                "px-4 py-2",
                isPositive
                  ? "border-blue-500/20 bg-blue-500/10"
                  : "border-rose-500/20 bg-rose-500/10",
              ].join(" ")}
            >
              <p
                className={[
                  "text-[10px] font-bold",
                  "uppercase tracking-wider",
                  isPositive
                    ? "text-blue-500"
                    : "text-rose-500",
                ].join(" ")}
              >
                Average balance
              </p>

              <p
                className={[
                  "mt-1 text-sm font-black",
                  isPositive
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-rose-700 dark:text-rose-300",
                ].join(" ")}
              >
                {formatCurrency(
                  analytics.averageBalance
                )}
              </p>
            </div>
          )}
        </div>

        {chartData.length === 0 ? (
          <EmptyState
            icon={ChartNoAxesCombined}
            title="No monthly trend data"
            description="Add income and expense transactions to view your financial trend."
            className="min-h-[360px]"
          />
        ) : (
          <>
            {/* Summary */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CircleDollarSign size={15} />

                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Total income
                  </p>
                </div>

                <p className="mt-2 truncate text-sm font-black text-emerald-700 dark:text-emerald-300">
                  {formatCurrency(
                    analytics.totalIncome
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3.5">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <ReceiptText size={15} />

                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Total expenses
                  </p>
                </div>

                <p className="mt-2 truncate text-sm font-black text-rose-700 dark:text-rose-300">
                  {formatCurrency(
                    analytics.totalExpense
                  )}
                </p>
              </div>

              <div
                className={[
                  "rounded-2xl border p-3.5",
                  isPositive
                    ? "border-blue-500/20 bg-blue-500/10"
                    : "border-rose-500/20 bg-rose-500/10",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex items-center gap-2",
                    isPositive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-rose-600 dark:text-rose-400",
                  ].join(" ")}
                >
                  <Scale size={15} />

                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Net balance
                  </p>
                </div>

                <p
                  className={[
                    "mt-2 truncate text-sm font-black",
                    isPositive
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-rose-700 dark:text-rose-300",
                  ].join(" ")}
                >
                  {formatCurrency(
                    analytics.totalBalance
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3.5">
                <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                  <CalendarRange size={15} />

                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Positive months
                  </p>
                </div>

                <p className="mt-2 text-sm font-black text-violet-700 dark:text-violet-300">
                  {analytics.positiveMonths} of{" "}
                  {chartData.length}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="mt-6 h-[350px] min-w-0">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <ComposedChart
                  data={chartData}
                  margin={{
                    top: 12,
                    right: 8,
                    left: -12,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="monthlyBalanceGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3b82f6"
                        stopOpacity={0.3}
                      />

                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#94a3b8"
                    strokeOpacity={0.18}
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    minTickGap={16}
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
                    width={64}
                  />

                  <ReferenceLine
                    y={0}
                    stroke="#94a3b8"
                    strokeOpacity={0.45}
                    strokeDasharray="4 4"
                  />

                  <Tooltip
                    content={
                      <MonthlyTrendTooltip />
                    }
                    cursor={{
                      stroke: "#3b82f6",
                      strokeWidth: 1,
                      strokeDasharray:
                        "4 4",
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    content={<TrendLegend />}
                  />

                  <Area
                    type="monotone"
                    dataKey="balance"
                    name="Net Balance"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#monthlyBalanceGradient)"
                    animationDuration={850}
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                      fill: "#3b82f6",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{
                      r: 3,
                      fill: "#10b981",
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 5,
                      fill: "#10b981",
                    }}
                    animationDuration={900}
                  />

                  <Line
                    type="monotone"
                    dataKey="expense"
                    name="Expenses"
                    stroke="#f43f5e"
                    strokeWidth={3}
                    dot={{
                      r: 3,
                      fill: "#f43f5e",
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 5,
                      fill: "#f43f5e",
                    }}
                    animationDuration={950}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Period insights */}
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight size={16} />

                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Best month
                  </p>
                </div>

                <p className="mt-2 truncate text-sm font-black text-emerald-700 dark:text-emerald-300">
                  {analytics.bestMonth?.fullMonth ||
                    "Not available"}
                </p>

                <p className="mt-1 text-xs font-semibold text-emerald-600/80 dark:text-emerald-300/80">
                  {formatCurrency(
                    analytics.bestMonth?.balance
                  )}{" "}
                  balance
                </p>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <ArrowDownRight size={16} />

                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Weakest month
                  </p>
                </div>

                <p className="mt-2 truncate text-sm font-black text-rose-700 dark:text-rose-300">
                  {analytics.weakestMonth?.fullMonth ||
                    "Not available"}
                </p>

                <p className="mt-1 text-xs font-semibold text-rose-600/80 dark:text-rose-300/80">
                  {formatCurrency(
                    analytics.weakestMonth?.balance
                  )}{" "}
                  balance
                </p>
              </div>

              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
                <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                  <Scale size={16} />

                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Expense ratio
                  </p>
                </div>

                <p className="mt-2 text-sm font-black text-violet-700 dark:text-violet-300">
                  {expenseRatio.toFixed(1)}%
                </p>

                <p className="mt-1 text-xs font-semibold text-violet-600/80 dark:text-violet-300/80">
                  Expenses compared with income
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default MonthlyTrendChart;