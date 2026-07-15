import { useMemo } from "react";

import {
  Crown,
  Medal,
  ReceiptText,
  Tags,
  TrendingDown,
} from "lucide-react";

import EmptyState from "../common/EmptyState";

/* =========================================================
   COLORS
========================================================= */

const CATEGORY_COLORS = [
  "#f43f5e",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ec4899",
  "#f97316",
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

/* =========================================================
   COMPONENT
========================================================= */

function TopCategories({
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
          normalizeCategory(
            transaction?.category
          );

        if (!categoryMap.has(category)) {
          categoryMap.set(category, {
            category,
            amount: 0,
            count: 0,
          });
        }

        const item =
          categoryMap.get(category);

        item.amount += amount;
        item.count += 1;
      }
    );

    const categories = Array.from(
      categoryMap.values()
    ).sort(
      (first, second) =>
        second.amount -
        first.amount
    );

    const totalExpense =
      categories.reduce(
        (total, item) =>
          total + item.amount,
        0
      );

    return {
      categories: categories
        .slice(0, 8)
        .map((item, index) => ({
          ...item,

          percentage:
            totalExpense > 0
              ? (
                  item.amount /
                  totalExpense
                ) * 100
              : 0,

          color:
            CATEGORY_COLORS[
              index %
                CATEGORY_COLORS.length
            ],
        })),

      totalExpense,

      averageCategory:
        categories.length > 0
          ? totalExpense /
            categories.length
          : 0,

      categoryCount:
        categories.length,
    };
  }, [safeTransactions]);

  const {
    categories,
    totalExpense,
    averageCategory,
    categoryCount,
  } = analytics;

  const topCategory =
    categories[0] || null;

  return (
    <section className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Medal size={21} />
            </div>

            <div className="min-w-0">
              <h2 className="section-title">
                Top Expense Categories
              </h2>

              <p className="section-description">
                Categories ranked by total
                spending during the selected
                period.
              </p>
            </div>
          </div>

          {topCategory && (
            <div className="w-fit rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-2">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <Crown size={13} />

                <p className="text-[10px] font-bold uppercase tracking-wider">
                  Highest spending
                </p>
              </div>

              <p className="mt-1 max-w-[150px] truncate text-sm font-black text-amber-700 dark:text-amber-300">
                {topCategory.category}
              </p>
            </div>
          )}
        </div>

        {categories.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="No expense categories"
            description="Add categorized expense transactions to view your spending rankings."
            className="min-h-[380px]"
          />
        ) : (
          <>
            {/* Summary */}
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
                  <TrendingDown size={15} />

                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Average
                  </p>
                </div>

                <p className="mt-2 truncate text-sm font-black text-blue-700 dark:text-blue-300">
                  {formatCurrency(
                    averageCategory
                  )}
                </p>
              </div>
            </div>

            {/* Category ranking */}
            <div className="mt-6 space-y-3">
              {categories.map(
                (item, index) => (
                  <article
                    key={item.category}
                    className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-slate-300 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-950/30 dark:hover:border-slate-700 dark:hover:bg-slate-950/60"
                  >
                    <div className="flex items-start gap-3">
                      {/* Rank */}
                      <div
                        className={[
                          "flex size-10 shrink-0",
                          "items-center justify-center",
                          "rounded-xl text-sm",
                          "font-black",
                          index === 0
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : index === 1
                              ? "bg-slate-400/15 text-slate-600 dark:text-slate-300"
                              : index === 2
                                ? "bg-orange-500/15 text-orange-600 dark:text-orange-400"
                                : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                        ].join(" ")}
                      >
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className="size-2.5 shrink-0 rounded-full"
                                style={{
                                  backgroundColor:
                                    item.color,
                                }}
                              />

                              <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                                {item.category}
                              </h3>
                            </div>

                            <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                              {item.count}{" "}
                              {item.count === 1
                                ? "transaction"
                                : "transactions"}
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-sm font-black text-slate-900 dark:text-white">
                              {formatCurrency(
                                item.amount
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

                        {/* Progress */}
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
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
                    </div>
                  </article>
                )
              )}
            </div>

            {/* Insight */}
            {topCategory && (
              <div className="mt-5 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
                <p className="text-xs leading-5 text-violet-700 dark:text-violet-300">
                  <strong>
                    {topCategory.category}
                  </strong>{" "}
                  represents{" "}
                  <strong>
                    {topCategory.percentage.toFixed(
                      1
                    )}
                    %
                  </strong>{" "}
                  of your total expenses. Reducing
                  spending in this category could
                  have the greatest impact.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default TopCategories;