import {
  useId,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowRight,
  CalendarRange,
  CircleDollarSign,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
   * This prevents timezone conversion from moving the
   * transaction into the previous month.
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

function getLongMonthLabel(date) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  ).format(date);
}

function createMonthlyData(
  transactions,
  numberOfMonths
) {
  const currentDate = new Date();

  const months = Array.from(
    {
      length: numberOfMonths,
    },
    (_, index) => {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() -
          (numberOfMonths - 1 - index),
        1
      );

      return {
        key: getMonthKey(date),
        date,
        month: getMonthLabel(date),
        fullMonth:
          getLongMonthLabel(date),
        income: 0,
        expense: 0,
        net: 0,
        transactions: 0,
      };
    }
  );

  const monthlyMap = new Map(
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

      const monthRecord =
        monthlyMap.get(
          getMonthKey(
            transactionDate
          )
        );

      if (!monthRecord) {
        return;
      }

      const amount =
        getSafeNumber(
          transaction.amount
        );

      const type = String(
        transaction.type || ""
      ).toLowerCase();

      monthRecord.transactions += 1;

      if (type === "income") {
        monthRecord.income += amount;
      }

      if (type === "expense") {
        monthRecord.expense += amount;
      }
    }
  );

  return months.map((month) => ({
    ...month,

    net:
      month.income -
      month.expense,
  }));
}

