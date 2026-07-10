import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function IncomeExpenseChart() {
  const { summary } = useFinance();

  const data = [
    {
      name: "Finance",
      Income: summary.income,
      Expense: summary.expense,
    },
  ];

  return (
    <Card>
      <h2 className="mb-6 text-2xl font-bold text-white">
        Income vs Expense
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#334155" />

            <XAxis dataKey="name" stroke="#94a3b8" />

            <YAxis stroke="#94a3b8" />

            <Tooltip />

            <Bar
              dataKey="Income"
              fill="#22c55e"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="Expense"
              fill="#ef4444"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default IncomeExpenseChart;