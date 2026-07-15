import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BriefcaseBusiness,
  CalendarDays,
  CircleDollarSign,
  Coffee,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  MoreHorizontal,
  Plane,
  ReceiptText,
  ShoppingBag,
  Utensils,
  WalletCards,
  Zap,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  Link,
} from "react-router-dom";

import useFinance from "../../hooks/useFinance";

function getSafeAmount(value) {
  const amount = Number(value);

  return Number.isFinite(amount)
    ? amount
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
  ).format(getSafeAmount(value));
}

function getRelativeDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const transactionDate =
    new Date(value);

  if (
    Number.isNaN(
      transactionDate.getTime()
    )
  ) {
    return "Date unavailable";
  }

  const today = new Date();

  const currentDay =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

  const targetDay =
    new Date(
      transactionDate.getFullYear(),
      transactionDate.getMonth(),
      transactionDate.getDate()
    );

  const difference =
    currentDay.getTime() -
    targetDay.getTime();

  const dayDifference =
    Math.round(
      difference /
        (1000 * 60 * 60 * 24)
    );

  if (dayDifference === 0) {
    return "Today";
  }

  if (dayDifference === 1) {
    return "Yesterday";
  }

  if (
    dayDifference > 1 &&
    dayDifference <= 7
  ) {
    return `${dayDifference} days ago`;
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(transactionDate);
}

function getCategoryIcon(category) {
  const normalized =
    String(category || "")
      .trim()
      .toLowerCase();

  if (
    normalized.includes("food") ||
    normalized.includes("grocery")
  ) {
    return Utensils;
  }

  if (
    normalized.includes("coffee") ||
    normalized.includes("cafe")
  ) {
    return Coffee;
  }

  if (
    normalized.includes("shopping")
  ) {
    return ShoppingBag;
  }

  if (
    normalized.includes("bill") ||
    normalized.includes("utility")
  ) {
    return Zap;
  }

  if (
    normalized.includes("health") ||
    normalized.includes("medical")
  ) {
    return HeartPulse;
  }

  if (
    normalized.includes("education")
  ) {
    return GraduationCap;
  }

  if (
    normalized.includes("salary")
  ) {
    return BriefcaseBusiness;
  }

  if (
    normalized.includes("freelance") ||
    normalized.includes("business")
  ) {
    return Banknote;
  }

  if (
    normalized.includes("rent") ||
    normalized.includes("home")
  ) {
    return House;
  }

  if (
    normalized.includes("travel") ||
    normalized.includes("transport")
  ) {
    return Plane;
  }

  if (
    normalized.includes("investment")
  ) {
    return Landmark;
  }

  return CircleDollarSign;
}

