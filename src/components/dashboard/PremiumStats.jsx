import { useMemo } from "react";
import { motion } from "framer-motion";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Minus,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import useFinance from "../../hooks/useFinance";
import useProfile from "../../hooks/useProfile";

/* =========================================================
   NUMBER HELPERS
========================================================= */

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

/* =========================================================
   DATE HELPERS
========================================================= */

function getTransactionDate(transaction) {
  const value =
    transaction?.date ||
    transaction?.createdAt ||
    transaction?.created_at ||
    transaction?.updatedAt ||
    transaction?.updated_at;

  if (!value) {
    return null;
  }

  /*
   * Parse YYYY-MM-DD as a local date.
   * This prevents timezone changes from moving a transaction
   * into the previous day.
   */
  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    const [year, month, day] =
      value.split("-").map(Number);

    return new Date(
      year,
      month - 1,
      day
    );
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function getMonthLabel(date) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      month: "short",
    }
  ).format(date);
}

function getCurrentMonthLabel() {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  ).format(new Date());
}

/* =========================================================
   PERCENTAGE CHANGE
========================================================= */

function calculatePercentageChange(
  currentValue,
  previousValue
) {
  const current =
    getSafeNumber(currentValue);

  const previous =
    getSafeNumber(previousValue);

  if (
    current === 0 &&
    previous === 0
  ) {
    return 0;
  }

  if (previous === 0) {
    return current > 0
      ? 100
      : 0;
  }

  return Math.round(
    ((current - previous) /
      Math.abs(previous)) *
      100
  );
}

/* =========================================================
   CREATE SIX-MONTH SERIES
========================================================= */

function createMonthlySeries(
  transactions,
  monthCount = 6
) {
  const currentDate =
    new Date();

  const months = Array.from(
    {
      length: monthCount,
    },
    (_, index) => {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() -
          (monthCount - 1 - index),
        1
      );

      return {
        key: getMonthKey(date),
        date,
        label: getMonthLabel(date),
        income: 0,
        expense: 0,
        transactions: 0,
      };
    }
  );

  const monthMap =
    new Map(
      months.map((month) => [
        month.key,
        month,
      ])
    );

  transactions.forEach(
    (transaction) => {
      const transactionDate =
        getTransactionDate(
          transaction
        );

      if (!transactionDate) {
        return;
      }

      const month =
        monthMap.get(
          getMonthKey(
            transactionDate
          )
        );

      if (!month) {
        return;
      }

      const amount =
        getSafeNumber(
          transaction.amount
        );

      month.transactions += 1;

      if (
        transaction.type ===
        "income"
      ) {
        month.income += amount;
      }

      if (
        transaction.type ===
        "expense"
      ) {
        month.expense += amount;
      }
    }
  );

  return months.map((month) => {
    const net =
      month.income -
      month.expense;

    const savingsRate =
      month.income > 0
        ? Math.min(
            Math.max(
              Math.round(
                (Math.max(net, 0) /
                  month.income) *
                  100
              ),
              0
            ),
            100
          )
        : 0;

    return {
      ...month,
      net,
      savingsRate,
    };
  });
}

/* =========================================================
   TREND BADGE
========================================================= */

function TrendBadge({
  change,
  positiveIsGood = true,
}) {
  const value =
    getSafeNumber(change);

  const increased =
    value > 0;

  const decreased =
    value < 0;

  const favorable =
    positiveIsGood
      ? value > 0
      : value < 0;

  let Icon = Minus;

  if (increased) {
    Icon = ArrowUpRight;
  }

  if (decreased) {
    Icon = ArrowDownRight;
  }

  if (value === 0) {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1
          rounded-full
          bg-slate-500/10
          px-2.5
          py-1.5
          text-[10px]
          font-bold
          text-slate-500
          dark:text-slate-400
        "
      >
        <Minus size={12} />

        No change
      </span>
    );
  }

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1
        rounded-full
        px-2.5
        py-1.5
        text-[10px]
        font-bold
        ${
          favorable
            ? `
              bg-emerald-500/10
              text-emerald-600
              dark:text-emerald-400
            `
            : `
              bg-rose-500/10
              text-rose-600
              dark:text-rose-400
            `
        }
      `}
    >
      <Icon size={12} />

      {Math.abs(value)}%
    </span>
  );
}

/* =========================================================
   MONTHLY SUMMARY ITEM
========================================================= */

function MonthlySummaryItem({
  label,
  value,
  change,
  positiveIsGood,
  valueClasses,
}) {
  return (
    <div
      className="
        min-w-0
        rounded-2xl
        border
        border-slate-200/80
        bg-slate-50/80
        p-4
        dark:border-white/10
        dark:bg-white/[0.025]
      "
    >
      <p
        className="
          text-[10px]
          font-bold
          uppercase
          tracking-[0.13em]
          text-slate-500
          dark:text-slate-400
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-2
          truncate
          text-xl
          font-black
          sm:text-2xl
          ${valueClasses}
        `}
      >
        {value}
      </p>

      <div className="mt-3">
        <TrendBadge
          change={change}
          positiveIsGood={
            positiveIsGood
          }
        />
      </div>
    </div>
  );
}

