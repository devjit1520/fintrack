import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Lightbulb,
  PiggyBank,
  Sparkles,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import useFinance from "../../hooks/useFinance";

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(getSafeNumber(value));
}

function parseTransactionDate(value) {
  if (!value) {
    return null;
  }

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

function getPercentageChange(
  currentValue,
  previousValue
) {
  const current =
    getSafeNumber(currentValue);

  const previous =
    getSafeNumber(previousValue);

  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return (
    ((current - previous) /
      previous) *
    100
  );
}

function getMonthTotals(
  transactions,
  year,
  month
) {
  return transactions.reduce(
    (totals, transaction) => {
      const date =
        parseTransactionDate(
          transaction.date ||
            transaction.createdAt ||
            transaction.created_at
        );

      if (
        !date ||
        date.getFullYear() !== year ||
        date.getMonth() !== month
      ) {
        return totals;
      }

      const type = String(
        transaction.type || ""
      )
        .trim()
        .toLowerCase();

      const amount =
        getSafeNumber(
          transaction.amount
        );

      if (type === "income") {
        totals.income += amount;
      }

      if (type === "expense") {
        totals.expense += amount;
      }

      return totals;
    },
    {
      income: 0,
      expense: 0,
    }
  );
}

function FinancialInsights() {
  const {
    transactions = [],
    loading,
    error,
  } = useFinance();

  const insightData = useMemo(() => {
    const today = new Date();

    const currentYear =
      today.getFullYear();

    const currentMonth =
      today.getMonth();

    const previousMonthDate =
      new Date(
        currentYear,
        currentMonth - 1,
        1
      );

    const currentTotals =
      getMonthTotals(
        transactions,
        currentYear,
        currentMonth
      );

    const previousTotals =
      getMonthTotals(
        transactions,
        previousMonthDate.getFullYear(),
        previousMonthDate.getMonth()
      );

    const currentBalance =
      currentTotals.income -
      currentTotals.expense;

    const savingsRate =
      currentTotals.income > 0
        ? (currentBalance /
            currentTotals.income) *
          100
        : 0;

    const expenseChange =
      getPercentageChange(
        currentTotals.expense,
        previousTotals.expense
      );

    const incomeChange =
      getPercentageChange(
        currentTotals.income,
        previousTotals.income
      );

    const categoryTotals = {};

    transactions.forEach(
      (transaction) => {
        const date =
          parseTransactionDate(
            transaction.date ||
              transaction.createdAt ||
              transaction.created_at
          );

        const type = String(
          transaction.type || ""
        )
          .trim()
          .toLowerCase();

        if (
          !date ||
          type !== "expense" ||
          date.getFullYear() !==
            currentYear ||
          date.getMonth() !==
            currentMonth
        ) {
          return;
        }

        const category =
          String(
            transaction.category ||
              "Other"
          ).trim() || "Other";

        categoryTotals[category] =
          (categoryTotals[category] ||
            0) +
          getSafeNumber(
            transaction.amount
          );
      }
    );

    const topCategory =
      Object.entries(
        categoryTotals
      ).sort(
        (first, second) =>
          second[1] - first[1]
      )[0];

    const topCategoryName =
      topCategory?.[0] || "No category";

    const topCategoryAmount =
      topCategory?.[1] || 0;

    const topCategoryPercentage =
      currentTotals.expense > 0
        ? (topCategoryAmount /
            currentTotals.expense) *
          100
        : 0;

    let healthScore = 50;

    if (savingsRate >= 30) {
      healthScore += 30;
    } else if (savingsRate >= 20) {
      healthScore += 22;
    } else if (savingsRate >= 10) {
      healthScore += 12;
    } else if (savingsRate < 0) {
      healthScore -= 25;
    }

    if (expenseChange <= 0) {
      healthScore += 15;
    } else if (expenseChange > 25) {
      healthScore -= 15;
    }

    if (
      currentTotals.income > 0 &&
      currentBalance >= 0
    ) {
      healthScore += 5;
    }

    healthScore = Math.min(
      Math.max(
        Math.round(healthScore),
        0
      ),
      100
    );

    const insights = [
      {
        id: "spending",
        title:
          expenseChange > 0
            ? "Spending increased"
            : expenseChange < 0
            ? "Spending decreased"
            : "Spending is stable",

        description:
          previousTotals.expense === 0
            ? `You spent ${formatCurrency(
                currentTotals.expense
              )} this month.`
            : expenseChange > 0
            ? `Expenses are ${Math.abs(
                Math.round(
                  expenseChange
                )
              )}% higher than last month.`
            : expenseChange < 0
            ? `Expenses are ${Math.abs(
                Math.round(
                  expenseChange
                )
              )}% lower than last month.`
            : "Your expenses are unchanged compared with last month.",

        value:
          previousTotals.expense === 0
            ? formatCurrency(
                currentTotals.expense
              )
            : `${
                expenseChange > 0
                  ? "+"
                  : ""
              }${Math.round(
                expenseChange
              )}%`,

        icon:
          expenseChange > 0
            ? TrendingUp
            : TrendingDown,

        tone:
          expenseChange > 0
            ? "danger"
            : "success",
      },

      {
        id: "savings",
        title: "Savings performance",

        description:
          currentTotals.income === 0
            ? "Add income transactions to calculate your savings rate."
            : savingsRate >= 20
            ? "You are maintaining a healthy monthly savings rate."
            : savingsRate >= 0
            ? "Try to save at least 20% of your monthly income."
            : "Your expenses are currently higher than your income.",

        value: `${
          Number.isFinite(
            savingsRate
          )
            ? Math.round(
                savingsRate
              )
            : 0
        }%`,

        icon: PiggyBank,

        tone:
          savingsRate >= 20
            ? "success"
            : savingsRate >= 0
            ? "warning"
            : "danger",
      },

      {
        id: "category",
        title: "Top expense category",

        description:
          topCategoryAmount > 0
            ? `${topCategoryName} represents ${Math.round(
                topCategoryPercentage
              )}% of this month's expenses.`
            : "Add expense transactions to identify your highest spending category.",

        value:
          topCategoryAmount > 0
            ? topCategoryName
            : "No data",

        icon: WalletCards,

        tone: "info",
      },

      {
        id: "income",
        title: "Income movement",

        description:
          previousTotals.income === 0
            ? `You recorded ${formatCurrency(
                currentTotals.income
              )} in income this month.`
            : incomeChange > 0
            ? `Income increased by ${Math.round(
                incomeChange
              )}% compared with last month.`
            : incomeChange < 0
            ? `Income decreased by ${Math.abs(
                Math.round(
                  incomeChange
                )
              )}% compared with last month.`
            : "Income is unchanged compared with last month.",

        value:
          previousTotals.income === 0
            ? formatCurrency(
                currentTotals.income
              )
            : `${
                incomeChange > 0
                  ? "+"
                  : ""
              }${Math.round(
                incomeChange
              )}%`,

        icon:
          incomeChange >= 0
            ? TrendingUp
            : TrendingDown,

        tone:
          incomeChange >= 0
            ? "success"
            : "warning",
      },
    ];

    return {
      currentTotals,
      currentBalance,
      savingsRate,
      healthScore,
      insights,
    };
  }, [transactions]);

  const {
    currentTotals,
    currentBalance,
    healthScore,
    insights,
  } = insightData;

  const toneStyles = {
    success: {
      container:
        "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20",

      icon:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

      value:
        "text-emerald-600 dark:text-emerald-400",
    },

    danger: {
      container:
        "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20",

      icon:
        "bg-red-500/10 text-red-600 dark:text-red-400",

      value:
        "text-red-600 dark:text-red-400",
    },

    warning: {
      container:
        "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20",

      icon:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400",

      value:
        "text-amber-600 dark:text-amber-400",
    },

    info: {
      container:
        "border-cyan-200 bg-cyan-50 dark:border-cyan-900 dark:bg-cyan-950/20",

      icon:
        "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",

      value:
        "text-cyan-600 dark:text-cyan-400",
    },
  };

  if (loading) {
    return (
      <section
        className="
          rounded-3xl
          border
          border-slate-200/80
          bg-white
          p-6
          shadow-sm
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <div className="animate-pulse">
          <div
            className="
              h-7
              w-52
              rounded-lg
              bg-slate-200
              dark:bg-slate-800
            "
          />

          <div
            className="
              mt-3
              h-4
              w-72
              rounded
              bg-slate-100
              dark:bg-slate-800/70
            "
          />

          <div
            className="
              mt-8
              h-40
              rounded-3xl
              bg-slate-100
              dark:bg-slate-800
            "
          />

          <div
            className="
              mt-6
              grid
              gap-4
              md:grid-cols-2
            "
          >
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="
                    h-40
                    rounded-2xl
                    bg-slate-100
                    dark:bg-slate-800
                  "
                />
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-200/80
        bg-white
        p-6
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-64
          w-64
          rounded-full
          bg-violet-500/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-28
          -left-20
          h-64
          w-64
          rounded-full
          bg-cyan-500/10
          blur-3xl
        "
      />

      <div className="relative">
        {/* Header */}

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-violet-500/10
                text-violet-600
                dark:text-violet-400
              "
            >
              <Sparkles size={23} />
            </div>

            <div>
              <h2
                className="
                  text-xl
                  font-black
                  tracking-tight
                  text-slate-950
                  dark:text-white
                  sm:text-2xl
                "
              >
                Financial Insights
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Smart observations based on
                your transaction activity.
              </p>
            </div>
          </div>

          <Link
            to="/analytics"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-semibold
              text-slate-700
              transition
              hover:border-violet-400
              hover:text-violet-600
              dark:border-slate-700
              dark:bg-slate-950/40
              dark:text-slate-200
              dark:hover:text-violet-400
            "
          >
            View analytics
            <ArrowRight size={16} />
          </Link>
        </div>

        {error && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
              dark:border-red-900
              dark:bg-red-950/30
              dark:text-red-400
            "
          >
            {error}
          </div>
        )}

        {!error &&
        transactions.length === 0 ? (
          <div
            className="
              mt-8
              flex
              min-h-80
              flex-col
              items-center
              justify-center
              rounded-3xl
              border
              border-dashed
              border-slate-300
              bg-slate-50/70
              px-6
              text-center
              dark:border-slate-700
              dark:bg-slate-950/30
            "
          >
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-violet-500/10
                text-violet-500
              "
            >
              <Lightbulb size={30} />
            </div>

            <h3
              className="
                mt-5
                text-lg
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              No insights available
            </h3>

            <p
              className="
                mt-2
                max-w-sm
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              Add income and expense
              transactions to generate
              financial observations.
            </p>

            <Link
              to="/transactions"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-violet-500
                px-5
                py-3
                font-semibold
                text-white
                transition
                hover:bg-violet-600
              "
            >
              Add transactions
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            {/* Financial health score */}

            <div
              className="
                mt-8
                grid
                gap-6
                rounded-3xl
                border
                border-slate-200
                bg-gradient-to-br
                from-slate-50
                via-white
                to-violet-50/60
                p-5
                dark:border-slate-800
                dark:from-slate-950/70
                dark:via-slate-950/40
                dark:to-violet-950/20
                sm:p-6
                lg:grid-cols-[180px_minmax(0,1fr)]
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-center
                "
              >
                <div
                  className="
                    relative
                    flex
                    h-40
                    w-40
                    items-center
                    justify-center
                    rounded-full
                  "
                  style={{
                    background: `conic-gradient(
                      ${
                        healthScore >= 75
                          ? "#10b981"
                          : healthScore >= 50
                          ? "#f59e0b"
                          : "#ef4444"
                      }
                      ${
                        healthScore * 3.6
                      }deg,
                      rgba(148,163,184,0.16)
                      0deg
                    )`,
                  }}
                >
                  <div
                    className="
                      flex
                      h-32
                      w-32
                      flex-col
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      dark:bg-slate-900
                    "
                  >
                    <span
                      className="
                        text-4xl
                        font-black
                        text-slate-950
                        dark:text-white
                      "
                    >
                      {healthScore}
                    </span>

                    <span
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      out of 100
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="
                  flex
                  flex-col
                  justify-center
                "
              >
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-3
                  "
                >
                  <h3
                    className="
                      text-2xl
                      font-black
                      text-slate-950
                      dark:text-white
                    "
                  >
                    Financial health score
                  </h3>

                  <span
                    className={`
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      ${
                        healthScore >= 75
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : healthScore >= 50
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }
                    `}
                  >
                    {healthScore >= 75 ? (
                      <BadgeCheck
                        size={14}
                      />
                    ) : (
                      <AlertTriangle
                        size={14}
                      />
                    )}

                    {healthScore >= 75
                      ? "Healthy"
                      : healthScore >= 50
                      ? "Needs attention"
                      : "At risk"}
                  </span>
                </div>

                <p
                  className="
                    mt-3
                    max-w-2xl
                    text-sm
                    leading-6
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {healthScore >= 75
                    ? "Your income, spending, and savings activity indicate strong financial progress."
                    : healthScore >= 50
                    ? "Your finances are stable, but reducing expenses or increasing savings can improve your score."
                    : "Expenses are placing pressure on your current income. Review non-essential spending first."}
                </p>

                <div
                  className="
                    mt-5
                    grid
                    gap-3
                    sm:grid-cols-3
                  "
                >
                  <div
                    className="
                      rounded-xl
                      bg-white/70
                      px-4
                      py-3
                      dark:bg-slate-900/50
                    "
                  >
                    <p className="text-xs text-slate-500">
                      Income
                    </p>

                    <p
                      className="
                        mt-1
                        font-black
                        text-emerald-600
                        dark:text-emerald-400
                      "
                    >
                      {formatCurrency(
                        currentTotals.income
                      )}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-xl
                      bg-white/70
                      px-4
                      py-3
                      dark:bg-slate-900/50
                    "
                  >
                    <p className="text-xs text-slate-500">
                      Expenses
                    </p>

                    <p
                      className="
                        mt-1
                        font-black
                        text-red-600
                        dark:text-red-400
                      "
                    >
                      {formatCurrency(
                        currentTotals.expense
                      )}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-xl
                      bg-white/70
                      px-4
                      py-3
                      dark:bg-slate-900/50
                    "
                  >
                    <p className="text-xs text-slate-500">
                      Balance
                    </p>

                    <p
                      className={`
                        mt-1
                        font-black
                        ${
                          currentBalance >= 0
                            ? "text-cyan-600 dark:text-cyan-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      `}
                    >
                      {formatCurrency(
                        currentBalance
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Insight cards */}

            <div
              className="
                mt-6
                grid
                gap-4
                md:grid-cols-2
              "
            >
              {insights.map(
                (insight, index) => {
                  const InsightIcon =
                    insight.icon;

                  const styles =
                    toneStyles[
                      insight.tone
                    ] ||
                    toneStyles.info;

                  return (
                    <motion.article
                      key={insight.id}
                      initial={{
                        opacity: 0,
                        y: 14,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.08,
                      }}
                      whileHover={{
                        y: -3,
                      }}
                      className={`
                        rounded-2xl
                        border
                        p-5
                        transition
                        ${styles.container}
                      `}
                    >
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-4
                        "
                      >
                        <div
                          className={`
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            ${styles.icon}
                          `}
                        >
                          <InsightIcon
                            size={21}
                          />
                        </div>

                        <p
                          className={`
                            text-lg
                            font-black
                            ${styles.value}
                          `}
                        >
                          {insight.value}
                        </p>
                      </div>

                      <h3
                        className="
                          mt-5
                          font-bold
                          text-slate-900
                          dark:text-white
                        "
                      >
                        {insight.title}
                      </h3>

                      <p
                        className="
                          mt-2
                          text-sm
                          leading-6
                          text-slate-600
                          dark:text-slate-400
                        "
                      >
                        {insight.description}
                      </p>
                    </motion.article>
                  );
                }
              )}
            </div>

            {/* Recommendation */}

            <div
              className="
                mt-6
                flex
                flex-col
                gap-4
                rounded-2xl
                border
                border-violet-200
                bg-violet-50
                p-5
                dark:border-violet-900
                dark:bg-violet-950/20
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-violet-500/10
                    text-violet-500
                  "
                >
                  <Lightbulb size={21} />
                </div>

                <div>
                  <p
                    className="
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    Recommended next step
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      leading-6
                      text-slate-600
                      dark:text-slate-400
                    "
                  >
                    {currentTotals.income ===
                    0
                      ? "Record your income to receive a complete savings recommendation."
                      : currentBalance < 0
                      ? "Review your largest expense category and reduce optional spending."
                      : currentBalance <
                        currentTotals.income *
                          0.2
                      ? "Try moving at least 20% of your income into savings."
                      : "Your current balance is healthy. Consider assigning the surplus to a savings goal."}
                  </p>
                </div>
              </div>

              <Link
                to="/analytics"
                className="
                  inline-flex
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-violet-500
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-violet-600
                "
              >
                Explore data
                <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default FinancialInsights;