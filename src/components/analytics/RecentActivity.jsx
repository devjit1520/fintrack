import { useMemo } from "react";
import { motion } from "framer-motion";

import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  History,
  ReceiptText,
  Sparkles,
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

  const dateText = String(value).slice(0, 10);
  const parts = dateText.split("-").map(Number);

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

    return Number.isNaN(parsedDate.getTime())
      ? null
      : parsedDate;
  }

  const fallbackDate = new Date(value);

  return Number.isNaN(fallbackDate.getTime())
    ? null
    : fallbackDate;
}

function isSameCalendarDay(firstDate, secondDate) {
  return (
    firstDate.getFullYear() ===
      secondDate.getFullYear() &&
    firstDate.getMonth() ===
      secondDate.getMonth() &&
    firstDate.getDate() ===
      secondDate.getDate()
  );
}

function getRelativeDateLabel(date) {
  if (!date) {
    return "Unknown date";
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const transactionDay = new Date(date);

  transactionDay.setHours(0, 0, 0, 0);

  const difference =
    today.getTime() -
    transactionDay.getTime();

  const differenceInDays = Math.round(
    difference / 86400000
  );

  if (differenceInDays === 0) {
    return "Today";
  }

  if (differenceInDays === 1) {
    return "Yesterday";
  }

  if (
    differenceInDays > 1 &&
    differenceInDays < 7
  ) {
    return `${differenceInDays} days ago`;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year:
      date.getFullYear() !==
      today.getFullYear()
        ? "numeric"
        : undefined,
  }).format(date);
}

function formatTransactionTime(date) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatFullDate(date) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/* =========================================================
   RANGE LABEL
========================================================= */

function getRangeLabel(
  range,
  startDate,
  endDate
) {
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
}

/* =========================================================
   SUMMARY ITEM
========================================================= */

