import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#ef4444",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
];

function ExpensePieChart() {
  const { transactions } = useFinance();

  const expenses = transactions.filter(
    (item) => item.type === "expense"
  );

  const grouped = {};

  expenses.forEach((item) => {
    grouped[item.category] =
      (grouped[item.category] || 0) +
      Number(item.amount);
  });

  const data = Object.keys(grouped).map((key) => ({
    name: key,
    value: grouped[key],
  }));

  return (
    <Card>
      <h2 className="mb-6 text-2xl font-bold text-white">
        Expenses by Category
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={110}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default ExpensePieChart;