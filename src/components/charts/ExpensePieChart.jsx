import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

function ExpensePieChart() {
  const { transactions } = useFinance();

  const data = transactions
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => {
      const existing = acc.find(
        (x) => x.name === item.category
      );

      if (existing) {
        existing.value += Number(item.amount);
      } else {
        acc.push({
          name: item.category,
          value: Number(item.amount),
        });
      }

      return acc;
    }, []);

  return (
    <Card>
      <h2 className="mb-6 text-xl font-bold">
        Expense by Category
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[index % COLORS.length]
                  }
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