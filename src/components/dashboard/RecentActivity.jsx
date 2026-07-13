import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Activity,
} from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function RecentActivity() {
  const { transactions } = useFinance();

  const recent = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.date) -
        new Date(a.createdAt || a.date)
    )
    .slice(0, 6);

  return (
    <Card
      className="
        bg-white
        dark:bg-slate-900
        border-slate-200
        dark:border-slate-800
      "
    >
      {/* Header */}

      <div className="mb-8 flex items-center gap-3">

        <div className="rounded-xl bg-cyan-100 p-3 dark:bg-cyan-500/20">
          <Activity
            size={22}
            className="text-cyan-600 dark:text-cyan-400"
          />
        </div>

        <div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Recent Activity
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your latest financial updates
          </p>

        </div>

      </div>

      {recent.length === 0 ? (
        <div className="py-12 text-center">

          <p className="text-slate-500 dark:text-slate-400">
            No recent activity available.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {recent.map((item, index) => (

            <motion.div
              key={item.id}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
              }}
              whileHover={{
                x: 6,
              }}
              className="
                flex
                items-center
                justify-between

                rounded-2xl

                border
                border-slate-200
                dark:border-slate-800

                bg-slate-50
                dark:bg-slate-800/40

                p-4

                transition-all
              "
            >

              {/* Left */}

              <div className="flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    item.type === "income"
                      ? "bg-green-100 dark:bg-green-500/20"
                      : "bg-red-100 dark:bg-red-500/20"
                  }`}
                >

                  {item.type === "income" ? (
                    <ArrowDownLeft
                      size={22}
                      className="text-green-500"
                    />
                  ) : (
                    <ArrowUpRight
                      size={22}
                      className="text-red-500"
                    />
                  )}

                </div>

                <div>

                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.category}
                  </p>

                </div>

              </div>

              {/* Right */}

              <div className="text-right">

                <p
                  className={`text-lg font-bold ${
                    item.type === "income"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item.type === "income" ? "+" : "-"}₹
                  {Number(item.amount).toLocaleString("en-IN")}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(item.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

              </div>

            </motion.div>

          ))}

        </div>
      )}
    </Card>
  );
}

export default RecentActivity;