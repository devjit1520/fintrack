import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function MonthlyTrendChart() {
  const { transactions } = useFinance();

  const monthlyData = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ].map((month, index) => ({
    month,
    expense: transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          new Date(t.date).getMonth() === index
      )
      .reduce((sum, t) => sum + Number(t.amount), 0),
  }));

  return (
    <Card>
      <h2 className="mb-6 text-xl font-bold text-white">
        Monthly Expense Trend
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="month"
              stroke="#94a3b8"
            />

            <YAxis stroke="#94a3b8" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="expense"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default MonthlyTrendChart;