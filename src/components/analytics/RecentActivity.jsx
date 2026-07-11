import { motion } from "framer-motion";
import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";
import {
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

function RecentActivity() {
  const { transactions } = useFinance();

  const recent = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    )
    .slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Recent Activity
        </h2>

        {recent.length === 0 ? (
          <p className="text-slate-400">
            No transactions yet.
          </p>
        ) : (
          <div className="space-y-4">
            {recent.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-slate-800/40 p-4"
              >
                <div className="flex items-center gap-4">
                  {item.type === "income" ? (
                    <ArrowUpCircle className="text-green-400" />
                  ) : (
                    <ArrowDownCircle className="text-red-400" />
                  )}

                  <div>
                    <h3 className="font-semibold text-white">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-400">
                      {item.category}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <h3
                    className={`font-bold ${
                      item.type === "income"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"}₹
                    {Number(item.amount).toLocaleString()}
                  </h3>

                  <p className="text-xs text-slate-400">
                    {item.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}

export default RecentActivity;