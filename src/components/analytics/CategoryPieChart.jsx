import { useMemo } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  BarChart3,
  CircleDollarSign,
  ReceiptText,
  Tags,
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

function normalizeCategory(value) {
  const category = String(
    value || "Other"
  ).trim();

  if (!category) {
    return "Other";
  }

  return category
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
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

function shortenLabel(value, limit = 15) {
  const label = String(value || "");

  return label.length > limit
    ? `${label.slice(0, limit)}…`
    : label;
}

/* =========================================================
   TOOLTIP
========================================================= */

function CategoryTooltip({
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

  const income =
    Number(data.income) || 0;

  const expense =
    Number(data.expense) || 0;

  const balance =
    income - expense;

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
              Net category balance
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
              Transactions
            </span>

            <span className="text-xs font-black text-slate-900 dark:text-white">
              {data.count || 0}
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

function CategoryLegend({
  payload = [],
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-5">
      {payload.map((entry) => (
        <div
          key={entry.value}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
        >
          <span
            className="size-2.5 rounded-full"
            style={{
              backgroundColor: entry.color,
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

function CategoryPieChart({
  transactions = [],
}) {
  const safeTransactions =
    Array.isArray(transactions)
      ? transactions
      : [];

  const analytics = useMemo(() => {
    const categoryMap = new Map();

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

        const category =
          normalizeCategory(
            transaction?.category
          );

        if (!categoryMap.has(category)) {
          categoryMap.set(category, {
            category,
            income: 0,
            expense: 0,
            count: 0,
          });
        }

        const item =
          categoryMap.get(category);

        item[type] += amount;
        item.count += 1;
      }
    );

    const categories = Array.from(
      categoryMap.values()
    )
      .map((item) => ({
        ...item,
        total:
          item.income +
          item.expense,
        balance:
          item.income -
          item.expense,
      }))
      .sort(
        (first, second) =>
          second.total -
          first.total
      );

    const visibleCategories =
      categories.slice(0, 8);

    const totals =
      visibleCategories.reduce(
        (result, item) => {
          result.income += item.income;
          result.expense += item.expense;
          result.transactions +=
            item.count;

          return result;
        },
        {
          income: 0,
          expense: 0,
          transactions: 0,
        }
      );

    return {
      categories:
        visibleCategories,
      totalIncome: totals.income,
      totalExpense: totals.expense,
      transactionCount:
        totals.transactions,
      categoryCount:
        categories.length,
    };
  }, [safeTransactions]);

  const {
    categories,
    totalIncome,
    totalExpense,
    transactionCount,
    categoryCount,
  } = analytics;

  const overallBalance =
    totalIncome - totalExpense;

  return (
    <section className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <BarChart3 size={21} />
            </div>

            <div className="min-w-0">
              <h2 className="section-title">
                Category Comparison
              </h2>

              <p className="section-description">
                Compare income and expenses
                across your most active
                categories.
              </p>
            </div>
          </div>

          {categories.length > 0 && (
            <div
              className={[
                "w-fit rounded-2xl border",
                "px-4 py-2",
                overallBalance >= 0
                  ? "border-blue-500/20 bg-blue-500/10"
                  : "border-rose-500/20 bg-rose-500/10",
              ].join(" ")}
            >
              <p
                className={[
                  "text-[10px] font-bold uppercase tracking-wider",
                  overallBalance >= 0
                    ? "text-blue-500"
                    : "text-rose-500",
                ].join(" ")}
              >
                Category balance
              </p>

              <p
                className={[
                  "mt-1 text-sm font-black",
                  overallBalance >= 0
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-rose-700 dark:text-rose-300",
                ].join(" ")}
              >
                {formatCurrency(
                  overallBalance
                )}
              </p>
            </div>
          )}
        </div>

        {categories.length === 0 ? (
          <EmptyState
            icon={Tags}
            title="No category data"
            description="Add categorized income and expense transactions to compare financial activity."
            className="min-h-[380px]"
          />
        ) : (
          <>
            {/* Summary */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CircleDollarSign size={15} />

                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Income
                  </p>
                </div>

                <p className="mt-2 truncate text-sm font-black text-emerald-700 dark:text-emerald-300">
                  {formatCurrency(
                    totalIncome
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3.5">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <ReceiptText size={15} />

                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Expenses
                  </p>
                </div>

                <p className="mt-2 truncate text-sm font-black text-rose-700 dark:text-rose-300">
                  {formatCurrency(
                    totalExpense
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3.5">
                <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                  <Tags size={15} />

                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Categories
                  </p>
                </div>

                <p className="mt-2 text-sm font-black text-violet-700 dark:text-violet-300">
                  {categoryCount}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-3.5">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <BarChart3 size={15} />

                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Transactions
                  </p>
                </div>

                <p className="mt-2 text-sm font-black text-blue-700 dark:text-blue-300">
                  {transactionCount}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="mt-6 h-[420px] min-w-0">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={categories}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 15,
                    left: 10,
                    bottom: 5,
                  }}
                  barGap={4}
                  barCategoryGap="22%"
                >
                  <defs>
                    <linearGradient
                      id="categoryIncomeGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop
                        offset="0%"
                        stopColor="#10b981"
                      />

                      <stop
                        offset="100%"
                        stopColor="#14b8a6"
                      />
                    </linearGradient>

                    <linearGradient
                      id="categoryExpenseGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop
                        offset="0%"
                        stopColor="#f43f5e"
                      />

                      <stop
                        offset="100%"
                        stopColor="#ef4444"
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="4 4"
                    horizontal={false}
                    stroke="#94a3b8"
                    strokeOpacity={0.18}
                  />

                  <XAxis
                    type="number"
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
                  />

                  <YAxis
                    type="category"
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    width={105}
                    tickFormatter={(value) =>
                      shortenLabel(value)
                    }
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  />

                  <Tooltip
                    content={
                      <CategoryTooltip />
                    }
                    cursor={{
                      fill: "#94a3b8",
                      fillOpacity: 0.07,
                      radius: 10,
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    content={
                      <CategoryLegend />
                    }
                  />

                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="url(#categoryIncomeGradient)"
                    radius={[0, 8, 8, 0]}
                    maxBarSize={22}
                    animationDuration={800}
                  />

                  <Bar
                    dataKey="expense"
                    name="Expenses"
                    fill="url(#categoryExpenseGradient)"
                    radius={[0, 8, 8, 0]}
                    maxBarSize={22}
                    animationDuration={900}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default CategoryPieChart;