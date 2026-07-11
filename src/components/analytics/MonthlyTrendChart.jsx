import { motion } from "framer-motion";
import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

function MonthlyTrendChart() {
  const { transactions } = useFinance();

  const months = [
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
  ];

  const chartData = months.map((month, index) => {
    const income = transactions
      .filter((t) => {
        const d = new Date(t.date);
        return (
          d.getMonth() === index &&
          t.type === "income"
        );
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => {
        const d = new Date(t.date);
        return (
          d.getMonth() === index &&
          t.type === "expense"
        );
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      month,
      income,
      expense,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Monthly Trend
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="month"
              stroke="#94a3b8"
            />

            <YAxis stroke="#94a3b8" />

            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: 12,
              }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={4}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />

            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={4}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}

export default MonthlyTrendChart;