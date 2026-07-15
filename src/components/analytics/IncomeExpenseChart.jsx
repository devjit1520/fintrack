import { useMemo } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
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
   TOOLTIP
========================================================= */

function ChartTooltip({
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

  const income = Number(data.income) || 0;
  const expense = Number(data.expense) || 0;
  const balance = income - expense;

  return (
    <div className="min-w-[210px] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95">
      <p className="text-sm font-black text-slate-900 dark:text-white">
        {label}
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
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   LEGEND
========================================================= */

function CustomLegend({
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

function IncomeExpenseChart({
  transactions = [],
}) {
  const safeTransactions =
    Array.isArray(transactions)
      ? transactions
      : [];

  const chartData = useMemo(() => {
    const groupedMonths = new Map();

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

        if (!groupedMonths.has(key)) {
          groupedMonths.set(key, {
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

        const currentMonth =
          groupedMonths.get(key);

        const amount =
          getSafeNumber(
            transaction?.amount
          );

        const type = String(
          transaction?.type || ""
        ).toLowerCase();

        if (type === "income") {
          currentMonth.income += amount;
        }

        if (type === "expense") {
          currentMonth.expense += amount;
        }
      }
    );

    return Array.from(
      groupedMonths.values()
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
        balance:
          item.income -
          item.expense,
      }));
  }, [safeTransactions]);

  const summary = useMemo(() => {
    return chartData.reduce(
      (result, item) => {
        result.income += item.income;
        result.expense += item.expense;

        if (
          item.income >= item.expense
        ) {
          result.positiveMonths += 1;
        } else {
          result.negativeMonths += 1;
        }

        return result;
      },
      {
        income: 0,
        expense: 0,
        positiveMonths: 0,
        negativeMonths: 0,
      }
    );
  }, [chartData]);

  const netBalance =
    summary.income -
    summary.expense;

  const expenseRatio =
    summary.income > 0
      ? (
          summary.expense /
          summary.income
        ) * 100
      : summary.expense > 0
        ? 100
        : 0;

  const highestIncome =
    chartData.length > 0
      ? Math.max(
          ...chartData.map(
            (item) => item.income
          )
        )
      : 0;

  const highestExpense =
    chartData.length > 0
      ? Math.max(
          ...chartData.map(
            (item) => item.expense
          )
        )
      : 0;

  return (
    <section className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <BarChart3
                size={21}
                strokeWidth={2}
              />
            </div>

            <div className="min-w-0">
              <h2 className="section-title">
                Income vs Expenses
              </h2>

              <p className="section-description">
                Compare monthly earnings and
                spending across the selected
                period.
              </p>
            </div>
          </div>

          {chartData.length > 0 && (
            <div
              className={[
                "w-fit rounded-2xl border",
                "px-4 py-2",
                netBalance >= 0
                  ? "border-blue-500/20 bg-blue-500/10"
                  : "border-rose-500/20 bg-rose-500/10",
              ].join(" ")}
            >
              <p
                className={[
                  "text-[10px] font-bold",
                  "uppercase tracking-wider",
                  netBalance >= 0
                    ? "text-blue-500"
                    : "text-rose-500",
                ].join(" ")}
              >
                Net balance
              </p>

              <p
                className={[
                  "mt-1 text-sm font-black",
                  netBalance >= 0
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-rose-700 dark:text-rose-300",
                ].join(" ")}
              >
                {formatCurrency(netBalance)}
              </p>
            </div>
          )}
        </div>

        {chartData.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="No income or expense data"
            description="Add transactions to compare your income and expenses across time."
            className="min-h-[360px]"
          />
        ) : (
          <>
            {/* Summary cards */}
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
                    summary.income
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
                    summary.expense
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-3.5">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Scale size={15} />

                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Expense ratio
                  </p>
                </div>

                <p className="mt-2 text-sm font-black text-blue-700 dark:text-blue-300">
                  {expenseRatio.toFixed(1)}%
                </p>
              </div>

              <div
                className={[
                  "rounded-2xl border p-3.5",
                  netBalance >= 0
                    ? "border-violet-500/20 bg-violet-500/10"
                    : "border-amber-500/20 bg-amber-500/10",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex items-center gap-2",
                    netBalance >= 0
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-amber-600 dark:text-amber-400",
                  ].join(" ")}
                >
                  {netBalance >= 0 ? (
                    <ArrowUpRight size={15} />
                  ) : (
                    <ArrowDownRight size={15} />
                  )}

                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Positive months
                  </p>
                </div>

                <p
                  className={[
                    "mt-2 text-sm font-black",
                    netBalance >= 0
                      ? "text-violet-700 dark:text-violet-300"
                      : "text-amber-700 dark:text-amber-300",
                  ].join(" ")}
                >
                  {summary.positiveMonths} of{" "}
                  {chartData.length}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="mt-6 h-[340px] min-w-0">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={chartData}
                  barGap={5}
                  barCategoryGap="25%"
                  margin={{
                    top: 10,
                    right: 8,
                    left: -12,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="incomeBarGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#10b981"
                        stopOpacity={1}
                      />

                      <stop
                        offset="100%"
                        stopColor="#14b8a6"
                        stopOpacity={0.75}
                      />
                    </linearGradient>

                    <linearGradient
                      id="expenseBarGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#f43f5e"
                        stopOpacity={1}
                      />

                      <stop
                        offset="100%"
                        stopColor="#ef4444"
                        stopOpacity={0.75}
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
                    minTickGap={15}
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
                    strokeOpacity={0.35}
                  />

                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{
                      fill: "#94a3b8",
                      fillOpacity: 0.08,
                      radius: 12,
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    content={<CustomLegend />}
                  />

                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="url(#incomeBarGradient)"
                    radius={[8, 8, 2, 2]}
                    maxBarSize={34}
                    animationDuration={800}
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={`income-${entry.month}`}
                        fill="url(#incomeBarGradient)"
                      />
                    ))}
                  </Bar>

                  <Bar
                    dataKey="expense"
                    name="Expenses"
                    fill="url(#expenseBarGradient)"
                    radius={[8, 8, 2, 2]}
                    maxBarSize={34}
                    animationDuration={900}
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={`expense-${entry.month}`}
                        fill="url(#expenseBarGradient)"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Peak values */}
            <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Highest monthly income:{" "}
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(
                    highestIncome
                  )}
                </strong>
              </span>

              <span>
                Highest monthly expense:{" "}
                <strong className="text-rose-600 dark:text-rose-400">
                  {formatCurrency(
                    highestExpense
                  )}
                </strong>
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default IncomeExpenseChart;