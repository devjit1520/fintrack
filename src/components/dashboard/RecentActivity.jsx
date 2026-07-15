import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  PiggyBank,
  ReceiptText,
  Target,
  WalletCards,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  Link,
} from "react-router-dom";

import useBudget from "../../hooks/useBudget";
import useFinance from "../../hooks/useFinance";
import useGoal from "../../hooks/useGoal";

const FILTERS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Income",
    value: "income",
  },
  {
    label: "Expenses",
    value: "expense",
  },
  {
    label: "Budgets",
    value: "budget",
  },
  {
    label: "Goals",
    value: "goal",
  },
];

const ACTIVITY_STYLES = {
  income: {
    iconContainer:
      "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400",

    badge:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

    amount:
      "text-emerald-600 dark:text-emerald-400",

    dot: "bg-emerald-500",

    line:
      "from-emerald-500/40 to-slate-200 dark:to-slate-800",
  },

  expense: {
    iconContainer:
      "bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400",

    badge:
      "bg-red-500/10 text-red-600 dark:text-red-400",

    amount:
      "text-red-600 dark:text-red-400",

    dot: "bg-red-500",

    line:
      "from-red-500/40 to-slate-200 dark:to-slate-800",
  },

  budget: {
    iconContainer:
      "bg-violet-500/10 text-violet-600 ring-violet-500/20 dark:text-violet-400",

    badge:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400",

    amount:
      "text-violet-600 dark:text-violet-400",

    dot: "bg-violet-500",

    line:
      "from-violet-500/40 to-slate-200 dark:to-slate-800",
  },

  goal: {
    iconContainer:
      "bg-cyan-500/10 text-cyan-600 ring-cyan-500/20 dark:text-cyan-400",

    badge:
      "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",

    amount:
      "text-cyan-600 dark:text-cyan-400",

    dot: "bg-cyan-500",

    line:
      "from-cyan-500/40 to-slate-200 dark:to-slate-800",
  },

  default: {
    iconContainer:
      "bg-slate-500/10 text-slate-600 ring-slate-500/20 dark:text-slate-400",

    badge:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400",

    amount:
      "text-slate-700 dark:text-slate-300",

    dot: "bg-slate-500",

    line:
      "from-slate-500/40 to-slate-200 dark:to-slate-800",
  },
};

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(getSafeNumber(value));
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    const [
      year,
      month,
      day,
    ] = value
      .split("-")
      .map(Number);

    return new Date(
      year,
      month - 1,
      day
    );
  }

  const date = new Date(value);

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
}

function getTimestamp(value) {
  const date =
    parseDate(value);

  return date
    ? date.getTime()
    : 0;
}

