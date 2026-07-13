import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function IncomeExpenseChart() {
  const { summary } = useFinance();

  const data = [
    {
      name: "Income",
      amount: summary.income,
      color: "#10b981",
    },
    {
      name: "Expense",
      amount: summary.expense,
      color: "#ef4444",
    },
  ];

  return (
    <Card
      className="
        bg-white
        dark:bg-slate-900

        border-slate-200
        dark:border-slate-800
      "
    >
      <div className="mb-6">

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Income vs Expense
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Compare your total income and expenses
        </p>

      </div>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              stroke="#334155"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="name"
              tick={{
                fill: "#94a3b8",
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#94a3b8",
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
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

            <Bar
              dataKey="amount"
              radius={[12, 12, 0, 0]}
              animationDuration={1200}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                />
              ))}
            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>
    </Card>
  );
}

export default IncomeExpenseChart;