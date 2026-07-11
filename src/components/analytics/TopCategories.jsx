import { motion } from "framer-motion";
import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";
// import CountUp from "react-countup";
import { Trophy } from "lucide-react";

function TopCategories() {
  const { transactions } = useFinance();

  const expenses = transactions.filter(
    (t) => t.type === "expense"
  );

  const categoryTotals = {};

  expenses.forEach((item) => {
    categoryTotals[item.category] =
      (categoryTotals[item.category] || 0) +
      Number(item.amount);
  });

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const totalExpense = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">

        <div className="mb-8 flex items-center gap-3">

          <Trophy
            className="text-yellow-400"
            size={28}
          />

          <h2 className="text-2xl font-bold text-white">
            Top Spending Categories
          </h2>

        </div>

        {data.length === 0 ? (
          <div className="flex h-72 items-center justify-center">
            <p className="text-slate-400">
              No expense data available.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {data.map((item, index) => {

              const percent =
                totalExpense > 0
                  ? (item.value / totalExpense) * 100
                  : 0;

              return (
                <motion.div
                  key={item.name}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                >

                  <div className="mb-2 flex items-center justify-between">

                    <div>

                      <h3 className="font-semibold text-white">
                        {item.name}
                      </h3>

                      <p className="text-sm text-slate-400">
                        {percent.toFixed(1)}%
                        {" "}of expenses
                      </p>

                    </div>

                    <div className="text-right">

                      <h3 className="text-lg font-bold text-cyan-400">
  ₹{item.value.toLocaleString("en-IN")}
</h3>

                      {index === 0 && (
                        <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400">
                          Highest
                        </span>
                      )}

                    </div>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-800">

                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${percent}%`,
                      }}
                      transition={{
                        duration: 1,
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
                    />

                  </div>

                </motion.div>
              );
            })}

          </div>
        )}

      </Card>
    </motion.div>
  );
}

export default TopCategories;