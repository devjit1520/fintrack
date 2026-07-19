import {
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowRight,
  BadgeIndianRupee,
  BookOpen,
  Car,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Coffee,
  HeartPulse,
  Home,
  Layers3,
  Plane,
  ReceiptText,
  ShoppingBag,
  Tags,
  Utensils,
  WalletCards,
} from "lucide-react";

import useFinance from "../../hooks/useFinance";
import useProfile from "../../hooks/useProfile";

/* =========================================================
   CATEGORY DESIGN
========================================================= */

const CATEGORY_DESIGNS = [
  {
    color: "#06b6d4",
    bar: "from-cyan-400 to-blue-500",
    icon: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  {
    color: "#8b5cf6",
    bar: "from-violet-400 to-purple-500",
    icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    color: "#f43f5e",
    bar: "from-rose-400 to-red-500",
    icon: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    color: "#10b981",
    bar: "from-emerald-400 to-teal-500",
    icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    color: "#f59e0b",
    bar: "from-amber-400 to-orange-500",
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    color: "#3b82f6",
    bar: "from-blue-400 to-indigo-500",
    icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function normalizeCategory(value) {
  const category = String(
    value || "Other"
  ).trim();

  return category || "Other";
}

function getCategoryIcon(category) {
  const value =
    category.toLowerCase();

  if (
    value.includes("food") ||
    value.includes("restaurant") ||
    value.includes("dining")
  ) {
    return Utensils;
  }

  if (
    value.includes("transport") ||
    value.includes("fuel") ||
    value.includes("vehicle")
  ) {
    return Car;
  }

  if (
    value.includes("shopping") ||
    value.includes("clothing")
  ) {
    return ShoppingBag;
  }

  if (
    value.includes("rent") ||
    value.includes("home") ||
    value.includes("housing")
  ) {
    return Home;
  }

  if (
    value.includes("health") ||
    value.includes("medical")
  ) {
    return HeartPulse;
  }

  if (
    value.includes("education") ||
    value.includes("course")
  ) {
    return BookOpen;
  }

  if (
    value.includes("coffee") ||
    value.includes("snack")
  ) {
    return Coffee;
  }

  if (
    value.includes("travel") ||
    value.includes("flight") ||
    value.includes("vacation")
  ) {
    return Plane;
  }

  if (
    value.includes("bill") ||
    value.includes("utility")
  ) {
    return ReceiptText;
  }

  return Tags;
}

/* =========================================================
   SUMMARY METRIC
========================================================= */

function SummaryMetric({
  label,
  value,
  helper,
  icon: Icon,
  iconClasses,
}) {
  return (
    <article
      className="
        flex
        min-w-0
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-200/80
        bg-slate-50/70
        p-4
        dark:border-white/[0.08]
        dark:bg-white/[0.025]
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
          ${iconClasses}
        `}
      >
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p
          className="
            text-[9px]
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
          className="
            mt-1
            truncate
            text-xl
            font-black
            text-slate-950
            dark:text-white
          "
        >
          {value}
        </p>

        <p
          className="
            mt-0.5
            truncate
            text-[10px]
            text-slate-500
            dark:text-slate-400
          "
        >
          {helper}
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   CATEGORY ROW
========================================================= */

function CategoryReportRow({
  category,
  index,
  formatCurrency,
}) {
  const design =
    CATEGORY_DESIGNS[
      index %
        CATEGORY_DESIGNS.length
    ];

  const Icon =
    getCategoryIcon(
      category.name
    );

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.04,
        ease: "easeOut",
      }}
      className="
        group
        rounded-2xl
        border
        border-slate-200/80
        bg-white
        p-4
        transition
        duration-300
        hover:border-cyan-500/25
        hover:shadow-lg
        dark:border-white/[0.08]
        dark:bg-white/[0.025]
        dark:hover:bg-white/[0.04]
      "
    >
      <div
        className="
          flex
          min-w-0
          items-start
          gap-3
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
            ${design.icon}
          `}
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="
              flex
              min-w-0
              flex-col
              gap-2
              sm:flex-row
              sm:items-start
              sm:justify-between
              sm:gap-4
            "
          >
            <div className="min-w-0">
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-2
                "
              >
                <p
                  className="
                    truncate
                    text-sm
                    font-black
                    text-slate-950
                    dark:text-white
                  "
                >
                  {category.name}
                </p>

                {index === 0 && (
                  <span
                    className="
                      shrink-0
                      rounded-full
                      bg-amber-500/10
                      px-2
                      py-1
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-amber-600
                      dark:text-amber-400
                    "
                  >
                    Highest
                  </span>
                )}
              </div>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {category.transactions}{" "}
                {category.transactions === 1
                  ? "transaction"
                  : "transactions"}
              </p>
            </div>

            <div
              className="
                shrink-0
                sm:text-right
              "
            >
              <p
                className="
                  text-base
                  font-black
                  text-slate-950
                  dark:text-white
                "
              >
                {formatCurrency(
                  category.amount
                )}
              </p>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  font-bold
                "
                style={{
                  color:
                    design.color,
                }}
              >
                {category.percentage}% of expenses
              </p>
            </div>
          </div>

          <div
            className="
              mt-3
              h-2
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
                width: `${category.percentage}%`,
              }}
              transition={{
                duration: 0.75,
                delay:
                  index * 0.05,
                ease: "easeOut",
              }}
              className={`
                h-full
                rounded-full
                bg-gradient-to-r
                ${design.bar}
              `}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyExpenseReport({
  onAddExpense,
}) {
  return (
    <div
      className="
        flex
        min-h-[300px]
        flex-col
        items-center
        justify-center
        rounded-3xl
        border
        border-dashed
        border-slate-300
        bg-slate-50/60
        px-6
        py-10
        text-center
        dark:border-white/10
        dark:bg-white/[0.02]
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
          bg-rose-500/10
          text-rose-500
        "
      >
        <WalletCards size={28} />
      </div>

      <h3
        className="
          mt-5
          text-lg
          font-black
          text-slate-950
          dark:text-white
        "
      >
        No expense categories yet
      </h3>

      <p
        className="
          mt-2
          max-w-md
          text-sm
          leading-6
          text-slate-500
          dark:text-slate-400
        "
      >
        Add an expense transaction and FinTrack will automatically
        generate your category report.
      </p>

      <button
        type="button"
        onClick={onAddExpense}
        className="
          mt-5
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-rose-500
          px-4
          py-2.5
          text-xs
          font-bold
          text-white
          transition
          hover:bg-rose-400
        "
      >
        Add expense

        <ArrowRight size={15} />
      </button>
    </div>
  );
}

/* =========================================================
   EXPENSE PIE CHART
   COMPONENT NAME KEPT TO AVOID CHANGING IMPORTS
========================================================= */

function ExpensePieChart() {
  const navigate =
    useNavigate();

  const [
    showAll,
    setShowAll,
  ] = useState(false);

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
     CATEGORY ANALYSIS
  ======================================================= */

  const report =
    useMemo(() => {
      const groupedCategories = {};

      let totalExpense = 0;
      let expenseTransactions = 0;

      transactions.forEach(
        (transaction) => {
          if (
            String(
              transaction.type
            ).toLowerCase() !==
            "expense"
          ) {
            return;
          }

          const amount =
            getSafeNumber(
              transaction.amount
            );

          if (amount <= 0) {
            return;
          }

          const category =
            normalizeCategory(
              transaction.category
            );

          if (
            !groupedCategories[
              category
            ]
          ) {
            groupedCategories[
              category
            ] = {
              amount: 0,
              transactions: 0,
            };
          }

          groupedCategories[
            category
          ].amount += amount;

          groupedCategories[
            category
          ].transactions += 1;

          totalExpense += amount;
          expenseTransactions += 1;
        }
      );

      const categories =
        Object.entries(
          groupedCategories
        )
          .map(
            ([name, details]) => ({
              name,

              amount:
                details.amount,

              transactions:
                details.transactions,

              percentage:
                totalExpense > 0
                  ? Number(
                      (
                        (details.amount /
                          totalExpense) *
                        100
                      ).toFixed(1)
                    )
                  : 0,
            })
          )
          .sort(
            (first, second) =>
              second.amount -
              first.amount
          );

      const averageExpense =
        expenseTransactions > 0
          ? totalExpense /
            expenseTransactions
          : 0;

      return {
        categories,
        totalExpense,
        expenseTransactions,
        averageExpense,
      };
    }, [transactions]);

  const {
    categories,
    totalExpense,
    expenseTransactions,
    averageExpense,
  } = report;

const topCategory =
  categories[0] || null;

const hasExpenseData =
  categories.length > 0 &&
  topCategory !== null;

const visibleCategories =
  showAll
    ? categories
    : categories.slice(0, 5);

const hiddenCategoryCount =
  Math.max(
    categories.length - 5,
    0
  );

const topCategoryName =
  topCategory?.name ||
  "No category";

const topCategoryPercentage =
  getSafeNumber(
    topCategory?.percentage
  );

const highlyConcentrated =
  hasExpenseData &&
  topCategoryPercentage >= 60;

let insightTitle =
  "No expense data available";

let insightDescription =
  "Add an expense transaction to generate category insights.";

if (hasExpenseData) {
  if (categories.length === 1) {
    insightTitle =
      `All spending belongs to ${topCategoryName}`;

    insightDescription =
      `${topCategoryName} represents 100% of your recorded expenses. Add spending from more categories to receive a meaningful comparison.`;
  } else if (highlyConcentrated) {
    insightTitle =
      `${topCategoryName} dominates your expenses`;

    insightDescription =
      `${topCategoryName} represents ${topCategoryPercentage}% of your total expenses. Review this category carefully.`;
  } else {
    insightTitle =
      "Your expenses are distributed across categories";

    insightDescription =
      `${topCategoryName} is currently your largest category at ${topCategoryPercentage}% of total spending.`;
  }
}
  return (
    <section
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
      {/* Background decoration */}

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-72
          w-72
          rounded-full
          bg-rose-500/[0.06]
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
          bg-cyan-500/[0.06]
          blur-[110px]
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
                bg-rose-500/10
                text-rose-600
                dark:text-rose-400
              "
            >
              <BadgeIndianRupee
                size={20}
              />
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
                Expense Categories
              </h2>

              <p
                className="
                  mt-1
                  max-w-2xl
                  text-xs
                  leading-5
                  text-slate-500
                  dark:text-slate-400
                "
              >
                A clear report showing where your money is being spent.
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
            <Layers3
              size={14}
              className="text-violet-500"
            />

            All recorded expenses
          </span>
        </div>

        {categories.length === 0 ? (
          <div className="mt-5">
            <EmptyExpenseReport
              onAddExpense={() =>
                navigate(
                  "/transactions"
                )
              }
            />
          </div>
        ) : (
          <>
            {/* Summary metrics */}

            <div
              className="
                mt-5
                grid
                min-w-0
                gap-3
                sm:grid-cols-3
              "
            >
              <SummaryMetric
                label="Total Expense"
                value={formatCurrency(
                  totalExpense
                )}
                helper="All recorded spending"
                icon={BadgeIndianRupee}
                iconClasses="
                  bg-rose-500/10
                  text-rose-600
                  dark:text-rose-400
                "
              />

              <SummaryMetric
                label="Categories"
                value={categories.length}
                helper={
                  categories.length === 1
                    ? "Expense category"
                    : "Expense categories"
                }
                icon={Tags}
                iconClasses="
                  bg-cyan-500/10
                  text-cyan-600
                  dark:text-cyan-400
                "
              />

              <SummaryMetric
                label="Average Expense"
                value={formatCurrency(
                  averageExpense
                )}
                helper={`${expenseTransactions} ${
                  expenseTransactions === 1
                    ? "transaction"
                    : "transactions"
                }`}
                icon={ReceiptText}
                iconClasses="
                  bg-violet-500/10
                  text-violet-600
                  dark:text-violet-400
                "
              />
            </div>

            {/* Category breakdown */}

            <div
              className="
                mt-4
                rounded-3xl
                border
                border-slate-200/80
                bg-slate-50/70
                p-4
                dark:border-white/[0.08]
                dark:bg-white/[0.02]
                sm:p-5
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div>
                  <h3
                    className="
                      text-sm
                      font-black
                      text-slate-950
                      dark:text-white
                    "
                  >
                    Category breakdown
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Categories ranked from highest to lowest spending.
                  </p>
                </div>

                <span
                  className="
                    inline-flex
                    w-fit
                    rounded-full
                    bg-cyan-500/10
                    px-3
                    py-1.5
                    text-[10px]
                    font-bold
                    text-cyan-600
                    dark:text-cyan-400
                  "
                >
                  {expenseTransactions} expense{" "}
                  {expenseTransactions === 1
                    ? "record"
                    : "records"}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {visibleCategories.map(
                  (category, index) => (
                    <CategoryReportRow
                      key={category.name}
                      category={category}
                      index={index}
                      formatCurrency={
                        formatCurrency
                      }
                    />
                  )
                )}
              </div>

              {hiddenCategoryCount > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setShowAll(
                      (current) =>
                        !current
                    )
                  }
                  className="
                    mt-4
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-dashed
                    border-slate-300
                    px-4
                    py-3
                    text-xs
                    font-bold
                    text-slate-500
                    transition
                    hover:border-cyan-500/40
                    hover:text-cyan-600
                    dark:border-white/10
                    dark:text-slate-400
                    dark:hover:text-cyan-400
                  "
                >
                  {showAll ? (
                    <>
                      Show fewer categories

                      <ChevronUp
                        size={15}
                      />
                    </>
                  ) : (
                    <>
                      View{" "}
                      {hiddenCategoryCount}{" "}
                      more{" "}
                      {hiddenCategoryCount === 1
                        ? "category"
                        : "categories"}

                      <ChevronDown
                        size={15}
                      />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Insight */}

            <div
              className="
                mt-4
                flex
                flex-col
                gap-4
                rounded-2xl
                border
                border-amber-500/15
                bg-amber-500/[0.05]
                p-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-start
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-amber-500/10
                    text-amber-600
                    dark:text-amber-400
                  "
                >
                  <CircleAlert
                    size={18}
                  />
                </div>

                <div className="min-w-0">
                  <h3
                    className="
                      text-sm
                      font-black
                      text-slate-950
                      dark:text-white
                    "
                  >
                    {insightTitle}
                  </h3>

                  <p
                    className="
                      mt-1
                      max-w-4xl
                      text-xs
                      leading-5
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {insightDescription}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/transactions"
                  )
                }
                className="
                  inline-flex
                  w-full
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-cyan-500/20
                  bg-cyan-500/10
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-cyan-600
                  transition
                  hover:border-cyan-500/40
                  hover:bg-cyan-500/15
                  dark:text-cyan-400
                  sm:w-auto
                "
              >
                View transactions

                <ArrowRight
                  size={15}
                />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default ExpensePieChart;