function formatRelativeTime(value) {
  const date =
    parseDate(value);

  if (!date) {
    return "Date unavailable";
  }

  const now = new Date();

  const difference =
    now.getTime() -
    date.getTime();

  const seconds =
    Math.floor(
      difference / 1000
    );

  const minutes =
    Math.floor(
      seconds / 60
    );

  const hours =
    Math.floor(
      minutes / 60
    );

  const days =
    Math.floor(
      hours / 24
    );

  if (
    seconds >= 0 &&
    seconds < 60
  ) {
    return "Just now";
  }

  if (
    minutes >= 1 &&
    minutes < 60
  ) {
    return `${minutes} ${
      minutes === 1
        ? "minute"
        : "minutes"
    } ago`;
  }

  if (
    hours >= 1 &&
    hours < 24
  ) {
    return `${hours} ${
      hours === 1
        ? "hour"
        : "hours"
    } ago`;
  }

  if (days === 1) {
    return "Yesterday";
  }

  if (
    days > 1 &&
    days <= 7
  ) {
    return `${days} days ago`;
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function getTransactionDate(
  transaction
) {
  return (
    transaction.createdAt ||
    transaction.created_at ||
    transaction.date
  );
}

function getBudgetDate(budget) {
  return (
    budget.updatedAt ||
    budget.updated_at ||
    budget.createdAt ||
    budget.created_at
  );
}

function getGoalDate(goal) {
  return (
    goal.updatedAt ||
    goal.updated_at ||
    goal.createdAt ||
    goal.created_at
  );
}

function RecentActivity() {
  const [
    activeFilter,
    setActiveFilter,
  ] = useState("all");

  const {
    transactions = [],
    loading: financeLoading,
    error: financeError,
  } = useFinance();

  const {
    budgets = [],
    loading: budgetLoading,
    error: budgetError,
  } = useBudget();

  const {
    goals = [],
    loading: goalLoading,
    error: goalError,
  } = useGoal();

  const loading =
    financeLoading ||
    budgetLoading ||
    goalLoading;

  const error =
    financeError ||
    budgetError ||
    goalError;

  const activities =
    useMemo(() => {
      const transactionActivities =
        transactions
          .map(
            (transaction) => {
              const type =
                String(
                  transaction.type ||
                    ""
                )
                  .trim()
                  .toLowerCase();

              const isIncome =
                type === "income";

              const isExpense =
                type === "expense";

              if (
                !isIncome &&
                !isExpense
              ) {
                return null;
              }

              const activityDate =
                getTransactionDate(
                  transaction
                );

              if (
                !parseDate(
                  activityDate
                )
              ) {
                return null;
              }

              return {
                id: `transaction-${
                  transaction.id
                }`,

                sourceId:
                  transaction.id,

                type: isIncome
                  ? "income"
                  : "expense",

                label: isIncome
                  ? "Income"
                  : "Expense",

                title:
                  transaction.title ||
                  (isIncome
                    ? "Income added"
                    : "Expense recorded"),

                description: `${
                  isIncome
                    ? "Received"
                    : "Spent"
                } in ${
                  transaction.category ||
                  "Other"
                }`,

                amount:
                  getSafeNumber(
                    transaction.amount
                  ),

                date:
                  activityDate,

                icon: isIncome
                  ? ArrowDownLeft
                  : ArrowUpRight,

                path:
                  "/transactions",
              };
            }
          )
          .filter(Boolean);

      const budgetActivities =
        budgets
          .map((budget) => {
            const activityDate =
              getBudgetDate(
                budget
              );

            if (
              !parseDate(
                activityDate
              )
            ) {
              return null;
            }

            const budgetAmount =
              getSafeNumber(
                budget.amount ??
                  budget.limit ??
                  budget.budgetAmount ??
                  budget.budget_amount
              );

            return {
              id: `budget-${
                budget.id
              }`,

              sourceId:
                budget.id,

              type: "budget",

              label: "Budget",

              title: `${
                budget.category ||
                "Category"
              } budget updated`,

              description:
                "Monthly spending limit",

              amount:
                budgetAmount,

              date:
                activityDate,

              icon: WalletCards,

              path: "/budget",
            };
          })
          .filter(Boolean);

      const goalActivities =
        goals
          .map((goal) => {
            const activityDate =
              getGoalDate(goal);

            if (
              !parseDate(
                activityDate
              )
            ) {
              return null;
            }

            const target =
              getSafeNumber(
                goal.targetAmount ??
                  goal.target_amount ??
                  goal.target ??
                  goal.amount
              );

            return {
              id: `goal-${goal.id}`,

              sourceId: goal.id,

              type: "goal",

              label: "Goal",

              title:
                goal.title ||
                "Savings goal updated",

              description:
                String(
                  goal.status || ""
                )
                  .trim()
                  .toLowerCase() ===
                "completed"
                  ? "Savings target completed"
                  : "Savings target progress",

              amount: target,

              date:
                activityDate,

              icon: Target,

              path: "/goals",
            };
          })
          .filter(Boolean);

      return [
        ...transactionActivities,
        ...budgetActivities,
        ...goalActivities,
      ]
        .sort(
          (
            first,
            second
          ) =>
            getTimestamp(
              second.date
            ) -
            getTimestamp(
              first.date
            )
        )
        .slice(0, 12);
    }, [
      transactions,
      budgets,
      goals,
    ]);

  const filteredActivities =
    useMemo(() => {
      if (
        activeFilter === "all"
      ) {
        return activities;
      }

      return activities.filter(
        (activity) =>
          activity.type ===
          activeFilter
      );
    }, [
      activities,
      activeFilter,
    ]);

  const visibleActivities =
    filteredActivities.slice(
      0,
      7
    );

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
              w-44
              rounded-lg
              bg-slate-200
              dark:bg-slate-800
            "
          />

          <div
            className="
              mt-3
              h-4
              w-64
              rounded
              bg-slate-100
              dark:bg-slate-800/70
            "
          />

          <div
            className="
              mt-6
              flex
              gap-2
            "
          >
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="
                    h-9
                    w-20
                    rounded-full
                    bg-slate-100
                    dark:bg-slate-800
                  "
                />
              )
            )}
          </div>

          <div className="mt-7 space-y-5">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="
                    flex
                    gap-4
                  "
                >
                  <div
                    className="
                      h-12
                      w-12
                      shrink-0
                      rounded-2xl
                      bg-slate-100
                      dark:bg-slate-800
                    "
                  />

                  <div className="flex-1">
                    <div
                      className="
                        h-4
                        w-40
                        rounded
                        bg-slate-100
                        dark:bg-slate-800
                      "
                    />

                    <div
                      className="
                        mt-2
                        h-3
                        w-56
                        rounded
                        bg-slate-100
                        dark:bg-slate-800
                      "
                    />

                    <div
                      className="
                        mt-2
                        h-3
                        w-24
                        rounded
                        bg-slate-100
                        dark:bg-slate-800
                      "
                    />
                  </div>
                </div>
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
          bg-blue-500/10
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
                bg-blue-500/10
                text-blue-600
                dark:text-blue-400
              "
            >
              <Clock3 size={23} />
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
                Recent Activity
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Your latest financial
                updates in one timeline.
              </p>
            </div>
          </div>

          <Link
            to="/transactions"
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
              hover:border-blue-400
              hover:text-blue-600
              dark:border-slate-700
              dark:bg-slate-950/40
              dark:text-slate-200
              dark:hover:text-blue-400
            "
          >
            View transactions
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
            {String(error)}
          </div>
        )}

        {/* Filters */}

        {!error &&
          activities.length > 0 && (
            <div
              className="
                mt-6
                flex
                gap-2
                overflow-x-auto
                pb-1
              "
            >
              {FILTERS.map(
                (filter) => {
                  const isActive =
                    activeFilter ===
                    filter.value;

                  const count =
                    filter.value ===
                    "all"
                      ? activities.length
                      : activities.filter(
                          (activity) =>
                            activity.type ===
                            filter.value
                        ).length;

                  return (
                    <button
                      key={
                        filter.value
                      }
                      type="button"
                      onClick={() =>
                        setActiveFilter(
                          filter.value
                        )
                      }
                      className={`
                        inline-flex
                        shrink-0
                        items-center
                        gap-2
                        rounded-full
                        border
                        px-4
                        py-2
                        text-xs
                        font-bold
                        transition
                        ${
                          isActive
                            ? `
                              border-blue-500
                              bg-blue-500
                              text-white
                              shadow-lg
                              shadow-blue-500/20
                            `
                            : `
                              border-slate-200
                              bg-slate-50
                              text-slate-600
                              hover:border-blue-300
                              hover:text-blue-600
                              dark:border-slate-700
                              dark:bg-slate-950/40
                              dark:text-slate-300
                              dark:hover:text-blue-400
                            `
                        }
                      `}
                    >
                      {filter.label}

                      <span
                        className={`
                          rounded-full
                          px-1.5
                          py-0.5
                          text-[10px]
                          ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }
                        `}
                      >
                        {count}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          )}

        {/* Empty state */}

        {!error &&
        activities.length === 0 ? (
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
                bg-blue-500/10
                text-blue-500
              "
            >
              <ReceiptText size={30} />
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
              No activity yet
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
              Your transactions, budgets,
              and savings goals will
              appear here.
            </p>

            <Link
              to="/transactions"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-blue-500
                px-5
                py-3
                font-semibold
                text-white
                transition
                hover:bg-blue-600
              "
            >
              Add transaction
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : !error &&
          visibleActivities.length ===
            0 ? (
          <div
            className="
              mt-8
              flex
              min-h-56
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
            <CalendarDays
              size={28}
              className="text-slate-400"
            />

            <h3
              className="
                mt-4
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              No matching activity
            </h3>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              There are no records in
              this activity category.
            </p>
          </div>
        ) : (
          !error && (
            <div className="mt-8">
              {visibleActivities.map(
                (
                  activity,
                  index
                ) => {
                  const ActivityIcon =
                    activity.icon;

                  const styles =
                    ACTIVITY_STYLES[
                      activity.type
                    ] ||
                    ACTIVITY_STYLES.default;

                  const isLast =
                    index ===
                    visibleActivities.length -
                      1;

                  const isIncome =
                    activity.type ===
                    "income";

                  const isExpense =
                    activity.type ===
                    "expense";

                  return (
                    <motion.article
                      key={activity.id}
                      initial={{
                        opacity: 0,
                        x: -12,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.35,
                        delay:
                          index * 0.06,
                      }}
                      className="
                        group
                        relative
                        flex
                        gap-4
                      "
                    >
                      {/* Timeline */}

                      <div
                        className="
                          relative
                          flex
                          shrink-0
                          flex-col
                          items-center
                        "
                      >
                        <div
                          className={`
                            relative
                            z-10
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            ring-1
                            transition
                            group-hover:scale-105
                            ${styles.iconContainer}
                          `}
                        >
                          <ActivityIcon
                            size={21}
                          />

                          <span
                            className={`
                              absolute
                              -bottom-1
                              -right-1
                              h-3
                              w-3
                              rounded-full
                              border-2
                              border-white
                              dark:border-slate-900
                              ${styles.dot}
                            `}
                          />
                        </div>

                        {!isLast && (
                          <div
                            className={`
                              min-h-20
                              w-px
                              flex-1
                              bg-gradient-to-b
                              ${styles.line}
                            `}
                          />
                        )}
                      </div>

                      {/* Activity content */}

                      <Link
                        to={
                          activity.path
                        }
                        className={`
                          mb-5
                          min-w-0
                          flex-1
                          rounded-2xl
                          border
                          border-slate-200
                          bg-slate-50/70
                          p-4
                          transition
                          hover:-translate-y-0.5
                          hover:border-blue-300
                          hover:bg-white
                          hover:shadow-lg
                          dark:border-slate-800
                          dark:bg-slate-950/30
                          dark:hover:border-slate-700
                          dark:hover:bg-slate-800/60
                          ${
                            isLast
                              ? "mb-0"
                              : ""
                          }
                        `}
                      >
                        <div
                          className="
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                            sm:items-start
                            sm:justify-between
                          "
                        >
                          <div className="min-w-0">
                            <div
                              className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                              "
                            >
                              <h3
                                className="
                                  truncate
                                  font-bold
                                  text-slate-900
                                  dark:text-white
                                "
                              >
                                {
                                  activity.title
                                }
                              </h3>

                              <span
                                className={`
                                  rounded-full
                                  px-2.5
                                  py-1
                                  text-[10px]
                                  font-black
                                  uppercase
                                  tracking-wider
                                  ${styles.badge}
                                `}
                              >
                                {
                                  activity.label
                                }
                              </span>
                            </div>

                            <p
                              className="
                                mt-1.5
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                              "
                            >
                              {
                                activity.description
                              }
                            </p>

                            <p
                              className="
                                mt-2
                                inline-flex
                                items-center
                                gap-1.5
                                text-xs
                                text-slate-400
                              "
                            >
                              <Clock3
                                size={13}
                              />

                              {formatRelativeTime(
                                activity.date
                              )}
                            </p>
                          </div>

                          <div
                            className="
                              flex
                              shrink-0
                              items-center
                              justify-between
                              gap-3
                              sm:block
                              sm:text-right
                            "
                          >
                            <p
                              className={`
                                font-black
                                ${styles.amount}
                              `}
                            >
                              {isIncome
                                ? "+"
                                : isExpense
                                ? "-"
                                : ""}
                              {formatCurrency(
                                activity.amount
                              )}
                            </p>

                            <ArrowRight
                              size={16}
                              className="
                                mt-2
                                hidden
                                text-slate-400
                                transition
                                group-hover:translate-x-1
                                group-hover:text-blue-500
                                sm:ml-auto
                                sm:block
                              "
                            />
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  );
                }
              )}

              {filteredActivities.length >
                visibleActivities.length && (
                <div
                  className="
                    mt-6
                    flex
                    justify-center
                  "
                >
                  <Link
                    to="/transactions"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-slate-700
                      transition
                      hover:border-blue-400
                      hover:text-blue-600
                      dark:border-slate-700
                      dark:bg-slate-950/40
                      dark:text-slate-200
                      dark:hover:text-blue-400
                    "
                  >
                    View more activity
                    <ArrowRight
                      size={16}
                    />
                  </Link>
                </div>
              )}
            </div>
          )
        )}

        {/* Footer summary */}

        {!error &&
          activities.length > 0 && (
            <div
              className="
                mt-7
                grid
                gap-3
                border-t
                border-slate-200
                pt-6
                dark:border-slate-800
                sm:grid-cols-3
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  bg-emerald-500/5
                  px-4
                  py-3
                "
              >
                <ArrowDownLeft
                  size={18}
                  className="text-emerald-500"
                />

                <div>
                  <p
                    className="
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Income events
                  </p>

                  <p
                    className="
                      font-black
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {
                      activities.filter(
                        (activity) =>
                          activity.type ===
                          "income"
                      ).length
                    }
                  </p>
                </div>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  bg-red-500/5
                  px-4
                  py-3
                "
              >
                <ArrowUpRight
                  size={18}
                  className="text-red-500"
                />

                <div>
                  <p
                    className="
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Expense events
                  </p>

                  <p
                    className="
                      font-black
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {
                      activities.filter(
                        (activity) =>
                          activity.type ===
                          "expense"
                      ).length
                    }
                  </p>
                </div>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  bg-violet-500/5
                  px-4
                  py-3
                "
              >
                <CircleDollarSign
                  size={18}
                  className="text-violet-500"
                />

                <div>
                  <p
                    className="
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Total updates
                  </p>

                  <p
                    className="
                      font-black
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {
                      activities.length
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>
    </section>
  );
}

export default RecentActivity;