import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function IncomeExpenseChart() {
  const { summary } = useFinance();

  const data = [
    {
      name: "Income",
      amount: summary.income,
    },
    {
      name: "Expense",
      amount: summary.expense,
    },
  ];

  return (
    <Card>
      <h2 className="mb-6 text-xl font-bold text-white">
        Income vs Expense
      </h2>

      <div className="h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="name"
              stroke="#94a3b8"
            />

            <YAxis stroke="#94a3b8" />

            <Tooltip />

            <Bar
              dataKey="amount"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default IncomeExpenseChart;