/* =========================================================
   SIX-MONTH BAR CHART
========================================================= */

function CashFlowChart({
  monthlySeries,
  formatCurrency,
}) {
  const maximumValue =
    Math.max(
      ...monthlySeries.flatMap(
        (month) => [
          month.income,
          month.expense,
        ]
      ),
      1
    );

  return (
    <div
      className="
        mt-6
        overflow-x-auto
        pb-1
      "
    >
      <div className="min-w-[460px]">
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-sm
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Income versus expenses
            </p>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              Last six months
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-4
              text-[10px]
              font-semibold
              text-slate-500
              dark:text-slate-400
            "
          >
            <span
              className="
                inline-flex
                items-center
                gap-1.5
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-emerald-500
                "
              />

              Income
            </span>

            <span
              className="
                inline-flex
                items-center
                gap-1.5
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-rose-500
                "
              />

              Expense
            </span>
          </div>
        </div>

        <div
          className="
            mt-5
            grid
            grid-cols-6
            gap-3
          "
        >
          {monthlySeries.map(
            (month, monthIndex) => {
              const incomeHeight =
                month.income > 0
                  ? Math.max(
                      (month.income /
                        maximumValue) *
                        100,
                      6
                    )
                  : 2;

              const expenseHeight =
                month.expense > 0
                  ? Math.max(
                      (month.expense /
                        maximumValue) *
                        100,
                      6
                    )
                  : 2;

              return (
                <div
                  key={month.key}
                  className="min-w-0"
                >
                  <div
                    className="
                      flex
                      h-32
                      items-end
                      justify-center
                      gap-1.5
                      rounded-xl
                      border
                      border-slate-200/70
                      bg-slate-50/60
                      px-2
                      pt-3
                      dark:border-white/[0.06]
                      dark:bg-white/[0.02]
                    "
                  >
                    <motion.div
                      initial={{
                        height: 0,
                      }}
                      animate={{
                        height: `${incomeHeight}%`,
                      }}
                      transition={{
                        duration: 0.7,
                        delay:
                          monthIndex *
                          0.05,
                        ease: "easeOut",
                      }}
                      title={`Income: ${formatCurrency(
                        month.income
                      )}`}
                      className="
                        w-3
                        rounded-t-full
                        bg-gradient-to-t
                        from-emerald-600
                        to-emerald-400
                        shadow-sm
                        shadow-emerald-500/20
                      "
                    />

                    <motion.div
                      initial={{
                        height: 0,
                      }}
                      animate={{
                        height: `${expenseHeight}%`,
                      }}
                      transition={{
                        duration: 0.7,
                        delay:
                          0.08 +
                          monthIndex *
                            0.05,
                        ease: "easeOut",
                      }}
                      title={`Expense: ${formatCurrency(
                        month.expense
                      )}`}
                      className="
                        w-3
                        rounded-t-full
                        bg-gradient-to-t
                        from-rose-600
                        to-rose-400
                        shadow-sm
                        shadow-rose-500/20
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-2
                      text-center
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    {month.label}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COMPACT INSIGHT CARD
========================================================= */

function InsightCard({
  title,
  value,
  description,
  icon: Icon,
  iconClasses,
  glowClasses,
  delay = 0,
}) {
  return (
    <motion.article
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
        delay,
        ease: "easeOut",
      }}
      whileHover={{
        y: -3,
      }}
      className="
        group
        relative
        min-w-0
        overflow-hidden
        rounded-3xl
        border
        border-slate-200/80
        bg-white
        p-5
        shadow-sm
        transition
        duration-300
        hover:border-cyan-500/25
        hover:shadow-xl
        hover:shadow-slate-200/35
        dark:border-white/10
        dark:bg-[#0d172a]
        dark:hover:shadow-black/20
      "
    >
      <div
        className={`
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-28
          w-28
          rounded-full
          opacity-70
          blur-3xl
          ${glowClasses}
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
          <div className="min-w-0">
            <p
              className="
                text-xs
                font-bold
                text-slate-700
                dark:text-slate-200
              "
            >
              {title}
            </p>

            <p
              className="
                mt-1
                truncate
                text-[11px]
                text-slate-500
                dark:text-slate-400
              "
            >
              {description}
            </p>
          </div>

          <div
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${iconClasses}
            `}
          >
            <Icon size={18} />
          </div>
        </div>

        <p
          className="
            mt-7
            break-words
            text-2xl
            font-black
            tracking-tight
            text-slate-950
            dark:text-white
            sm:text-3xl
          "
        >
          {value}
        </p>

        <div
          className="
            mt-5
            h-1.5
            overflow-hidden
            rounded-full
            bg-slate-200
            dark:bg-slate-800
          "
        >
          <div
            className={`
              h-full
              w-2/3
              rounded-full
              ${glowClasses}
            `}
          />
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   PREMIUM STATS
========================================================= */

function PremiumStats() {
  const finance =
    useFinance() || {};

  const profileContext =
    useProfile() || {};

  const profile =
    profileContext.profile || {};

  const transactions =
    Array.isArray(
      finance.transactions
    )
      ? finance.transactions
      : [];

  const currency =
    profile.preferences?.currency ||
    "INR";

  const formatCurrency = (
    value
  ) => {
    try {
      return new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }
      ).format(
        getSafeNumber(value)
      );
    } catch {
      return `₹${getSafeNumber(
        value
      ).toLocaleString("en-IN")}`;
    }
  };

  /* =======================================================
     MONTHLY DATA
  ======================================================= */

  const monthlySeries =
    useMemo(
      () =>
        createMonthlySeries(
          transactions
        ),
      [transactions]
    );

  const currentMonth =
    monthlySeries[
      monthlySeries.length - 1
    ] || {
      income: 0,
      expense: 0,
      net: 0,
      savingsRate: 0,
      transactions: 0,
    };

  const previousMonth =
    monthlySeries[
      monthlySeries.length - 2
    ] || {
      income: 0,
      expense: 0,
      net: 0,
    };

  /* =======================================================
     CURRENT-MONTH TRANSACTIONS
  ======================================================= */

  const currentMonthTransactions =
    useMemo(() => {
      const now = new Date();

      return transactions.filter(
        (transaction) => {
          const date =
            getTransactionDate(
              transaction
            );

          return (
            date &&
            date.getFullYear() ===
              now.getFullYear() &&
            date.getMonth() ===
              now.getMonth()
          );
        }
      );
    }, [transactions]);

  const currentIncomeTransactions =
    currentMonthTransactions.filter(
      (transaction) =>
        transaction.type ===
        "income"
    );

  const currentExpenseTransactions =
    currentMonthTransactions.filter(
      (transaction) =>
        transaction.type ===
        "expense"
    );

  const highestIncome =
    currentIncomeTransactions.reduce(
      (highest, transaction) =>
        Math.max(
          highest,
          getSafeNumber(
            transaction.amount
          )
        ),
      0
    );

  const highestExpense =
    currentExpenseTransactions.reduce(
      (highest, transaction) =>
        Math.max(
          highest,
          getSafeNumber(
            transaction.amount
          )
        ),
      0
    );

  const averageExpense =
    currentExpenseTransactions.length >
    0
      ? currentMonth.expense /
        currentExpenseTransactions.length
      : 0;

  /* =======================================================
     MONTHLY CHANGES
  ======================================================= */

  const incomeChange =
    calculatePercentageChange(
      currentMonth.income,
      previousMonth.income
    );

  const expenseChange =
    calculatePercentageChange(
      currentMonth.expense,
      previousMonth.expense
    );

  const netChange =
    calculatePercentageChange(
      currentMonth.net,
      previousMonth.net
    );

  const spendingRatio =
    currentMonth.income > 0
      ? Math.min(
          Math.round(
            (currentMonth.expense /
              currentMonth.income) *
              100
          ),
          100
        )
      : currentMonth.expense > 0
        ? 100
        : 0;

  return (
    <section className="min-w-0">
      {/* Section heading */}

      <div
        className="
          mb-5
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.15em]
              text-cyan-600
              dark:text-cyan-400
            "
          >
            Financial performance
          </p>

          <h2
            className="
              mt-2
              text-xl
              font-black
              text-slate-950
              dark:text-white
              sm:text-2xl
            "
          >
            This month at a glance
          </h2>
        </div>

        <span
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-full
            border
            border-slate-200
            bg-white
            px-3.5
            py-2
            text-xs
            font-semibold
            text-slate-500
            dark:border-white/10
            dark:bg-white/[0.035]
            dark:text-slate-400
          "
        >
          <CalendarDays
            size={14}
            className="text-violet-500"
          />

          {getCurrentMonthLabel()}
        </span>
      </div>

      <div
        className="
          grid
          min-w-0
          gap-4
          xl:grid-cols-12
        "
      >
        {/* ===============================================
            LARGE MONTHLY CASH-FLOW CARD
        ================================================ */}

        <motion.article
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
          }}
          className="
            relative
            min-w-0
            overflow-hidden
            rounded-[30px]
            border
            border-slate-200/80
            bg-white
            p-5
            shadow-sm
            dark:border-white/10
            dark:bg-[#0d172a]
            sm:p-6
            xl:col-span-7
            2xl:col-span-8
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-60
              w-60
              rounded-full
              bg-cyan-500/10
              blur-[90px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-28
              left-1/3
              h-56
              w-56
              rounded-full
              bg-violet-500/10
              blur-[90px]
            "
          />

          <div className="relative">
            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-start
                sm:justify-between
              "
            >
              <div>
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-cyan-500/10
                      text-cyan-600
                      dark:text-cyan-400
                    "
                  >
                    <WalletCards
                      size={19}
                    />
                  </div>

                  <div>
                    <h3
                      className="
                        text-base
                        font-black
                        text-slate-950
                        dark:text-white
                      "
                    >
                      Monthly cash flow
                    </h3>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Compared with last month
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="
                  rounded-xl
                  bg-slate-100
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  text-slate-500
                  dark:bg-white/[0.05]
                  dark:text-slate-400
                "
              >
                Spending ratio{" "}
                <span
                  className="
                    font-black
                    text-slate-950
                    dark:text-white
                  "
                >
                  {spendingRatio}%
                </span>
              </div>
            </div>

            <div
              className="
                mt-6
                grid
                gap-3
                sm:grid-cols-3
              "
            >
              <MonthlySummaryItem
                label="Income"
                value={formatCurrency(
                  currentMonth.income
                )}
                change={
                  incomeChange
                }
                positiveIsGood
                valueClasses="
                  text-emerald-600
                  dark:text-emerald-400
                "
              />

              <MonthlySummaryItem
                label="Expenses"
                value={formatCurrency(
                  currentMonth.expense
                )}
                change={
                  expenseChange
                }
                positiveIsGood={
                  false
                }
                valueClasses="
                  text-rose-600
                  dark:text-rose-400
                "
              />

              <MonthlySummaryItem
                label="Net amount"
                value={formatCurrency(
                  currentMonth.net
                )}
                change={netChange}
                positiveIsGood
                valueClasses={
                  currentMonth.net >= 0
                    ? `
                      text-cyan-600
                      dark:text-cyan-400
                    `
                    : `
                      text-rose-600
                      dark:text-rose-400
                    `
                }
              />
            </div>

            <CashFlowChart
              monthlySeries={
                monthlySeries
              }
              formatCurrency={
                formatCurrency
              }
            />
          </div>
        </motion.article>

        {/* ===============================================
            COMPACT INSIGHT CARDS
        ================================================ */}

        <div
          className="
            grid
            min-w-0
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:col-span-5
            2xl:col-span-4
          "
        >
          <InsightCard
            title="Transactions"
            value={
              currentMonthTransactions.length
            }
            description="Recorded this month"
            icon={Activity}
            iconClasses="
              bg-cyan-500/10
              text-cyan-600
              dark:text-cyan-400
            "
            glowClasses="bg-cyan-500/20"
            delay={0.04}
          />

          <InsightCard
            title="Average Expense"
            value={formatCurrency(
              averageExpense
            )}
            description="Average spending value"
            icon={ReceiptText}
            iconClasses="
              bg-amber-500/10
              text-amber-600
              dark:text-amber-400
            "
            glowClasses="bg-amber-500/20"
            delay={0.08}
          />

          <InsightCard
            title="Highest Income"
            value={formatCurrency(
              highestIncome
            )}
            description="Largest monthly earning"
            icon={TrendingUp}
            iconClasses="
              bg-emerald-500/10
              text-emerald-600
              dark:text-emerald-400
            "
            glowClasses="bg-emerald-500/20"
            delay={0.12}
          />

          <InsightCard
            title="Highest Expense"
            value={formatCurrency(
              highestExpense
            )}
            description="Largest monthly spending"
            icon={TrendingDown}
            iconClasses="
              bg-rose-500/10
              text-rose-600
              dark:text-rose-400
            "
            glowClasses="bg-rose-500/20"
            delay={0.16}
          />
        </div>
      </div>
    </section>
  );
}

export default PremiumStats;