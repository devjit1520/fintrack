import { useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { Pencil, Trash2 } from "lucide-react";

import Card from "../common/Card";
import useBudget from "../../hooks/useBudget";
import useFinance from "../../hooks/useFinance";

import EditBudgetModal from "./EditBudgetModal";

function BudgetCard({ budget }) {
  const { deleteBudget } = useBudget();
  const { transactions } = useFinance();

  const [editing, setEditing] = useState(false);

  // Calculate spent amount
  const spent = transactions
    .filter(
      (item) =>
        item.type === "expense" &&
        item.category === budget.category
    )
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const remaining = budget.amount - spent;

  const progress =
    budget.amount > 0
      ? Math.min((spent / budget.amount) * 100, 100)
      : 0;

  // Progress color
  const progressColor =
    progress >= 100
      ? "#ef4444"
      : progress >= 80
      ? "#f59e0b"
      : "#06b6d4";

  // Date calculations
  const today = new Date();

  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const remainingDays = Math.max(
    daysInMonth - today.getDate(),
    1
  );

  const dailyBudget =
    remaining > 0
      ? remaining / remainingDays
      : 0;

  const status =
    progress >= 100
      ? "Over Budget"
      : progress >= 80
      ? "Warning"
      : "On Track";

  const statusColor =
    progress >= 100
      ? "bg-red-500/20 text-red-400"
      : progress >= 80
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-green-500/20 text-green-400";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          y: -5,
          scale: 1.01,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <Card className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">

          {/* Background Glow */}
          <div className="absolute -top-24 -right-24 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="absolute -bottom-24 -left-24 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />

          {/* Header */}
          <div className="relative flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-white">
                {budget.category}
              </h2>

              <p className="text-slate-400">
                Monthly Budget
              </p>
            </div>

            <div className="flex gap-2">

              <motion.button
                whileHover={{
                  scale: 1.1,
                  rotate: 10,
                }}
                onClick={() => setEditing(true)}
                className="rounded-xl bg-blue-500/20 p-3 text-blue-400"
              >
                <Pencil size={18} />
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.1,
                  rotate: -10,
                }}
                onClick={() => {
                  if (
                    window.confirm(
                      "Delete this budget?"
                    )
                  ) {
                    deleteBudget(budget.id);
                  }
                }}
                className="rounded-xl bg-red-500/20 p-3 text-red-400"
              >
                <Trash2 size={18} />
              </motion.button>

            </div>

          </div>

          {/* Main Content */}
          <div className="relative mt-8 grid gap-8 lg:grid-cols-4">

            {/* Circle */}
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-cyan-500 text-white">
  {progress.toFixed(0)}%
</div>

            {/* Stats */}
            <div className="lg:col-span-3">

              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">

                <div>

                  <p className="text-slate-400">
                    Budget
                  </p>

                  {/* <h3 className="mt-2 text-xl font-bold text-green-400">
                    ₹
                    <CountUp
                      end={budget.amount}
                      separator=","
                    />
                  </h3> */}
                  <h3 className="mt-2 text-xl font-bold text-green-400">
  ₹{budget.amount.toLocaleString("en-IN")}
</h3>

                </div>

                <div>

                  <p className="text-slate-400">
                    Spent
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-green-400">
  ₹{budget.amount.toLocaleString("en-IN")}
</h3>

                </div>

                <div>

                  <p className="text-slate-400">
                    Remaining
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-green-400">
  ₹{budget.amount.toLocaleString("en-IN")}
</h3>

                </div>

                <div>

                  <p className="text-slate-400">
                    Daily Limit
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-green-400">
  ₹{budget.amount.toLocaleString("en-IN")}
</h3>

                </div>

              </div>

              {/* Progress */}
              <div className="mt-8">

                <div className="mb-2 flex justify-between text-sm">

                  <span className="text-slate-400">
                    Spending Progress
                  </span>

                  <span className="text-white">
                    {progress.toFixed(0)}%
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-800">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${progress}%`,
                    }}
                    transition={{
                      duration: 1,
                    }}
                    className="h-full rounded-full"
                    style={{
                      background: progressColor,
                    }}
                  />

                </div>

              </div>

              {/* Footer */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">

                <motion.span
                  whileHover={{
                    scale: 1.05,
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${statusColor}`}
                >
                  {status}
                </motion.span>

                <p className="text-slate-400">
                  {remainingDays} days remaining
                </p>

              </div>

            </div>

          </div>

        </Card>
      </motion.div>

      <EditBudgetModal
        open={editing}
        budget={budget}
        onClose={() => setEditing(false)}
      />
    </>
  );
}

export default BudgetCard;