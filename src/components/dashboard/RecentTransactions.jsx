 import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function RecentTransactions() {
  const { transactions } = useFinance();

  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.date) -
        new Date(a.createdAt || a.date)
    )
    .slice(0, 5);

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

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Recent Transactions
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Latest financial activity
          </p>

        </div>

        <Link
          to="/transactions"
          className="
            rounded-xl
            bg-blue-600
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-blue-700
          "
        >
          View All
        </Link>

      </div>

      {recentTransactions.length === 0 ? (
        <div className="py-16 text-center">

          <p className="text-slate-500 dark:text-slate-400">
            No transactions found.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {recentTransactions.map((item, index) => (

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
                scale: 1.02,
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
                      className="text-green-500"
                      size={22}
                    />
                  ) : (
                    <ArrowUpRight
                      className="text-red-500"
                      size={22}
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
                  {new Date(item.date).toLocaleDateString()}
                </p>

              </div>

            </motion.div>

          ))}

        </div>
      )}
    </Card>
  );
}

export default RecentTransactions;