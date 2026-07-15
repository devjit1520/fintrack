import { useMemo } from "react";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  ReceiptText,
  ShoppingBag,
} from "lucide-react";

import useFinance from "../../hooks/useFinance";

const CHART_COLORS = [
  "#06b6d4",
  "#8b5cf6",
  "#f97316",
  "#ef4444",
  "#22c55e",
  "#3b82f6",
  "#ec4899",
  "#eab308",
];

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

function CustomTooltip({
  active,
  payload,
}) {
  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }

  const item =
    payload[0]?.payload;

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        px-4
        py-3
        shadow-2xl
        dark:border-slate-700
        dark:bg-slate-900
      "
    >
      <p
        className="
          font-bold
          text-slate-900
          dark:text-white
        "
      >
        {item.name}
      </p>

      <p
        className="
          mt-1
          text-sm
          text-slate-500
          dark:text-slate-400
        "
      >
        {formatCurrency(
          item.value
        )}
      </p>

      <p
        className="
          mt-1
          text-xs
          text-slate-400
        "
      >
        {item.percentage}% of expenses
      </p>
    </div>
  );
}

function ExpenseByCategory() {
  const {
    transactions = [],
    loading,
    error,
  } = useFinance();

  const {
    chartData,
    totalExpense,
  } = useMemo(() => {
    const categoryTotals = {};

    transactions.forEach(
      (transaction) => {
        const type = String(
          transaction.type || ""
        )
          .trim()
          .toLowerCase();

        if (type !== "expense") {
          return;
        }

        const amount =
          getSafeAmount(
            transaction.amount
          );

        if (amount <= 0) {
          return;
        }

        const category =
          transaction.category?.trim() ||
          "Other";

        categoryTotals[category] =
          (categoryTotals[category] ||
            0) + amount;
      }
    );

    const total =
      Object.values(
        categoryTotals
      ).reduce(
        (sum, amount) =>
          sum + amount,
        0
      );

    const data = Object.entries(
      categoryTotals
    )
      .map(
        ([category, amount]) => ({
          name: category,
          value: amount,
          percentage:
            total > 0
              ? Math.round(
                  (amount / total) *
                    100
                )
              : 0,
        })
      )
      .sort(
        (first, second) =>
          second.value -
          first.value
      );

    return {
      chartData: data,
      totalExpense: total,
    };
  }, [transactions]);

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
              w-64
              rounded
              bg-slate-100
              dark:bg-slate-800/70
            "
          />

          <div
            className="
              mt-8
              h-80
              rounded-3xl
              bg-slate-100
              dark:bg-slate-800
            "
          />
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
          bg-red-500/10
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
                bg-red-500/10
                text-red-600
                dark:text-red-400
              "
            >
              <ShoppingBag size={23} />
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
                Expense by Category
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Understand where your money goes.
              </p>
            </div>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-right
              dark:border-red-900
              dark:bg-red-950/30
            "
          >
            <p
              className="
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              Total expense
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
                totalExpense
              )}
            </p>
          </div>
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
        chartData.length === 0 ? (
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
                bg-red-500/10
                text-red-500
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
              No expense data yet
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
              Add an expense transaction to see the category breakdown.
            </p>
          </div>
        ) : (
          <div
            className="
              mt-8
              grid
              gap-8
              lg:grid-cols-[minmax(0,1fr)_240px]
            "
          >
            <div className="relative h-80">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={78}
                    outerRadius={112}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {chartData.map(
                      (
                        entry,
                        index
                      ) => (
                        <Cell
                          key={entry.name}
                          fill={
                            CHART_COLORS[
                              index %
                                CHART_COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    content={
                      <CustomTooltip />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  flex
                  flex-col
                  items-center
                  justify-center
                "
              >
                <p
                  className="
                    text-xs
                    font-medium
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Total spent
                </p>

                <p
                  className="
                    mt-2
                    text-2xl
                    font-black
                    text-slate-950
                    dark:text-white
                  "
                >
                  {formatCurrency(
                    totalExpense
                  )}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-400
                  "
                >
                  {chartData.length}{" "}
                  {chartData.length === 1
                    ? "category"
                    : "categories"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {chartData.map(
                (item, index) => (
                  <div
                    key={item.name}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50/70
                      px-4
                      py-3
                      transition
                      hover:border-slate-300
                      hover:bg-white
                      dark:border-slate-800
                      dark:bg-slate-950/30
                      dark:hover:bg-slate-800/60
                    "
                  >
                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                      "
                    >
                      <span
                        className="
                          h-3
                          w-3
                          shrink-0
                          rounded-full
                        "
                        style={{
                          backgroundColor:
                            CHART_COLORS[
                              index %
                                CHART_COLORS.length
                            ],
                        }}
                      />

                      <div className="min-w-0">
                        <p
                          className="
                            truncate
                            text-sm
                            font-semibold
                            text-slate-800
                            dark:text-slate-200
                          "
                        >
                          {item.name}
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-500
                          "
                        >
                          {item.percentage}%
                        </p>
                      </div>
                    </div>

                    <p
                      className="
                        shrink-0
                        text-sm
                        font-black
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {formatCurrency(
                        item.value
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ExpenseByCategory;