import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function MonthlyTrendChart() {
  const { transactions } = useFinance();

  const monthlyData = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].map((month, index) => ({
    month,

    income: transactions
      .filter(
        (t) =>
          t.type === "income" &&
          new Date(t.date).getMonth() === index
      )
      .reduce((sum, t) => sum + Number(t.amount || 0), 0),

    expense: transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          new Date(t.date).getMonth() === index
      )
      .reduce((sum, t) => sum + Number(t.amount || 0), 0),
  }));

  return (
    <Card
      className="
        bg-white
        dark:bg-slate-900
        border-slate-200
        dark:border-slate-800
      "
    >
      {/* Header */}

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Monthly Income vs Expense
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Compare your monthly income and expenses
        </p>
      </div>

      {/* Chart */}

      <div className="h-96">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart
            data={monthlyData}
            margin={{
              top: 15,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >

            {/* Gradients */}

            <defs>

              <linearGradient
                id="incomeGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#22c55e"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="#22c55e"
                  stopOpacity={0}
                />

              </linearGradient>

              <linearGradient
                id="expenseGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#ef4444"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="#ef4444"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#334155"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 13,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 13,
              }}
            />

            <Tooltip
              formatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Legend
              verticalAlign="top"
              height={40}
            />

            {/* Income Area */}

            <Area
              type="monotone"
              dataKey="income"
              fill="url(#incomeGradient)"
              stroke="none"
            />

            {/* Expense Area */}

            <Area
              type="monotone"
              dataKey="expense"
              fill="url(#expenseGradient)"
              stroke="none"
            />

            {/* Income Line */}

            <Line
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#22c55e"
              strokeWidth={4}
              animationDuration={1500}
              dot={{
                r: 5,
                fill: "#22c55e",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 8,
                fill: "#16a34a",
              }}
            />

            {/* Expense Line */}

            <Line
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#ef4444"
              strokeWidth={4}
              animationDuration={1500}
              dot={{
                r: 5,
                fill: "#ef4444",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 8,
                fill: "#dc2626",
              }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </Card>
  );
}

export default MonthlyTrendChart;