function formatCompactValue(value) {
  const number =
    getSafeNumber(value);

  if (
    Math.abs(number) >= 10000000
  ) {
    return `${(
      number / 10000000
    ).toFixed(1)}Cr`;
  }

  if (
    Math.abs(number) >= 100000
  ) {
    return `${(
      number / 100000
    ).toFixed(1)}L`;
  }

  if (
    Math.abs(number) >= 1000
  ) {
    return `${(
      number / 1000
    ).toFixed(1)}K`;
  }

  return number.toLocaleString(
    "en-IN"
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconClasses,
  valueClasses,
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
          {title}
        </p>

        <p
          className={`
            mt-1
            truncate
            text-xl
            font-black
            ${valueClasses}
          `}
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
          {description}
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

function ChartTooltip({
  active,
  payload,
  label,
  formatCurrency,
}) {
  if (
    !active ||
    !payload?.length
  ) {
    return null;
  }

  const data =
    payload[0]?.payload || {};

  return (
    <div
      className="
        min-w-52
        rounded-2xl
        border
        border-white/10
        bg-slate-950/95
        p-4
        text-white
        shadow-2xl
        backdrop-blur-xl
      "
    >
      <p
        className="
          text-xs
          font-black
          text-white
        "
      >
        {data.fullMonth || label}
      </p>

      <div className="mt-3 space-y-2">
        <div
          className="
            flex
            items-center
            justify-between
            gap-5
            text-xs
          "
        >
          <span
            className="
              flex
              items-center
              gap-2
              text-slate-400
            "
          >
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-emerald-400
              "
            />

            Income
          </span>

          <strong className="text-emerald-300">
            {formatCurrency(
              data.income
            )}
          </strong>
        </div>

        <div
          className="
            flex
            items-center
            justify-between
            gap-5
            text-xs
          "
        >
          <span
            className="
              flex
              items-center
              gap-2
              text-slate-400
            "
          >
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-rose-400
              "
            />

            Expense
          </span>

          <strong className="text-rose-300">
            {formatCurrency(
              data.expense
            )}
          </strong>
        </div>

        <div
          className="
            flex
            items-center
            justify-between
            gap-5
            border-t
            border-white/10
            pt-2
            text-xs
          "
        >
          <span className="text-slate-400">
            Net balance
          </span>

          <strong
            className={
              data.net >= 0
                ? "text-cyan-300"
                : "text-rose-300"
            }
          >
            {formatCurrency(
              data.net
            )}
          </strong>
        </div>
      </div>

      <p
        className="
          mt-3
          text-[10px]
          text-slate-500
        "
      >
        {data.transactions}{" "}
        {data.transactions === 1
          ? "transaction"
          : "transactions"}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyTrendState({
  onAddTransaction,
}) {
  return (
    <div
      className="
        mt-5
        flex
        min-h-[280px]
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
          bg-cyan-500/10
          text-cyan-600
          dark:text-cyan-400
        "
      >
        <TrendingUp size={28} />
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
        No monthly activity yet
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
        Add an income or expense transaction to generate your monthly
        cash-flow report.
      </p>

      <button
        type="button"
        onClick={onAddTransaction}
        className="
          mt-5
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-cyan-500
          px-4
          py-2.5
          text-xs
          font-bold
          text-white
          transition
          hover:bg-cyan-400
        "
      >
        Add transaction

        <ArrowRight size={15} />
      </button>
    </div>
  );
}

/* =========================================================
   MONTHLY TREND CHART
========================================================= */

function MonthlyTrendChart() {
  const navigate =
    useNavigate();

  const generatedId =
    useId().replace(
      /:/g,
      ""
    );

  const [
    selectedPeriod,
    setSelectedPeriod,
  ] = useState(6);

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

  const monthlyData =
    useMemo(
      () =>
        createMonthlyData(
          transactions,
          selectedPeriod
        ),
      [
        transactions,
        selectedPeriod,
      ]
    );

  const hasTrendData =
    monthlyData.some(
      (month) =>
        month.income > 0 ||
        month.expense > 0
    );

  const currentMonth =
    monthlyData[
      monthlyData.length - 1
    ] || {
      income: 0,
      expense: 0,
      net: 0,
    };

  const totals =
    useMemo(() => {
      return monthlyData.reduce(
        (result, month) => {
          result.income +=
            month.income;

          result.expense +=
            month.expense;

          result.transactions +=
            month.transactions;

          return result;
        },
        {
          income: 0,
          expense: 0,
          transactions: 0,
        }
      );
    }, [monthlyData]);

  const totalNet =
    totals.income -
    totals.expense;

  const bestMonth =
    useMemo(() => {
      return monthlyData.reduce(
        (best, month) =>
          month.net > best.net
            ? month
            : best,
        monthlyData[0] || {
          net: 0,
          fullMonth: "No data",
        }
      );
    }, [monthlyData]);

  const largestExpenseMonth =
    useMemo(() => {
      return monthlyData.reduce(
        (largest, month) =>
          month.expense >
          largest.expense
            ? month
            : largest,
        monthlyData[0] || {
          expense: 0,
          fullMonth: "No data",
        }
      );
    }, [monthlyData]);

  const incomeGradientId =
    `income-${generatedId}`;

  const expenseGradientId =
    `expense-${generatedId}`;

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
      {/* Background glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-72
          w-72
          rounded-full
          bg-blue-500/[0.07]
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
                bg-blue-500/10
                text-blue-600
                dark:text-blue-400
              "
            >
              <TrendingUp size={20} />
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
                Monthly Cash Flow
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
                Compare income, expenses and net balance across each month.
              </p>
            </div>
          </div>

          <div
            className="
              inline-flex
              w-fit
              rounded-xl
              border
              border-slate-200
              bg-slate-100
              p-1
              dark:border-white/10
              dark:bg-white/[0.035]
            "
          >
            {[6, 12].map(
              (period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() =>
                    setSelectedPeriod(
                      period
                    )
                  }
                  className={`
                    rounded-lg
                    px-3.5
                    py-2
                    text-xs
                    font-bold
                    transition
                    ${
                      selectedPeriod ===
                      period
                        ? `
                          bg-white
                          text-cyan-600
                          shadow-sm
                          dark:bg-slate-800
                          dark:text-cyan-400
                        `
                        : `
                          text-slate-500
                          hover:text-slate-900
                          dark:text-slate-400
                          dark:hover:text-white
                        `
                    }
                  `}
                >
                  {period}M
                </button>
              )
            )}
          </div>
        </div>

        {!hasTrendData ? (
          <EmptyTrendState
            onAddTransaction={() =>
              navigate(
                "/transactions"
              )
            }
          />
        ) : (
          <>
            {/* Current-month summary */}

            <div
              className="
                mt-5
                grid
                min-w-0
                gap-3
                sm:grid-cols-3
              "
            >
              <SummaryCard
                title="Current Income"
                value={formatCurrency(
                  currentMonth.income
                )}
                description="Income this month"
                icon={TrendingUp}
                iconClasses="
                  bg-emerald-500/10
                  text-emerald-600
                  dark:text-emerald-400
                "
                valueClasses="
                  text-emerald-600
                  dark:text-emerald-400
                "
              />

              <SummaryCard
                title="Current Expenses"
                value={formatCurrency(
                  currentMonth.expense
                )}
                description="Expenses this month"
                icon={ReceiptText}
                iconClasses="
                  bg-rose-500/10
                  text-rose-600
                  dark:text-rose-400
                "
                valueClasses="
                  text-rose-600
                  dark:text-rose-400
                "
              />

              <SummaryCard
                title="Current Net"
                value={formatCurrency(
                  currentMonth.net
                )}
                description="Monthly cash flow"
                icon={WalletCards}
                iconClasses="
                  bg-cyan-500/10
                  text-cyan-600
                  dark:text-cyan-400
                "
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

            {/* Chart */}

            <div
              className="
                mt-4
                rounded-3xl
                border
                border-slate-200/80
                bg-slate-50/65
                p-3
                dark:border-white/[0.08]
                dark:bg-white/[0.02]
                sm:p-4
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
                    Cash-flow movement
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Last {selectedPeriod} months
                  </p>
                </div>

                <div
                  className="
                    flex
                    flex-wrap
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
                        bg-cyan-500
                      "
                    />

                    Net
                  </span>
                </div>
              </div>

              <div
                className="
                  mt-4
                  h-[300px]
                  w-full
                  sm:h-[340px]
                "
              >
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <ComposedChart
                    data={monthlyData}
                    margin={{
                      top: 12,
                      right: 10,
                      left: -12,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id={incomeGradientId}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#10b981"
                          stopOpacity={0.28}
                        />

                        <stop
                          offset="100%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>

                      <linearGradient
                        id={expenseGradientId}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#f43f5e"
                          stopOpacity={0.22}
                        />

                        <stop
                          offset="100%"
                          stopColor="#f43f5e"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 6"
                      vertical={false}
                      stroke="rgba(148,163,184,0.18)"
                    />

                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#94a3b8",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                      dy={8}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#94a3b8",
                        fontSize: 10,
                      }}
                      tickFormatter={
                        formatCompactValue
                      }
                      width={58}
                    />

                    <Tooltip
                      cursor={{
                        stroke:
                          "rgba(6,182,212,0.25)",
                        strokeWidth: 1,
                        strokeDasharray:
                          "5 5",
                      }}
                      content={(
                        tooltipProps
                      ) => (
                        <ChartTooltip
                          {...tooltipProps}
                          formatCurrency={
                            formatCurrency
                          }
                        />
                      )}
                    />

                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fill={`url(#${incomeGradientId})`}
                      dot={false}
                      activeDot={{
                        r: 5,
                        strokeWidth: 2,
                        stroke: "#052e2b",
                        fill: "#34d399",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="expense"
                      stroke="#f43f5e"
                      strokeWidth={2.5}
                      fill={`url(#${expenseGradientId})`}
                      dot={false}
                      activeDot={{
                        r: 5,
                        strokeWidth: 2,
                        stroke: "#4c0519",
                        fill: "#fb7185",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="net"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      dot={{
                        r: 3,
                        fill: "#06b6d4",
                        strokeWidth: 0,
                      }}
                      activeDot={{
                        r: 6,
                        fill: "#22d3ee",
                        stroke: "#083344",
                        strokeWidth: 2,
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom report */}

            <div
              className="
                mt-4
                grid
                min-w-0
                gap-3
                sm:grid-cols-3
              "
            >
              <div
                className="
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
                  className="
                    flex
                    items-center
                    gap-2
                    text-cyan-600
                    dark:text-cyan-400
                  "
                >
                  <CircleDollarSign
                    size={16}
                  />

                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wide
                    "
                  >
                    Period Net
                  </p>
                </div>

                <p
                  className={`
                    mt-2
                    text-lg
                    font-black
                    ${
                      totalNet >= 0
                        ? `
                          text-slate-950
                          dark:text-white
                        `
                        : `
                          text-rose-600
                          dark:text-rose-400
                        `
                    }
                  `}
                >
                  {formatCurrency(
                    totalNet
                  )}
                </p>
              </div>

              <div
                className="
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
                  className="
                    flex
                    items-center
                    gap-2
                    text-emerald-600
                    dark:text-emerald-400
                  "
                >
                  <TrendingUp size={16} />

                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wide
                    "
                  >
                    Best Month
                  </p>
                </div>

                <p
                  className="
                    mt-2
                    truncate
                    text-sm
                    font-black
                    text-slate-950
                    dark:text-white
                  "
                >
                  {bestMonth.fullMonth}
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Net{" "}
                  {formatCurrency(
                    bestMonth.net
                  )}
                </p>
              </div>

              <div
                className="
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
                  className="
                    flex
                    items-center
                    gap-2
                    text-rose-600
                    dark:text-rose-400
                  "
                >
                  <TrendingDown
                    size={16}
                  />

                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wide
                    "
                  >
                    Highest Spending
                  </p>
                </div>

                <p
                  className="
                    mt-2
                    truncate
                    text-sm
                    font-black
                    text-slate-950
                    dark:text-white
                  "
                >
                  {
                    largestExpenseMonth.fullMonth
                  }
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {formatCurrency(
                    largestExpenseMonth.expense
                  )}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default MonthlyTrendChart;