import { motion } from "framer-motion";

import {
  CalendarDays,
  CircleDollarSign,
  ReceiptText,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import useFinance from "../../hooks/useFinance";

function getSafeAmount(value) {
  const amount = Number(value);

  return Number.isFinite(amount)
    ? amount
    : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(getSafeAmount(value));
}

function isSameDay(firstDate, secondDate) {
  return (
    firstDate.getFullYear() ===
      secondDate.getFullYear() &&
    firstDate.getMonth() ===
      secondDate.getMonth() &&
    firstDate.getDate() ===
      secondDate.getDate()
  );
}

function AnalyticsCards() {
  const {
    transactions = [],
    loading,
    error,
  } = useFinance();

  const today = new Date();

  const normalizedTransactions =
    transactions.map((transaction) => ({
      ...transaction,
      amount: getSafeAmount(
        transaction.amount
      ),
      type: String(
        transaction.type || ""
      )
        .trim()
        .toLowerCase(),
      parsedDate: new Date(
        transaction.date ||
          transaction.createdAt ||
          transaction.created_at ||
          0
      ),
    }));

  const totalTransactions =
    normalizedTransactions.length;

  const highestIncome =
    normalizedTransactions
      .filter(
        (transaction) =>
          transaction.type === "income"
      )
      .reduce(
        (highest, transaction) =>
          Math.max(
            highest,
            transaction.amount
          ),
        0
      );

  const highestExpense =
    normalizedTransactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .reduce(
        (highest, transaction) =>
          Math.max(
            highest,
            transaction.amount
          ),
        0
      );

  const monthlyIncome =
    normalizedTransactions
      .filter(
        (transaction) =>
          transaction.type === "income" &&
          !Number.isNaN(
            transaction.parsedDate.getTime()
          ) &&
          transaction.parsedDate.getMonth() ===
            today.getMonth() &&
          transaction.parsedDate.getFullYear() ===
            today.getFullYear()
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );

  const monthlyExpense =
    normalizedTransactions
      .filter(
        (transaction) =>
          transaction.type ===
            "expense" &&
          !Number.isNaN(
            transaction.parsedDate.getTime()
          ) &&
          transaction.parsedDate.getMonth() ===
            today.getMonth() &&
          transaction.parsedDate.getFullYear() ===
            today.getFullYear()
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );

  const monthlyNet =
    monthlyIncome - monthlyExpense;

  const todayTransactions =
    normalizedTransactions.filter(
      (transaction) =>
        !Number.isNaN(
          transaction.parsedDate.getTime()
        ) &&
        isSameDay(
          transaction.parsedDate,
          today
        )
    ).length;

  const analytics = [
    {
      id: "transactions",
      title: "Total Transactions",
      value: totalTransactions.toLocaleString(
        "en-IN"
      ),
      description: `${todayTransactions} ${
        todayTransactions === 1
          ? "record"
          : "records"
      } today`,
      icon: ReceiptText,
      accent:
        "text-cyan-600 dark:text-cyan-400",
      iconBox:
        "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      glow: "bg-cyan-500/20",
      progress:
        Math.min(
          totalTransactions * 4,
          100
        ),
    },
    {
      id: "highest-income",
      title: "Highest Income",
      value: formatCurrency(
        highestIncome
      ),
      description:
        "Largest income transaction",
      icon: TrendingUp,
      accent:
        "text-emerald-600 dark:text-emerald-400",
      iconBox:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      glow: "bg-emerald-500/20",
      progress:
        highestIncome > 0 ? 100 : 0,
    },
    {
      id: "highest-expense",
      title: "Highest Expense",
      value: formatCurrency(
        highestExpense
      ),
      description:
        "Largest expense transaction",
      icon: TrendingDown,
      accent:
        "text-red-600 dark:text-red-400",
      iconBox:
        "bg-red-500/10 text-red-600 dark:text-red-400",
      glow: "bg-red-500/20",
      progress:
        highestExpense > 0 ? 100 : 0,
    },
    {
      id: "monthly-net",
      title: "Monthly Net",
      value: formatCurrency(
        monthlyNet
      ),
      description:
        monthlyNet >= 0
          ? "Positive this month"
          : "Expenses exceed income",
      icon:
        monthlyNet >= 0
          ? CircleDollarSign
          : CalendarDays,
      accent:
        monthlyNet >= 0
          ? "text-violet-600 dark:text-violet-400"
          : "text-amber-600 dark:text-amber-400",
      iconBox:
        monthlyNet >= 0
          ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
          : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      glow:
        monthlyNet >= 0
          ? "bg-violet-500/20"
          : "bg-amber-500/20",
      progress:
        monthlyIncome > 0
          ? Math.min(
              Math.max(
                (monthlyNet /
                  monthlyIncome) *
                  100,
                0
              ),
              100
            )
          : 0,
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-4">
        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="
                h-48
                animate-pulse
                rounded-3xl
                border
                border-slate-200
                bg-slate-100
                dark:border-slate-800
                dark:bg-slate-900
              "
            />
          )
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-red-200
          bg-red-50
          px-5
          py-4
          text-sm
          text-red-600
          dark:border-red-900
          dark:bg-red-950/30
          dark:text-red-400
        "
      >
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-4">
      {analytics.map(
        (item, index) => {
          const Icon = item.icon;

          return (
            <motion.article
              key={item.id}
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay:
                  index * 0.08,
              }}
              whileHover={{
                y: -4,
              }}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-slate-200/80
                bg-white
                p-6
                shadow-sm
                transition-shadow
                hover:shadow-xl
                dark:border-slate-800
                dark:bg-slate-900
                dark:hover:shadow-black/20
              "
            >
              <div
                className={`
                  pointer-events-none
                  absolute
                  -right-14
                  -top-14
                  h-36
                  w-36
                  rounded-full
                  opacity-60
                  blur-3xl
                  transition
                  group-hover:opacity-100
                  ${item.glow}
                `}
              />

              <div className="relative">
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-600
                        dark:text-slate-300
                      "
                    >
                      {item.title}
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-400
                        dark:text-slate-500
                      "
                    >
                      {item.description}
                    </p>
                  </div>

                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      ${item.iconBox}
                    `}
                  >
                    <Icon size={23} />
                  </div>
                </div>

                <h3
                  className={`
                    mt-7
                    break-words
                    text-3xl
                    font-black
                    tracking-tight
                    ${item.accent}
                  `}
                >
                  {item.value}
                </h3>

                <div className="mt-6">
                  <div
                    className="
                      mb-2
                      flex
                      items-center
                      justify-between
                      text-xs
                      text-slate-400
                    "
                  >
                    <span>
                      Financial activity
                    </span>

                    <span>
                      {Math.round(
                        item.progress
                      )}
                      %
                    </span>
                  </div>

                  <div
                    className="
                      h-2
                      overflow-hidden
                      rounded-full
                      bg-slate-100
                      dark:bg-slate-800
                    "
                  >
                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${item.progress}%`,
                      }}
                      transition={{
                        duration: 0.8,
                        delay:
                          0.15 +
                          index * 0.08,
                      }}
                      className={`
                        h-full
                        rounded-full
                        ${
                          item.id ===
                          "transactions"
                            ? "bg-cyan-500"
                            : item.id ===
                              "highest-income"
                            ? "bg-emerald-500"
                            : item.id ===
                              "highest-expense"
                            ? "bg-red-500"
                            : monthlyNet >= 0
                            ? "bg-violet-500"
                            : "bg-amber-500"
                        }
                      `}
                    />
                  </div>
                </div>
              </div>
            </motion.article>
          );
        }
      )}
    </div>
  );
}

export default AnalyticsCards;