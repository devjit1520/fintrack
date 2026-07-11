import { motion } from "framer-motion";
import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#14B8A6",
];

function CategoryPieChart() {
  const { transactions } = useFinance();

  const expenses = transactions.filter(
    (t) => t.type === "expense"
  );

  const categoryMap = {};

  expenses.forEach((item) => {
    const category = item.category || "Other";

    categoryMap[category] =
      (categoryMap[category] || 0) +
      Number(item.amount);
  });

  const chartData = Object.keys(categoryMap).map(
    (key) => ({
      name: key,
      value: categoryMap[key],
    })
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Expenses by Category
        </h2>

        {chartData.length === 0 ? (
          <div className="flex h-[350px] items-center justify-center">
            <p className="text-slate-400">
              No expense data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                innerRadius={65}
                paddingAngle={4}
                label={({ percent }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 12,
                }}
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>
    </motion.div>
  );
}

export default CategoryPieChart;