function RecentTransactions() {
  const {
    transactions = [],
    loading,
    error,
  } = useFinance();

  const recentTransactions =
    [...transactions]
      .sort((first, second) => {
        const firstDate =
          new Date(
            first.createdAt ||
              first.date ||
              0
          ).getTime();

        const secondDate =
          new Date(
            second.createdAt ||
              second.date ||
              0
          ).getTime();

        return secondDate - firstDate;
      })
      .slice(0, 6);

  if (loading) {
    return (
      <section
        className="
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
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            <div
              className="
                h-7
                w-48
                animate-pulse
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
                animate-pulse
                rounded
                bg-slate-100
                dark:bg-slate-800/70
              "
            />
          </div>

          <div
            className="
              h-10
              w-24
              animate-pulse
              rounded-xl
              bg-slate-100
              dark:bg-slate-800
            "
          />
        </div>

        <div className="mt-7 space-y-4">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  rounded-2xl
                  border
                  border-slate-200
                  p-4
                  dark:border-slate-800
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >
                  <div
                    className="
                      h-12
                      w-12
                      animate-pulse
                      rounded-2xl
                      bg-slate-100
                      dark:bg-slate-800
                    "
                  />

                  <div>
                    <div
                      className="
                        h-4
                        w-36
                        animate-pulse
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
                        animate-pulse
                        rounded
                        bg-slate-100
                        dark:bg-slate-800
                      "
                    />
                  </div>
                </div>

                <div
                  className="
                    h-5
                    w-24
                    animate-pulse
                    rounded
                    bg-slate-100
                    dark:bg-slate-800
                  "
                />
              </div>
            )
          )}
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
          bg-cyan-500/10
          blur-3xl
        "
      />

      <div className="relative">
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
                bg-cyan-500/10
                text-cyan-600
                dark:text-cyan-400
              "
            >
              <WalletCards size={23} />
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
                Recent Transactions
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Your latest financial activity
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
              hover:border-cyan-400
              hover:text-cyan-600
              dark:border-slate-700
              dark:bg-slate-950/40
              dark:text-slate-200
              dark:hover:text-cyan-400
            "
          >
            View all
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
        recentTransactions.length ===
          0 && (
          <div
            className="
              mt-7
              flex
              min-h-72
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
                bg-cyan-500/10
                text-cyan-500
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
              No transactions yet
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
              Add your first income or
              expense to start building
              your financial history.
            </p>
          </div>
        )}
                {!error &&
          recentTransactions.length > 0 && (
            <div className="mt-7 space-y-3">
              {recentTransactions.map(
                (transaction, index) => {
                  const type = String(
                    transaction.type || ""
                  )
                    .trim()
                    .toLowerCase();

                  const isIncome =
                    type === "income";

                  const CategoryIcon =
                    getCategoryIcon(
                      transaction.category
                    );

                  const dateValue =
                    transaction.date ||
                    transaction.createdAt ||
                    transaction.created_at;

                  return (
                    <motion.article
                      key={transaction.id}
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
                        delay:
                          index * 0.06,
                      }}
                      whileHover={{
                        x: 4,
                      }}
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50/70
                        p-4
                        transition
                        hover:border-cyan-300
                        hover:bg-white
                        hover:shadow-lg
                        dark:border-slate-800
                        dark:bg-slate-950/30
                        dark:hover:border-slate-700
                        dark:hover:bg-slate-800/60
                      "
                    >
                      <div
                        className={`
                          pointer-events-none
                          absolute
                          -right-10
                          -top-10
                          h-24
                          w-24
                          rounded-full
                          opacity-0
                          blur-2xl
                          transition
                          group-hover:opacity-100
                          ${
                            isIncome
                              ? "bg-emerald-500/15"
                              : "bg-red-500/15"
                          }
                        `}
                      />

                      <div
                        className="
                          relative
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
                            min-w-0
                            items-center
                            gap-4
                          "
                        >
                          <div
                            className={`
                              relative
                              flex
                              h-13
                              w-13
                              shrink-0
                              items-center
                              justify-center
                              rounded-2xl
                              ${
                                isIncome
                                  ? `
                                    bg-emerald-500/10
                                    text-emerald-600
                                    dark:text-emerald-400
                                  `
                                  : `
                                    bg-red-500/10
                                    text-red-600
                                    dark:text-red-400
                                  `
                              }
                            `}
                          >
                            <CategoryIcon
                              size={22}
                            />

                            <span
                              className={`
                                absolute
                                -bottom-1
                                -right-1
                                flex
                                h-5
                                w-5
                                items-center
                                justify-center
                                rounded-full
                                border-2
                                border-white
                                text-white
                                dark:border-slate-900
                                ${
                                  isIncome
                                    ? "bg-emerald-500"
                                    : "bg-red-500"
                                }
                              `}
                            >
                              {isIncome ? (
                                <ArrowDownLeft
                                  size={11}
                                />
                              ) : (
                                <ArrowUpRight
                                  size={11}
                                />
                              )}
                            </span>
                          </div>

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
                                  max-w-[220px]
                                  truncate
                                  font-bold
                                  text-slate-900
                                  dark:text-white
                                "
                              >
                                {transaction.title ||
                                  "Untitled Transaction"}
                              </h3>

                              <span
                                className={`
                                  rounded-full
                                  px-2.5
                                  py-1
                                  text-[11px]
                                  font-bold
                                  uppercase
                                  tracking-wide
                                  ${
                                    isIncome
                                      ? `
                                        bg-emerald-500/10
                                        text-emerald-600
                                        dark:text-emerald-400
                                      `
                                      : `
                                        bg-red-500/10
                                        text-red-600
                                        dark:text-red-400
                                      `
                                  }
                                `}
                              >
                                {isIncome
                                  ? "Income"
                                  : "Expense"}
                              </span>
                            </div>

                            <div
                              className="
                                mt-2
                                flex
                                flex-wrap
                                items-center
                                gap-x-3
                                gap-y-1
                                text-xs
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
                                <CalendarDays
                                  size={13}
                                />

                                {getRelativeDate(
                                  dateValue
                                )}
                              </span>

                              <span
                                className="
                                  h-1
                                  w-1
                                  rounded-full
                                  bg-slate-300
                                  dark:bg-slate-600
                                "
                              />

                              <span
                                className="
                                  max-w-[150px]
                                  truncate
                                "
                              >
                                {transaction.category ||
                                  "Other"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            sm:justify-end
                          "
                        >
                          <div className="text-left sm:text-right">
                            <p
                              className={`
                                text-lg
                                font-black
                                tracking-tight
                                ${
                                  isIncome
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-red-600 dark:text-red-400"
                                }
                              `}
                            >
                              {isIncome
                                ? "+"
                                : "-"}
                              {formatCurrency(
                                transaction.amount
                              )}
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-slate-400
                              "
                            >
                              {new Intl.DateTimeFormat(
                                "en-IN",
                                {
                                  hour:
                                    "2-digit",
                                  minute:
                                    "2-digit",
                                }
                              ).format(
                                new Date(
                                  transaction.createdAt ||
                                    transaction.created_at ||
                                    transaction.date
                                )
                              )}
                            </p>
                          </div>

                          <button
                            type="button"
                            aria-label="More transaction options"
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-xl
                              text-slate-400
                              transition
                              hover:bg-slate-200
                              hover:text-slate-700
                              dark:hover:bg-slate-700
                              dark:hover:text-white
                            "
                          >
                            <MoreHorizontal
                              size={18}
                            />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                }
              )}
            </div>
          )}

        {!error &&
          recentTransactions.length > 0 && (
            <div
              className="
                mt-6
                flex
                flex-col
                gap-3
                rounded-2xl
                border
                border-slate-200
                bg-slate-50/70
                px-4
                py-4
                dark:border-slate-800
                dark:bg-slate-950/30
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  Showing latest{" "}
                  {recentTransactions.length}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Open transactions to view and manage all records.
                </p>
              </div>

              <Link
                to="/transactions"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-900
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-cyan-600
                  dark:bg-cyan-500
                  dark:text-slate-950
                  dark:hover:bg-cyan-400
                "
              >
                Manage Transactions
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
      </div>
    </section>
  );
}

export default RecentTransactions;