import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Activity,
  ArrowRight,
  CalendarDays,
  CircleAlert,
  Lightbulb,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Tags,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  WalletCards,
} from "lucide-react";

import useFinance from "../../hooks/useFinance";
import useProfile from "../../hooks/useProfile";

/* =========================================================
   BASIC HELPERS
========================================================= */

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

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
   * Parse yyyy-mm-dd as a local date.
   * This prevents timezone changes from moving the date
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

function isSameMonth(firstDate, secondDate) {
  return (
    firstDate.getFullYear() ===
      secondDate.getFullYear() &&
    firstDate.getMonth() ===
      secondDate.getMonth()
  );
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
   TONE DESIGN
========================================================= */

const toneDesign = {
  success: {
    iconContainer:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

    badge:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

    border:
      "hover:border-emerald-500/30",

    glow:
      "bg-emerald-500/15",

    progress:
      "from-emerald-400 to-teal-500",
  },

  warning: {
    iconContainer:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",

    badge:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",

    border:
      "hover:border-amber-500/30",

    glow:
      "bg-amber-500/15",

    progress:
      "from-amber-400 to-orange-500",
  },

  danger: {
    iconContainer:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400",

    badge:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400",

    border:
      "hover:border-rose-500/30",

    glow:
      "bg-rose-500/15",

    progress:
      "from-rose-400 to-red-500",
  },

  info: {
    iconContainer:
      "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",

    badge:
      "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",

    border:
      "hover:border-cyan-500/30",

    glow:
      "bg-cyan-500/15",

    progress:
      "from-cyan-400 to-blue-500",
  },

  violet: {
    iconContainer:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400",

    badge:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400",

    border:
      "hover:border-violet-500/30",

    glow:
      "bg-violet-500/15",

    progress:
      "from-violet-500 to-blue-500",
  },

  neutral: {
    iconContainer:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400",

    badge:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400",

    border:
      "hover:border-slate-400/30",

    glow:
      "bg-slate-500/10",

    progress:
      "from-slate-400 to-slate-500",
  },
};

/* =========================================================
   INSIGHT CARD
========================================================= */

function InsightCard({
  insight,
  delay = 0,
  onClick,
}) {
  const design =
    toneDesign[insight.tone] ||
    toneDesign.info;

  const Icon =
    insight.icon ||
    Lightbulb;

  const progress =
    Math.min(
      Math.max(
        getSafeNumber(
          insight.progress
        ),
        0
      ),
      100
    );

  return (
    <motion.button
      type="button"
      onClick={onClick}
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
      className={`
        group
        relative
        min-w-0
        overflow-hidden
        rounded-2xl
        border
        border-slate-200/80
        bg-slate-50/75
        p-4
        text-left
        transition
        duration-300
        hover:bg-white
        hover:shadow-xl
        dark:border-white/[0.08]
        dark:bg-white/[0.025]
        dark:hover:bg-white/[0.045]
        ${design.border}
      `}
    >
      {/* Background glow */}

      <div
        className={`
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-28
          w-28
          rounded-full
          opacity-60
          blur-3xl
          transition-opacity
          duration-300
          group-hover:opacity-100
          ${design.glow}
        `}
      />

      <div className="relative">
        {/* Icon and metric */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >
          <div
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${design.iconContainer}
            `}
          >
            <Icon size={18} />
          </div>

          <span
            className={`
              max-w-[55%]
              truncate
              rounded-full
              px-2.5
              py-1.5
              text-[10px]
              font-bold
              ${design.badge}
            `}
          >
            {insight.metric}
          </span>
        </div>

        {/* Insight content */}

        <h3
          className="
            mt-4
            text-sm
            font-black
            text-slate-950
            dark:text-white
          "
        >
          {insight.title}
        </h3>

        <p
          className="
            mt-2
            min-h-[48px]
            text-xs
            leading-5
            text-slate-500
            dark:text-slate-400
          "
        >
          {insight.description}
        </p>

        {/* Progress */}

        <div
          className="
            mt-4
            h-1.5
            overflow-hidden
            rounded-full
            bg-slate-200
            dark:bg-slate-800
          "
        >
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.75,
              delay: delay + 0.15,
              ease: "easeOut",
            }}
            className={`
              h-full
              rounded-full
              bg-gradient-to-r
              ${design.progress}
            `}
          />
        </div>

        {/* Footer */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            gap-3
            border-t
            border-slate-200/80
            pt-3
            dark:border-white/[0.08]
          "
        >
          <span
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.1em]
              text-slate-400
            "
          >
            {insight.footer}
          </span>

          <ArrowRight
            size={15}
            className="
              shrink-0
              text-slate-400
              transition
              group-hover:translate-x-1
              group-hover:text-cyan-500
            "
          />
        </div>
      </div>
    </motion.button>
  );
}

/* =========================================================
   SMART FINANCIAL INSIGHTS
========================================================= */

function AnalyticsCards() {
  const navigate = useNavigate();

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
      return `${currency} ${getSafeNumber(
        value
      ).toLocaleString("en-IN")}`;
    }
  };

  /* =======================================================
     ANALYZE CURRENT AND PREVIOUS MONTH
  ======================================================= */

  const analysis =
    useMemo(() => {
      const now = new Date();

      const previousMonthDate =
        new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );

      const current = {
        income: 0,
        expense: 0,
        transactions: 0,
        todayTransactions: 0,
        categories: {},
      };

      const previous = {
        income: 0,
        expense: 0,
        transactions: 0,
        categories: {},
      };

      transactions.forEach(
        (transaction) => {
          const date =
            getTransactionDate(
              transaction
            );

          if (!date) {
            return;
          }

          const amount =
            getSafeNumber(
              transaction.amount
            );

          const category =
            String(
              transaction.category ||
                "Other"
            ).trim() || "Other";

          if (
            isSameMonth(
              date,
              now
            )
          ) {
            current.transactions += 1;

            if (
              isSameDay(
                date,
                now
              )
            ) {
              current.todayTransactions +=
                1;
            }

            if (
              transaction.type ===
              "income"
            ) {
              current.income +=
                amount;
            }

            if (
              transaction.type ===
              "expense"
            ) {
              current.expense +=
                amount;

              current.categories[
                category
              ] =
                getSafeNumber(
                  current.categories[
                    category
                  ]
                ) + amount;
            }
          }

          if (
            isSameMonth(
              date,
              previousMonthDate
            )
          ) {
            previous.transactions += 1;

            if (
              transaction.type ===
              "income"
            ) {
              previous.income +=
                amount;
            }

            if (
              transaction.type ===
              "expense"
            ) {
              previous.expense +=
                amount;

              previous.categories[
                category
              ] =
                getSafeNumber(
                  previous.categories[
                    category
                  ]
                ) + amount;
            }
          }
        }
      );

      const currentNet =
        current.income -
        current.expense;

      const previousNet =
        previous.income -
        previous.expense;

      const savingsRate =
        current.income > 0
          ? Math.min(
              Math.max(
                Math.round(
                  (Math.max(
                    currentNet,
                    0
                  ) /
                    current.income) *
                    100
                ),
                0
              ),
              100
            )
          : 0;

      const spendingRatio =
        current.income > 0
          ? Math.min(
              Math.max(
                Math.round(
                  (current.expense /
                    current.income) *
                    100
                ),
                0
              ),
              100
            )
          : current.expense > 0
            ? 100
            : 0;

      const sortedCategories =
        Object.entries(
          current.categories
        ).sort(
          (
            firstCategory,
            secondCategory
          ) =>
            secondCategory[1] -
            firstCategory[1]
        );

      const [
        topCategoryName,
        topCategoryAmount,
      ] =
        sortedCategories[0] ||
        ["No expenses", 0];

      const topCategoryShare =
        current.expense > 0
          ? Math.round(
              (topCategoryAmount /
                current.expense) *
                100
            )
          : 0;

      const previousCategoryAmount =
        getSafeNumber(
          previous.categories[
            topCategoryName
          ]
        );

      return {
        current,
        previous,
        currentNet,
        previousNet,
        savingsRate,
        spendingRatio,
        topCategoryName,
        topCategoryAmount,
        topCategoryShare,

        incomeChange:
          calculatePercentageChange(
            current.income,
            previous.income
          ),

        expenseChange:
          calculatePercentageChange(
            current.expense,
            previous.expense
          ),

        netChange:
          calculatePercentageChange(
            currentNet,
            previousNet
          ),

        categoryChange:
          calculatePercentageChange(
            topCategoryAmount,
            previousCategoryAmount
          ),
      };
    }, [transactions]);

  /* =======================================================
     SAVINGS INSIGHT
  ======================================================= */

  const savingsInsight =
    useMemo(() => {
      if (
        analysis.current.transactions ===
        0
      ) {
        return {
          title:
            "Start building your monthly insights",

          description:
            "Add income and expense transactions to receive personalized financial recommendations.",

          metric: "No data",

          tone: "neutral",

          icon: PiggyBank,

          progress: 0,

          footer: "Add transactions",

          route: "/transactions",
        };
      }

      if (
        analysis.currentNet < 0
      ) {
        return {
          title:
            "Your monthly cash flow is negative",

          description:
            `Expenses currently exceed income by ${formatCurrency(
              Math.abs(
                analysis.currentNet
              )
            )}. Review non-essential spending.`,

          metric: "Needs attention",

          tone: "danger",

          icon: TriangleAlert,

          progress:
            analysis.spendingRatio,

          footer: "Review expenses",

          route: "/transactions",
        };
      }

      if (
        analysis.savingsRate >= 40
      ) {
        return {
          title:
            "Excellent savings performance",

          description:
            `You retained ${analysis.savingsRate}% of this month's income. Your current saving habit is very strong.`,

          metric: `${analysis.savingsRate}% saved`,

          tone: "success",

          icon: PiggyBank,

          progress:
            analysis.savingsRate,

          footer: "View savings trend",

          route: "/analytics",
        };
      }

      if (
        analysis.savingsRate >= 20
      ) {
        return {
          title:
            "Your savings progress is healthy",

          description:
            `You saved ${analysis.savingsRate}% of monthly income. Continue controlling expenses to improve it further.`,

          metric: `${analysis.savingsRate}% saved`,

          tone: "info",

          icon: PiggyBank,

          progress:
            analysis.savingsRate,

          footer: "Explore analytics",

          route: "/analytics",
        };
      }

      return {
        title:
          "Your savings rate can improve",

        description:
          `Only ${analysis.savingsRate}% of monthly income is currently retained. Try reducing flexible expenses.`,

        metric: `${analysis.savingsRate}% saved`,

        tone: "warning",

        icon: CircleAlert,

        progress:
          analysis.savingsRate,

        footer: "Review spending",

        route: "/transactions",
      };
    }, [
      analysis,
      formatCurrency,
    ]);

  /* =======================================================
     SPENDING INSIGHT
  ======================================================= */

  const spendingInsight =
    useMemo(() => {
      if (
        analysis.current.expense ===
        0
      ) {
        return {
          title:
            "No monthly expenses recorded",

          description:
            "Your expense activity is currently empty. Add spending records for more accurate analysis.",

          metric: "0% spent",

          tone: "neutral",

          icon: ShieldCheck,

          progress: 0,

          footer: "Add expense",

          route: "/transactions",
        };
      }

      if (
        analysis.spendingRatio <= 50
      ) {
        return {
          title:
            "Your spending is under control",

          description:
            `Expenses use ${analysis.spendingRatio}% of monthly income, leaving a healthy amount available for savings.`,

          metric: `${analysis.spendingRatio}% spent`,

          tone: "success",

          icon: ShieldCheck,

          progress:
            analysis.spendingRatio,

          footer: "View expense details",

          route: "/analytics",
        };
      }

      if (
        analysis.spendingRatio <= 80
      ) {
        return {
          title:
            "Monitor your monthly spending",

          description:
            `${analysis.spendingRatio}% of income has already been used. Track upcoming expenses carefully.`,

          metric: `${analysis.spendingRatio}% spent`,

          tone: "warning",

          icon: TrendingDown,

          progress:
            analysis.spendingRatio,

          footer: "Open transactions",

          route: "/transactions",
        };
      }

      return {
        title:
          "Your spending level is high",

        description:
          `${analysis.spendingRatio}% of monthly income has been spent. Consider reducing non-essential categories.`,

        metric: `${analysis.spendingRatio}% spent`,

        tone: "danger",

        icon: TriangleAlert,

        progress:
          analysis.spendingRatio,

        footer: "Manage expenses",

        route: "/transactions",
      };
    }, [analysis]);

  /* =======================================================
     CATEGORY INSIGHT
  ======================================================= */

  const categoryInsight =
    useMemo(() => {
      if (
        analysis.current.expense ===
        0
      ) {
        return {
          title:
            "No category pressure detected",

          description:
            "Expense categories will be analyzed automatically when you add spending transactions.",

          metric: "No category",

          tone: "neutral",

          icon: Tags,

          progress: 0,

          footer: "Add transaction",

          route: "/transactions",
        };
      }

      if (
        analysis.topCategoryShare >=
        50
      ) {
        return {
          title:
            `${analysis.topCategoryName} dominates spending`,

          description:
            `${analysis.topCategoryName} represents ${analysis.topCategoryShare}% of monthly expenses at ${formatCurrency(
              analysis.topCategoryAmount
            )}.`,

          metric: `${analysis.topCategoryShare}% share`,

          tone: "warning",

          icon: Tags,

          progress:
            analysis.topCategoryShare,

          footer: "Analyze categories",

          route: "/analytics",
        };
      }

      const direction =
        analysis.categoryChange > 0
          ? `increased by ${Math.abs(
              analysis.categoryChange
            )}%`
          : analysis.categoryChange < 0
            ? `decreased by ${Math.abs(
                analysis.categoryChange
              )}%`
            : "remained stable";

      return {
        title:
          `${analysis.topCategoryName} is your top category`,

        description:
          `${formatCurrency(
            analysis.topCategoryAmount
          )} was spent here, and this category ${direction} compared with last month.`,

        metric:
          analysis.topCategoryName,

        tone:
          analysis.categoryChange > 20
            ? "warning"
            : "violet",

        icon: Tags,

        progress:
          analysis.topCategoryShare,

        footer: "View category report",

        route: "/analytics",
      };
    }, [
      analysis,
      formatCurrency,
    ]);

  /* =======================================================
     CASH-FLOW INSIGHT
  ======================================================= */

  const cashFlowInsight =
    useMemo(() => {
      if (
        analysis.current.transactions ===
        0
      ) {
        return {
          title:
            "Monthly activity has not started",

          description:
            "Record your first transaction to begin tracking cash flow and monthly financial performance.",

          metric: "0 records",

          tone: "neutral",

          icon: Activity,

          progress: 0,

          footer: "Create transaction",

          route: "/transactions",
        };
      }

      if (
        analysis.currentNet > 0
      ) {
        const incomeMessage =
          analysis.incomeChange > 0
            ? `Income increased by ${analysis.incomeChange}% from last month.`
            : analysis.incomeChange < 0
              ? `Income decreased by ${Math.abs(
                  analysis.incomeChange
                )}% from last month.`
              : "Income is unchanged from last month.";

        return {
          title:
            "Your monthly balance is positive",

          description:
            `You currently have ${formatCurrency(
              analysis.currentNet
            )} in positive cash flow. ${incomeMessage}`,

          metric: formatCurrency(
            analysis.currentNet
          ),

          tone: "success",

          icon: TrendingUp,

          progress:
            analysis.savingsRate,

          footer: `${analysis.current.transactions} monthly records`,

          route: "/analytics",
        };
      }

      if (
        analysis.currentNet === 0
      ) {
        return {
          title:
            "Income and expenses are balanced",

          description:
            "Your monthly net amount is currently zero. New transactions will affect your cash-flow position.",

          metric: formatCurrency(0),

          tone: "info",

          icon: WalletCards,

          progress: 50,

          footer: `${analysis.current.transactions} monthly records`,

          route: "/analytics",
        };
      }

      return {
        title:
          "Expenses are above monthly income",

        description:
          `Your cash flow is negative by ${formatCurrency(
            Math.abs(
              analysis.currentNet
            )
          )}. Review large expenses and spending categories.`,

        metric: formatCurrency(
          analysis.currentNet
        ),

        tone: "danger",

        icon: TrendingDown,

        progress:
          analysis.spendingRatio,

        footer: "Improve cash flow",

        route: "/transactions",
      };
    }, [
      analysis,
      formatCurrency,
    ]);

  const insights = [
    savingsInsight,
    spendingInsight,
    categoryInsight,
    cashFlowInsight,
  ];

  /* =======================================================
     OVERALL FINANCIAL MESSAGE
  ======================================================= */

  const overallStatus =
    useMemo(() => {
      if (
        analysis.current.transactions ===
        0
      ) {
        return {
          title:
            "Your financial analysis is ready",

          description:
            "Add transactions and FinTrack will automatically generate personalized insights from your data.",

          label: "Waiting for data",

          tone: "neutral",
        };
      }

      if (
        analysis.currentNet < 0 ||
        analysis.spendingRatio > 90
      ) {
        return {
          title:
            "Your finances need attention",

          description:
            "Monthly spending is placing pressure on your cash flow. Review expenses before adding new financial commitments.",

          label: "Action recommended",

          tone: "danger",
        };
      }

      if (
        analysis.savingsRate >= 40 &&
        analysis.currentNet > 0
      ) {
        return {
          title:
            "Your finances are performing strongly",

          description:
            `You retained ${analysis.savingsRate}% of income and maintained positive monthly cash flow.`,

          label: "Excellent position",

          tone: "success",
        };
      }

      if (
        analysis.currentNet > 0
      ) {
        return {
          title:
            "Your finances are moving positively",

          description:
            "You currently have positive cash flow. Continue tracking spending to strengthen your savings rate.",

          label: "Healthy position",

          tone: "info",
        };
      }

      return {
        title:
          "Continue monitoring your finances",

        description:
          "Your current financial position is stable, but additional activity may change the monthly result.",

        label: "Stable position",

        tone: "warning",
      };
    }, [analysis]);

  const overallDesign =
    toneDesign[
      overallStatus.tone
    ] || toneDesign.info;

  return (
    <section className="min-w-0">
      <div
        className="
          relative
          min-w-0
          overflow-hidden
          rounded-[30px]
          border
          border-slate-200/80
          bg-white
          p-4
          shadow-sm
          dark:border-white/10
          dark:bg-[#0d172a]
          sm:p-5
          lg:p-6
        "
      >
        {/* Background effects */}

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            h-72
            w-72
            rounded-full
            bg-cyan-500/[0.07]
            blur-[110px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-36
            left-1/3
            h-72
            w-72
            rounded-full
            bg-violet-500/[0.07]
            blur-[110px]
          "
        />

        <div className="relative">
          {/* Section header */}

          <div
            className="
              mb-5
              flex
              flex-col
              gap-4
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
                  rounded-2xl
                  bg-gradient-to-br
                  from-cyan-500/15
                  to-violet-500/15
                  text-cyan-600
                  dark:text-cyan-400
                "
              >
                <Sparkles size={20} />
              </div>

              <div>
                <h2
                  className="
                    text-lg
                    font-black
                    text-slate-950
                    dark:text-white
                    sm:text-xl
                  "
                >
                  Smart Financial Insights
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Personalized recommendations generated from your financial activity.
                </p>
              </div>
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
                bg-slate-50
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

          {/* Main layout */}

          <div
            className="
              grid
              min-w-0
              gap-4
              xl:grid-cols-[minmax(270px,0.72fr)_minmax(0,1.6fr)]
            "
          >
            {/* Overall financial brief */}

            <motion.article
              initial={{
                opacity: 0,
                x: -14,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              className="
                relative
                min-w-0
                overflow-hidden
                rounded-3xl
                border
                border-cyan-500/15
                bg-gradient-to-br
                from-slate-950
                via-[#071426]
                to-[#0b2331]
                p-5
                text-white
                sm:p-6
              "
            >
              <div
                className={`
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  h-52
                  w-52
                  rounded-full
                  opacity-50
                  blur-[80px]
                  ${overallDesign.glow}
                `}
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-24
                  left-1/4
                  h-48
                  w-48
                  rounded-full
                  bg-violet-500/15
                  blur-[90px]
                "
              />

              <div
                className="
                  relative
                  flex
                  h-full
                  min-h-[250px]
                  flex-col
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-cyan-500/15
                      text-cyan-300
                    "
                  >
                    <Lightbulb size={20} />
                  </div>

                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1.5
                      text-[10px]
                      font-bold
                      ${overallDesign.badge}
                    `}
                  >
                    {overallStatus.label}
                  </span>
                </div>

                <div className="mt-6">
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-slate-400
                    "
                  >
                    Monthly intelligence brief
                  </p>

                  <h3
                    className="
                      mt-3
                      text-xl
                      font-black
                      leading-tight
                      text-white
                      sm:text-2xl
                    "
                  >
                    {overallStatus.title}
                  </h3>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-6
                      text-slate-400
                    "
                  >
                    {overallStatus.description}
                  </p>
                </div>

                <div
                  className="
                    mt-auto
                    grid
                    grid-cols-2
                    gap-3
                    pt-6
                  "
                >
                  <div
                    className="
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      p-3
                    "
                  >
                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Monthly activity
                    </p>

                    <p
                      className="
                        mt-1
                        text-lg
                        font-black
                        text-white
                      "
                    >
                      {
                        analysis.current
                          .transactions
                      }
                    </p>
                  </div>

                  <div
                    className="
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      p-3
                    "
                  >
                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Recorded today
                    </p>

                    <p
                      className="
                        mt-1
                        text-lg
                        font-black
                        text-white
                      "
                    >
                      {
                        analysis.current
                          .todayTransactions
                      }
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Insight cards */}

            <div
              className="
                grid
                min-w-0
                grid-cols-1
                gap-3
                sm:grid-cols-2
              "
            >
              {insights.map(
                (insight, index) => (
                  <InsightCard
                    key={insight.title}
                    insight={insight}
                    delay={
                      index * 0.06
                    }
                    onClick={() =>
                      navigate(
                        insight.route
                      )
                    }
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnalyticsCards;