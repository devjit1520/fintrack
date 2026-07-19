import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowDownCircle,
  ArrowRight,
  ArrowUpCircle,
  BarChart3,
  CalendarDays,
  PiggyBank,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import useFinance from "../../hooks/useFinance";
import useProfile from "../../hooks/useProfile";

/* =========================================================
   HELPERS
========================================================= */

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

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

function getCurrentDate() {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(new Date());
}

/* =========================================================
   SMALL METRIC CARD
========================================================= */

function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  iconClasses,
}) {
  return (
    <article
      className="
        group
        relative
        min-w-0
        overflow-hidden
        rounded-2xl
        border
        border-slate-200/80
        bg-white/70
        p-4
        backdrop-blur-xl
        transition
        duration-300
        hover:-translate-y-0.5
        hover:border-cyan-500/25
        hover:shadow-lg
        dark:border-white/10
        dark:bg-white/[0.035]
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-8
          -top-8
          h-20
          w-20
          rounded-full
          bg-cyan-500/5
          blur-2xl
        "
      />

      <div className="relative flex items-start gap-3">
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

        <div className="min-w-0">
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]
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
              text-lg
              font-black
              text-slate-950
              dark:text-white
            "
          >
            {value}
          </p>

          {helper && (
            <p
              className="
                mt-1
                truncate
                text-[11px]
                text-slate-500
                dark:text-slate-400
              "
            >
              {helper}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   WELCOME BANNER
========================================================= */

function WelcomeBanner({
  onAddIncome,
  onAddExpense,
}) {
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

  const contextSummary =
    finance.summary || {};

  /* =======================================================
     CALCULATE FINANCE VALUES
  ======================================================= */

  const calculatedSummary =
    useMemo(() => {
      return transactions.reduce(
        (totals, transaction) => {
          const amount =
            getSafeNumber(
              transaction.amount
            );

          if (
            transaction.type ===
            "income"
          ) {
            totals.income += amount;
          }

          if (
            transaction.type ===
            "expense"
          ) {
            totals.expense += amount;
          }

          return totals;
        },
        {
          income: 0,
          expense: 0,
        }
      );
    }, [transactions]);

  const totalIncome =
    getSafeNumber(
      contextSummary.income
    ) ||
    calculatedSummary.income;

  const totalExpense =
    getSafeNumber(
      contextSummary.expense
    ) ||
    calculatedSummary.expense;

  const summaryBalance =
    Number(
      contextSummary.balance
    );

  const balance =
    Number.isFinite(
      summaryBalance
    )
      ? summaryBalance
      : totalIncome -
        totalExpense;

  const savedAmount =
    Math.max(
      getSafeNumber(
        contextSummary.savings
      ) || balance,
      0
    );

  const savingsRate =
    totalIncome > 0
      ? Math.min(
          Math.max(
            Math.round(
              (savedAmount /
                totalIncome) *
                100
            ),
            0
          ),
          100
        )
      : 0;

  /* =======================================================
     PROFILE INFORMATION
  ======================================================= */

  const displayName =
    profile.firstName ||
    profile.name
      ?.trim()
      .split(" ")[0] ||
    "FinTrack User";

  const greeting =
    getGreeting();

  const currentDate =
    getCurrentDate();

  const financeMessage =
    balance >= 0
      ? "Your finances are moving in a positive direction."
      : "Review your recent spending and improve your balance.";

  return (
    <motion.section
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
        rounded-[32px]
        border
        border-slate-200/80
        bg-white
        shadow-xl
        shadow-slate-200/40
        dark:border-white/10
        dark:bg-[#0d172a]
        dark:shadow-black/20
      "
    >
      {/* Background effects */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-br
          from-cyan-500/[0.09]
          via-transparent
          to-violet-500/[0.1]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          -top-40
          h-96
          w-96
          rounded-full
          bg-cyan-500/10
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-48
          left-1/3
          h-96
          w-96
          rounded-full
          bg-violet-500/10
          blur-[130px]
        "
      />

      <div
        className="
          relative
          grid
          min-w-0
          gap-5
          p-5
          sm:p-6
          lg:grid-cols-[minmax(0,1.15fr)_minmax(350px,0.85fr)]
          lg:p-8
        "
      >
        {/* =================================================
            LEFT COMMAND AREA
        ================================================== */}

        <div
          className="
            flex
            min-w-0
            flex-col
            justify-between
            rounded-3xl
            border
            border-slate-200/70
            bg-white/55
            p-5
            backdrop-blur-xl
            dark:border-white/10
            dark:bg-white/[0.025]
            sm:p-6
          "
        >
          <div>
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
              <span
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-cyan-500/20
                  bg-cyan-500/10
                  px-3.5
                  py-2
                  text-xs
                  font-bold
                  text-cyan-700
                  dark:text-cyan-300
                "
              >
                <Sparkles size={14} />

                Financial command center
              </span>

              <span
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-slate-200
                  bg-white/70
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-slate-500
                  dark:border-white/10
                  dark:bg-white/[0.04]
                  dark:text-slate-400
                "
              >
                <CalendarDays
                  size={14}
                  className="text-violet-500"
                />

                {currentDate}
              </span>
            </div>

            <h1
              className="
                mt-6
                max-w-3xl
                text-3xl
                font-black
                leading-tight
                tracking-tight
                text-slate-950
                dark:text-white
                sm:text-4xl
                xl:text-5xl
              "
            >
              {greeting},{" "}

              <span
                className="
                  bg-gradient-to-r
                  from-cyan-500
                  via-blue-500
                  to-violet-500
                  bg-clip-text
                  text-transparent
                "
              >
                {displayName}
              </span>

              <span
                className="
                  ml-2
                  inline-block
                  origin-bottom
                  animate-[wave_2.5s_ease-in-out_infinite]
                "
              >
                👋
              </span>
            </h1>

            <p
              className="
                mt-4
                max-w-2xl
                text-sm
                leading-7
                text-slate-500
                dark:text-slate-400
                sm:text-base
              "
            >
              {financeMessage}
            </p>
          </div>

          {/* Quick actions */}

          <div
            className="
              mt-7
              grid
              gap-3
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            <button
              type="button"
              onClick={() =>
                onAddIncome?.()
              }
              className="
                group
                relative
                inline-flex
                min-h-13
                items-center
                justify-center
                gap-2
                overflow-hidden
                rounded-2xl
                bg-gradient-to-r
                from-emerald-500
                to-teal-500
                px-5
                py-3
                font-bold
                text-white
                shadow-lg
                shadow-emerald-500/20
                transition
                hover:-translate-y-0.5
                hover:shadow-xl
                hover:shadow-emerald-500/25
              "
            >
              <span
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/25
                  to-transparent
                  transition-transform
                  duration-700
                  group-hover:translate-x-full
                "
              />

              <ArrowUpCircle
                size={19}
                className="relative"
              />

              <span className="relative">
                Add Income
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                onAddExpense?.()
              }
              className="
                inline-flex
                min-h-13
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-slate-200
                bg-white/70
                px-5
                py-3
                font-bold
                text-slate-700
                transition
                hover:-translate-y-0.5
                hover:border-rose-500/30
                hover:bg-rose-500/[0.06]
                hover:text-rose-600
                dark:border-white/10
                dark:bg-white/[0.04]
                dark:text-slate-200
                dark:hover:text-rose-400
              "
            >
              <ArrowDownCircle
                size={19}
              />

              Add Expense
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/goals")
              }
              className="
                inline-flex
                min-h-13
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-violet-500/20
                bg-violet-500/[0.07]
                px-5
                py-3
                font-bold
                text-violet-600
                transition
                hover:-translate-y-0.5
                hover:border-violet-500/40
                hover:bg-violet-500/10
                dark:text-violet-400
                sm:col-span-2
                xl:col-span-1
              "
            >
              <Target size={19} />

              Savings Goals
            </button>
          </div>
        </div>

        {/* =================================================
            RIGHT FINANCE BENTO AREA
        ================================================== */}

        <div
          className="
            grid
            min-w-0
            gap-4
            sm:grid-cols-2
            lg:grid-cols-2
          "
        >
          {/* Main balance card */}

          <article
            className="
              relative
              min-w-0
              overflow-hidden
              rounded-3xl
              border
              border-cyan-500/20
              bg-gradient-to-br
              from-slate-950
              via-[#071426]
              to-[#082a38]
              p-5
              text-white
              shadow-xl
              shadow-cyan-950/20
              sm:col-span-2
              sm:p-6
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-16
                -top-16
                h-48
                w-48
                rounded-full
                bg-cyan-500/15
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-20
                left-1/3
                h-40
                w-40
                rounded-full
                bg-violet-500/15
                blur-3xl
              "
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
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.14em]
                      text-slate-400
                    "
                  >
                    Available balance
                  </p>

                  <p
                    className="
                      mt-3
                      break-words
                      text-3xl
                      font-black
                      tracking-tight
                      text-white
                      sm:text-4xl
                    "
                  >
                    {formatCurrency(
                      balance
                    )}
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-cyan-500/15
                    text-cyan-300
                  "
                >
                  <WalletCards
                    size={23}
                  />
                </div>
              </div>

              <div
                className="
                  mt-6
                  flex
                  items-center
                  justify-between
                  gap-4
                  border-t
                  border-white/10
                  pt-4
                "
              >
                <div>
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-slate-500
                    "
                  >
                    Savings rate
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-bold
                      text-white
                    "
                  >
                    {savingsRate}%
                  </p>
                </div>

                <div
                  className="
                    h-2
                    min-w-0
                    flex-1
                    overflow-hidden
                    rounded-full
                    bg-white/10
                  "
                >
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-cyan-400
                      via-blue-500
                      to-violet-500
                      transition-all
                      duration-700
                    "
                    style={{
                      width: `${savingsRate}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </article>

          <MetricCard
            icon={TrendingUp}
            label="Total income"
            value={formatCurrency(
              totalIncome
            )}
            helper="Money received"
            iconClasses="
              bg-emerald-500/10
              text-emerald-600
              dark:text-emerald-400
            "
          />

          <MetricCard
            icon={TrendingDown}
            label="Total expense"
            value={formatCurrency(
              totalExpense
            )}
            helper="Money spent"
            iconClasses="
              bg-rose-500/10
              text-rose-600
              dark:text-rose-400
            "
          />

          {/* Analytics link */}

          <button
            type="button"
            onClick={() =>
              navigate("/analytics")
            }
            className="
              group
              flex
              min-w-0
              items-center
              justify-between
              gap-4
              rounded-2xl
              border
              border-slate-200/80
              bg-white/70
              p-4
              text-left
              transition
              hover:-translate-y-0.5
              hover:border-cyan-500/30
              hover:shadow-lg
              dark:border-white/10
              dark:bg-white/[0.035]
              sm:col-span-2
            "
          >
            <span
              className="
                flex
                min-w-0
                items-center
                gap-3
              "
            >
              <span
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-500/10
                  text-blue-600
                  dark:text-blue-400
                "
              >
                <BarChart3 size={18} />
              </span>

              <span className="min-w-0">
                <span
                  className="
                    block
                    text-sm
                    font-bold
                    text-slate-950
                    dark:text-white
                  "
                >
                  Financial analytics
                </span>

                <span
                  className="
                    mt-1
                    block
                    truncate
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Explore reports, trends and insights
                </span>
              </span>
            </span>

            <ArrowRight
              size={18}
              className="
                shrink-0
                text-slate-400
                transition-transform
                group-hover:translate-x-1
                group-hover:text-cyan-500
              "
            />
          </button>
        </div>
      </div>
    </motion.section>
  );
}

export default WelcomeBanner;