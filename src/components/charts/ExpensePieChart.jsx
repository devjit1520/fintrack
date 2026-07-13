import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

const COLORS = [
  "#06B6D4",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
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
          Expense by Category
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Breakdown of your expenses
        </p>

      </div>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

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
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                color: "#94a3b8",
                fontSize: "13px",
              }}
            />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </Card>
  );
}

export default ExpensePieChart;