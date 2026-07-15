import { useMemo } from "react";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  PieChart as PieChartIcon,
  ReceiptText,
  Tags,
  TrendingUp,
} from "lucide-react";

import EmptyState from "../common/EmptyState";

/* =========================================================
   COLORS
========================================================= */

const CATEGORY_COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#f43f5e",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

/* =========================================================
   HELPERS
========================================================= */

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? Math.abs(number)
    : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatCategory(value) {
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

function shortenLabel(value, limit = 14) {
  const label = String(value || "");

  if (label.length <= limit) {
    return label;
  }

  return `${label.slice(0, limit)}…`;
}

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

function ExpenseTooltip({
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

  return (
    <div className="min-w-[190px] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95">
      <div className="flex items-center gap-2">
        <span
          className="size-3 rounded-full"
          style={{
            backgroundColor:
              data.color,
          }}
        />

        <p className="text-sm font-black text-slate-900 dark:text-white">
          {data.name}
        </p>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Amount
          </span>

          <span className="text-xs font-black text-rose-600 dark:text-rose-400">
            {formatCurrency(data.value)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-6">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Share
          </span>

          <span className="text-xs font-black text-violet-600 dark:text-violet-400">
            {Number(
              data.percentage || 0
            ).toFixed(1)}
            %
          </span>
        </div>

        <div className="flex items-center justify-between gap-6">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Transactions
          </span>

          <span className="text-xs font-black text-slate-900 dark:text-white">
            {data.count || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CENTER LABEL
========================================================= */

function CenterLabel({
  viewBox,
  totalExpense,
}) {
  const {
    cx = 0,
    cy = 0,
  } = viewBox || {};

  return (
    <g>
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#94a3b8"
        fontSize="11"
        fontWeight="700"
      >
        TOTAL SPENT
      </text>

      <text
        x={cx}
        y={cy + 15}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#0f172a"
        fontSize="16"
        fontWeight="900"
      >
        {formatCurrency(totalExpense)}
      </text>
    </g>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

function ExpensePieChart({
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

        if (type !== "expense") {
          return;
        }

        const amount = getSafeNumber(
          transaction?.amount
        );

        if (amount <= 0) {
          return;
        }

        const category =
          formatCategory(
            transaction?.category
          );

        if (!categoryMap.has(category)) {
          categoryMap.set(category, {
            name: category,
            value: 0,
            count: 0,
          });
        }

        const current =
          categoryMap.get(category);

        current.value += amount;
        current.count += 1;
      }
    );

    const sortedCategories =
      Array.from(
        categoryMap.values()
      ).sort(
        (first, second) =>
          second.value -
          first.value
      );

    const visibleCategories =
      sortedCategories.slice(0, 7);

    const remainingCategories =
      sortedCategories.slice(7);

    if (
      remainingCategories.length > 0
    ) {
      const other = remainingCategories.reduce(
        (result, item) => {
          result.value += item.value;
          result.count += item.count;

          return result;
        },
        {
          name: "Other",
          value: 0,
          count: 0,
        }
      );

      visibleCategories.push(other);
    }

    const totalExpense =
      sortedCategories.reduce(
        (total, item) =>
          total + item.value,
        0
      );

    const chartData =
      visibleCategories.map(
        (item, index) => ({
          ...item,

          percentage:
            totalExpense > 0
              ? (
                  item.value /
                  totalExpense
                ) * 100
              : 0,

          color:
            CATEGORY_COLORS[
              index %
                CATEGORY_COLORS.length
            ],
        })
      );

    return {
      chartData,
      totalExpense,
      categoryCount:
        sortedCategories.length,
      transactionCount:
        sortedCategories.reduce(
          (total, item) =>
            total + item.count,
          0
        ),
      topCategory:
        sortedCategories[0] || null,
    };
  }, [safeTransactions]);

  const {
    chartData,
    totalExpense,
    categoryCount,
    transactionCount,
    topCategory,
  } = analytics;

  return (
    <section className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <PieChartIcon
                size={21}
                strokeWidth={2}
              />
            </div>

            <div className="min-w-0">
              <h2 className="section-title">
                Expense Categories
              </h2>

              <p className="section-description">
                See which categories account
                for most of your spending.
              </p>
            </div>
          </div>

          {topCategory && (
            <div className="w-fit rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                Top category
              </p>

              <p className="mt-1 max-w-[150px] truncate text-sm font-black text-rose-700 dark:text-rose-300">
                {topCategory.name}
              </p>
            </div>
          )}
        </div>

        {chartData.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="No expense data"
            description="Add expense transactions to view your category spending breakdown."
            className="min-h-[360px]"
          />
        ) : (
          <>
            {/* Summary cards */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3.5">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <ReceiptText size={15} />

                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Total spent
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
                  <TrendingUp size={15} />

                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Transactions
                  </p>
                </div>

                <p className="mt-2 text-sm font-black text-blue-700 dark:text-blue-300">
                  {transactionCount}
                </p>
              </div>
            </div>

            {/* Chart and category legend */}
            <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(260px,0.9fr)_minmax(240px,1.1fr)] lg:items-center">
              {/* Donut chart */}
              <div className="h-[310px] min-w-0">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="57%"
                      outerRadius="82%"
                      paddingAngle={3}
                      cornerRadius={8}
                      stroke="none"
                      animationDuration={800}
                    >
                      {chartData.map(
                        (item) => (
                          <Cell
                            key={item.name}
                            fill={item.color}
                          />
                        )
                      )}

                      <CenterLabel
                        totalExpense={
                          totalExpense
                        }
                      />
                    </Pie>

                    <Tooltip
                      content={
                        <ExpenseTooltip />
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom legend */}
              <div className="min-w-0 space-y-3">
                {chartData.map(
                  (item, index) => (
                    <div
                      key={item.name}
                      className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/30 dark:hover:border-slate-700 dark:hover:bg-slate-950/60"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-900">
                            <span
                              className="size-3 rounded-full"
                              style={{
                                backgroundColor:
                                  item.color,
                              }}
                            />

                            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-slate-200 text-[9px] font-black text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                              {index + 1}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <p
                              className="truncate text-sm font-bold text-slate-900 dark:text-white"
                              title={item.name}
                            >
                              {shortenLabel(
                                item.name,
                                20
                              )}
                            </p>

                            <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                              {item.count}{" "}
                              {item.count === 1
                                ? "transaction"
                                : "transactions"}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-black text-slate-900 dark:text-white">
                            {formatCurrency(
                              item.value
                            )}
                          </p>

                          <p
                            className="mt-1 text-xs font-bold"
                            style={{
                              color:
                                item.color,
                            }}
                          >
                            {item.percentage.toFixed(
                              1
                            )}
                            %
                          </p>
                        </div>
                      </div>

                      {/* Category percentage bar */}
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full transition-[width] duration-700"
                          style={{
                            width: `${Math.min(
                              Math.max(
                                item.percentage,
                                0
                              ),
                              100
                            )}%`,

                            backgroundColor:
                              item.color,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Footer insight */}
            {topCategory && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/30">
                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">
                    {topCategory.name}
                  </strong>{" "}
                  is your largest expense
                  category at{" "}
                  <strong className="text-rose-600 dark:text-rose-400">
                    {(
                      (
                        topCategory.value /
                        totalExpense
                      ) * 100
                    ).toFixed(1)}
                    %
                  </strong>{" "}
                  of total spending.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ExpensePieChart;