function SummaryItem({
  icon: Icon,
  label,
  value,
  type = "neutral",
}) {
  const styleMap = {
    income: {
      icon:
        "bg-emerald-500/10 text-emerald-500",
      value:
        "text-emerald-600 dark:text-emerald-400",
    },

    expense: {
      icon:
        "bg-rose-500/10 text-rose-500",
      value:
        "text-rose-600 dark:text-rose-400",
    },

    neutral: {
      icon:
        "bg-cyan-500/10 text-cyan-500",
      value:
        "text-slate-900 dark:text-white",
    },
  };

  const styles =
    styleMap[type] || styleMap.neutral;

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-white/[0.035]">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
      >
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p
          className={`mt-0.5 truncate text-sm font-bold ${styles.value}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   ACTIVITY ITEM
========================================================= */

function ActivityItem({
  transaction,
  index,
  isLast,
}) {
  const isIncome =
    transaction.type === "income";

  const Icon = isIncome
    ? ArrowDownLeft
    : ArrowUpRight;

  const iconStyles = isIncome
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
    : "border-rose-500/20 bg-rose-500/10 text-rose-500";

  const amountStyles = isIncome
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
      }}
      className="relative flex gap-4"
    >
      {/* Timeline */}

      <div className="relative flex shrink-0 flex-col items-center">
        <div
          className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl border ${iconStyles}`}
        >
          <Icon size={19} />
        </div>

        {!isLast && (
          <div className="absolute bottom-[-18px] top-11 w-px bg-slate-200 dark:bg-white/10" />
        )}
      </div>

      {/* Activity content */}

      <div
        className={`min-w-0 flex-1 pb-5 ${
          !isLast
            ? "border-b border-slate-200/80 dark:border-white/[0.07]"
            : ""
        }`}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {transaction.title}
              </h4>

              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
                  isIncome
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}
              >
                {transaction.type}
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <ReceiptText size={13} />

                {transaction.category}
              </span>

              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} />

                {getRelativeDateLabel(
                  transaction.parsedDate
                )}
              </span>

              {transaction.timeLabel && (
                <span className="flex items-center gap-1.5">
                  <Clock3 size={13} />

                  {transaction.timeLabel}
                </span>
              )}
            </div>

            {transaction.note && (
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {transaction.note}
              </p>
            )}
          </div>

          <div className="shrink-0 sm:text-right">
            <p
              className={`text-sm font-bold ${amountStyles}`}
            >
              {isIncome ? "+" : "-"}
              {formatCurrency(
                transaction.amount
              )}
            </p>

            <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
              {formatFullDate(
                transaction.parsedDate
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function RecentActivity({
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

  const transactions = Array.isArray(
    filteredTransactions
  )
    ? filteredTransactions
    : contextTransactions;

  const activityData = useMemo(() => {
    const normalizedTransactions = (
      Array.isArray(transactions)
        ? transactions
        : []
    )
      .map((transaction, index) => {
        const parsedDate =
          parseTransactionDate(
            transaction.date ||
              transaction.createdAt ||
              transaction.updatedAt
          );

        const type = String(
          transaction.type || ""
        ).toLowerCase();

        return {
          ...transaction,

          activityId:
            transaction.id ||
            `${transaction.title}-${index}`,

          title:
            transaction.title ||
            transaction.name ||
            (type === "income"
              ? "Income transaction"
              : "Expense transaction"),

          category:
            transaction.category ||
            "Other",

          note:
            transaction.note ||
            transaction.description ||
            "",

          type:
            type === "income"
              ? "income"
              : "expense",

          amount: Math.abs(
            Number(transaction.amount) || 0
          ),

          parsedDate,

          timestamp:
            parsedDate?.getTime() || 0,

          timeLabel:
            parsedDate
              ? formatTransactionTime(
                  parsedDate
                )
              : "",
        };
      })
      .filter(
        (transaction) =>
          transaction.amount > 0 &&
          transaction.parsedDate
      )
      .sort(
        (first, second) =>
          second.timestamp -
          first.timestamp
      );

    const totalIncome =
      normalizedTransactions
        .filter(
          (transaction) =>
            transaction.type === "income"
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0
        );

    const totalExpense =
      normalizedTransactions
        .filter(
          (transaction) =>
            transaction.type === "expense"
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0
        );

    const latestTransactions =
      normalizedTransactions.slice(0, 8);

    const newestDate =
      latestTransactions[0]
        ?.parsedDate || null;

    return {
      totalCount:
        normalizedTransactions.length,

      totalIncome,
      totalExpense,
      latestTransactions,
      newestDate,
    };
  }, [transactions]);

  const rangeLabel = getRangeLabel(
    range,
    startDate,
    endDate
  );

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {/* Background glow */}

        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative">
          {/* Header */}

          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-white/10 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-500">
                <History size={22} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Recent Activity
                  </h2>

                  <span className="flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-500">
                    <Sparkles size={11} />

                    Live
                  </span>
                </div>

                <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  Latest income and expense
                  activity from the selected
                  analytics period.
                </p>
              </div>
            </div>

            <div className="self-start rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
              {rangeLabel}
            </div>
          </div>

          {/* Activity summary */}

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <SummaryItem
              icon={WalletCards}
              label="Transactions"
              value={
                activityData.totalCount
              }
              type="neutral"
            />

            <SummaryItem
              icon={ArrowDownLeft}
              label="Income"
              value={formatCurrency(
                activityData.totalIncome
              )}
              type="income"
            />

            <SummaryItem
              icon={ArrowUpRight}
              label="Expenses"
              value={formatCurrency(
                activityData.totalExpense
              )}
              type="expense"
            />
          </div>

          {/* Activity timeline */}

          {activityData.latestTransactions
            .length > 0 ? (
            <div className="mt-6 space-y-5">
              {activityData.latestTransactions.map(
                (transaction, index) => (
                  <ActivityItem
                    key={
                      transaction.activityId
                    }
                    transaction={
                      transaction
                    }
                    index={index}
                    isLast={
                      index ===
                      activityData
                        .latestTransactions
                        .length -
                        1
                    }
                  />
                )
              )}

              {activityData.totalCount > 8 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-3 text-center dark:border-white/10 dark:bg-white/[0.025]">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Showing the latest{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      8
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {
                        activityData.totalCount
                      }
                    </span>{" "}
                    transactions.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Empty state */

            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center dark:border-white/10 dark:bg-white/[0.025]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200/70 text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">
                <ReceiptText size={26} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                No activity found
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                No transactions are available
                for the selected analytics
                period. Change the date range or
                add a new transaction.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default RecentActivity;