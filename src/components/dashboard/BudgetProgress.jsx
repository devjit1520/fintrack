import { useMemo } from "react";
import { motion } from "framer-motion";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Gauge,
  PiggyBank,
  WalletCards,
} from "lucide-react";

import { Link } from "react-router-dom";

import useBudget from "../../hooks/useBudget";
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

function clampPercentage(value) {
  return Math.min(
    Math.max(Number(value) || 0, 0),
    100
  );
}

function BudgetProgress() {
  const {
    budgets = [],
    loading: budgetLoading,
    error: budgetError,
  } = useBudget();

  const {
    transactions = [],
    loading: financeLoading,
  } = useFinance();

  const loading =
    budgetLoading || financeLoading;

  const budgetSummary = useMemo(() => {
    const expenseTransactions =
      transactions.filter(
        (transaction) =>
          String(
            transaction.type || ""
          )
            .trim()
            .toLowerCase() ===
          "expense"
      );

    const mappedBudgets = budgets.map(
      (budget) => {
        const budgetAmount =
          getSafeNumber(
            budget.amount ||
              budget.limit ||
              budget.budgetAmount
          );

        const category =
          budget.category || "Other";

        const spent =
          expenseTransactions
            .filter(
              (transaction) =>
                String(
                  transaction.category ||
                    ""
                )
                  .trim()
                  .toLowerCase() ===
                String(category)
                  .trim()
                  .toLowerCase()
            )
            .reduce(
              (
                total,
                transaction
              ) =>
                total +
                getSafeNumber(
                  transaction.amount
                ),
              0
            );

        const remaining =
          budgetAmount - spent;

        const progress =
          budgetAmount > 0
            ? (spent /
                budgetAmount) *
              100
            : 0;

        return {
          ...budget,
          category,
          budgetAmount,
          spent,
          remaining,
          progress,
          overBudget:
            spent > budgetAmount,
        };
      }
    );

    const totalBudget =
      mappedBudgets.reduce(
        (total, budget) =>
          total +
          budget.budgetAmount,
        0
      );

    const totalSpent =
      mappedBudgets.reduce(
        (total, budget) =>
          total + budget.spent,
        0
      );

    const totalRemaining =
      totalBudget - totalSpent;

    const overallProgress =
      totalBudget > 0
        ? (totalSpent /
            totalBudget) *
          100
        : 0;

    const overBudgetCount =
      mappedBudgets.filter(
        (budget) =>
          budget.overBudget
      ).length;

    return {
      mappedBudgets,
      totalBudget,
      totalSpent,
      totalRemaining,
      overallProgress,
      overBudgetCount,
    };
  }, [budgets, transactions]);

  const {
    mappedBudgets,
    totalBudget,
    totalSpent,
    totalRemaining,
    overallProgress,
    overBudgetCount,
  } = budgetSummary;

  const topBudgets =
    [...mappedBudgets]
      .sort(
        (first, second) =>
          second.progress -
          first.progress
      )
      .slice(0, 4);

  const safeOverallProgress =
    clampPercentage(
      overallProgress
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
              w-48
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
              mt-8
              h-56
              rounded-3xl
              bg-slate-100
              dark:bg-slate-800
            "
          />

          <div className="mt-6 space-y-3">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="
                    h-20
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
          -right-20
          -top-20
          h-56
          w-56
          rounded-full
          bg-violet-500/10
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
              <Gauge size={23} />
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
                Budget Progress
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Track limits, spending,
                and remaining balance.
              </p>
            </div>
          </div>

          <Link
            to="/budget"
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
            Manage budgets
            <ArrowRight size={16} />
          </Link>
        </div>

        {budgetError && (
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
            {budgetError}
          </div>
        )}

        {!budgetError &&
        budgets.length === 0 ? (
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
              <PiggyBank size={30} />
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
              No budgets created
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
              Create category budgets
              to control spending and
              receive progress updates.
            </p>

            <Link
              to="/budget"
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
              Create budget
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            {/* Overall summary */}

            <div
              className="
                mt-8
                grid
                gap-6
                xl:grid-cols-[220px_minmax(0,1fr)]
              "
            >
              {/* Circular progress */}

              <div
                className="
                  flex
                  items-center
                  justify-center
                  rounded-3xl
                  border
                  border-slate-200
                  bg-slate-50/70
                  p-6
                  dark:border-slate-800
                  dark:bg-slate-950/30
                "
              >
                <div
                  className="
                    relative
                    flex
                    h-44
                    w-44
                    items-center
                    justify-center
                    rounded-full
                  "
                  style={{
                    background: `conic-gradient(
                      ${
                        overallProgress >
                        100
                          ? "#ef4444"
                          : overallProgress >=
                            80
                          ? "#f59e0b"
                          : "#8b5cf6"
                      }
                      ${
                        safeOverallProgress *
                        3.6
                      }deg,
                      rgba(148, 163, 184, 0.15)
                      0deg
                    )`,
                  }}
                >
                  <div
                    className="
                      flex
                      h-36
                      w-36
                      flex-col
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      dark:bg-slate-900
                    "
                  >
                    <span
                      className={`
                        text-3xl
                        font-black
                        ${
                          overallProgress >
                          100
                            ? "text-red-500"
                            : overallProgress >=
                              80
                            ? "text-amber-500"
                            : "text-violet-500"
                        }
                      `}
                    >
                      {Math.round(
                        overallProgress
                      )}
                      %
                    </span>

                    <span
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      utilized
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary cards */}

              <div
                className="
                  grid
                  gap-4
                  sm:grid-cols-2
                "
              >
                <div
                  className="
                    rounded-2xl
                    border
                    border-blue-200
                    bg-blue-50
                    p-5
                    dark:border-blue-900
                    dark:bg-blue-950/20
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <div>
                      <p
                        className="
                          text-sm
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        Total budget
                      </p>

                      <h3
                        className="
                          mt-2
                          text-2xl
                          font-black
                          text-blue-600
                          dark:text-blue-400
                        "
                      >
                        {formatCurrency(
                          totalBudget
                        )}
                      </h3>
                    </div>

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-500/10
                        text-blue-500
                      "
                    >
                      <WalletCards
                        size={21}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="
                    rounded-2xl
                    border
                    border-red-200
                    bg-red-50
                    p-5
                    dark:border-red-900
                    dark:bg-red-950/20
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <div>
                      <p
                        className="
                          text-sm
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        Total spent
                      </p>

                      <h3
                        className="
                          mt-2
                          text-2xl
                          font-black
                          text-red-600
                          dark:text-red-400
                        "
                      >
                        {formatCurrency(
                          totalSpent
                        )}
                      </h3>
                    </div>

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-red-500/10
                        text-red-500
                      "
                    >
                      <CircleDollarSign
                        size={21}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`
                    rounded-2xl
                    border
                    p-5
                    ${
                      totalRemaining >= 0
                        ? `
                          border-emerald-200
                          bg-emerald-50
                          dark:border-emerald-900
                          dark:bg-emerald-950/20
                        `
                        : `
                          border-red-200
                          bg-red-50
                          dark:border-red-900
                          dark:bg-red-950/20
                        `
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <div>
                      <p
                        className="
                          text-sm
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        Remaining
                      </p>

                      <h3
                        className={`
                          mt-2
                          text-2xl
                          font-black
                          ${
                            totalRemaining >=
                            0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        `}
                      >
                        {formatCurrency(
                          totalRemaining
                        )}
                      </h3>
                    </div>

                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        ${
                          totalRemaining >=
                          0
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-red-500/10 text-red-500"
                        }
                      `}
                    >
                      {totalRemaining >=
                      0 ? (
                        <CheckCircle2
                          size={21}
                        />
                      ) : (
                        <AlertTriangle
                          size={21}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="
                    rounded-2xl
                    border
                    border-amber-200
                    bg-amber-50
                    p-5
                    dark:border-amber-900
                    dark:bg-amber-950/20
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <div>
                      <p
                        className="
                          text-sm
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        Over budget
                      </p>

                      <h3
                        className="
                          mt-2
                          text-2xl
                          font-black
                          text-amber-600
                          dark:text-amber-400
                        "
                      >
                        {overBudgetCount}
                      </h3>
                    </div>

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-amber-500/10
                        text-amber-500
                      "
                    >
                      <AlertTriangle
                        size={21}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category progress */}

            <div className="mt-7">
              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <div>
                  <h3
                    className="
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    Category utilization
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Highest-used budgets
                    appear first.
                  </p>
                </div>

                <span
                  className="
                    rounded-full
                    bg-slate-100
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-slate-600
                    dark:bg-slate-800
                    dark:text-slate-300
                  "
                >
                  {budgets.length}{" "}
                  {budgets.length === 1
                    ? "budget"
                    : "budgets"}
                </span>
              </div>

              <div className="space-y-4">
                {topBudgets.map(
                  (budget, index) => {
                    const safeProgress =
                      clampPercentage(
                        budget.progress
                      );

                    const progressColor =
                      budget.overBudget
                        ? "bg-red-500"
                        : budget.progress >=
                          80
                        ? "bg-amber-500"
                        : index % 2 === 0
                        ? "bg-violet-500"
                        : "bg-cyan-500";

                    return (
                      <motion.div
                        key={budget.id}
                        initial={{
                          opacity: 0,
                          y: 12,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay:
                            index * 0.07,
                        }}
                        className="
                          rounded-2xl
                          border
                          border-slate-200
                          bg-slate-50/70
                          p-4
                          dark:border-slate-800
                          dark:bg-slate-950/30
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
                            <p
                              className="
                                font-semibold
                                text-slate-900
                                dark:text-white
                              "
                            >
                              {
                                budget.category
                              }
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                              "
                            >
                              {formatCurrency(
                                budget.spent
                              )}{" "}
                              spent of{" "}
                              {formatCurrency(
                                budget.budgetAmount
                              )}
                            </p>
                          </div>

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >
                            <span
                              className={`
                                rounded-full
                                px-3
                                py-1
                                text-xs
                                font-bold
                                ${
                                  budget.overBudget
                                    ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                    : budget.progress >=
                                      80
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                }
                              `}
                            >
                              {Math.round(
                                budget.progress
                              )}
                              %
                            </span>

                            <p
                              className={`
                                text-sm
                                font-bold
                                ${
                                  budget.remaining >=
                                  0
                                    ? "text-slate-700 dark:text-slate-200"
                                    : "text-red-500"
                                }
                              `}
                            >
                              {formatCurrency(
                                budget.remaining
                              )}
                            </p>
                          </div>
                        </div>

                        <div
                          className="
                            mt-4
                            h-2.5
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
                              width: `${safeProgress}%`,
                            }}
                            transition={{
                              duration: 0.8,
                              delay:
                                index * 0.08,
                            }}
                            className={`
                              h-full
                              rounded-full
                              ${progressColor}
                            `}
                          />
                        </div>
                      </motion.div>
                    );
                  }
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default BudgetProgress;