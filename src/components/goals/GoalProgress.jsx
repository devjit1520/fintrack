import { useState } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Trash2,
  Plus,
  Target,
} from "lucide-react";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import Card from "../common/Card";
import useGoal from "../../hooks/useGoal";

import EditGoalModal from "./EditGoalModal";
import AddMoneyModal from "./AddMoneyModal";

function GoalProgress() {
  const { goals, deleteGoal } = useGoal();

  const [editing, setEditing] = useState(false);
  const [addingMoney, setAddingMoney] = useState(false);

  const goal = goals?.[0];

  if (!goal) return null;

  const current = Number(goal.saved || 0);
  const target = Number(goal.target || 0);

  const percentage =
    target > 0
      ? Math.min((current / target) * 100, 100)
      : 0;

  const remaining = Math.max(target - current, 0);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl">

          {/* Background Glow */}
          <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

          {/* Header */}
          <div className="relative flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-cyan-500/20 p-3">
                <Target
                  size={28}
                  className="text-cyan-400"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  {goal.title}
                </h2>

                <p className="text-slate-500">
                 Recent New Goal Progress
                </p>
              </div>

            </div>

            <div className="flex gap-2">

              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setAddingMoney(true)}
                className="rounded-xl bg-green-500/20 p-3 text-green-400"
              >
                <Plus size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setEditing(true)}
                className="rounded-xl bg-blue-500/20 p-3 text-blue-400"
              >
                <Pencil size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => {
                  if (
                    window.confirm(
                      "Delete this goal?"
                    )
                  ) {
                    deleteGoal(goal.id);
                  }
                }}
                className="rounded-xl bg-red-500/20 p-3 text-red-400"
              >
                <Trash2 size={18} />
              </motion.button>

            </div>

          </div>

          {/* Content */}
          <div className="mt-10 grid gap-10 lg:grid-cols-2">

            {/* Circle */}
            <div className="mx-auto w-48">

              <CircularProgressbar
                value={percentage}
                text={`${percentage.toFixed(0)}%`}
                styles={buildStyles({
                  pathColor: "#06b6d4",
                  trailColor: "#1e293b",
                  textColor: "#ffffff",
                })}
              />

            </div>

            {/* Details */}
            <div className="space-y-6">

              <div className="grid grid-cols-2 gap-6">

                <div>

                  <p className="text-slate-400">
                    Saved
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-green-400">
                    ₹{current.toLocaleString()}
                  </h3>

                </div>

                <div>

                  <p className="text-slate-400">
                    Target
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-cyan-400">
                    ₹{target.toLocaleString()}
                  </h3>

                </div>

                <div>

                  <p className="text-slate-400">
                    Remaining
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-red-400">
                    ₹{remaining.toLocaleString()}
                  </h3>

                </div>

                <div>

                  <p className="text-slate-400">
                    Completion
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-yellow-400">
                    {percentage.toFixed(1)}%
                  </h3>

                </div>

              </div>

              {/* Progress */}
              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-slate-400">
                    Progress
                  </span>

                  <span className="text-white">
                    {percentage.toFixed(0)}%
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-800">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${percentage}%`,
                    }}
                    transition={{
                      duration: 1,
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
                  />

                </div>

              </div>

              {percentage >= 100 && (

                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="rounded-2xl bg-green-500/20 p-4 text-center font-bold text-green-400"
                >
                  🎉 Congratulations! Goal Achieved
                </motion.div>

              )}

            </div>

          </div>

        </Card>
      </motion.div>

      <EditGoalModal
        open={editing}
        goal={goal}
        onClose={() => setEditing(false)}
      />

      <AddMoneyModal
        open={addingMoney}
        goal={goal}
        onClose={() => setAddingMoney(false)}
      />
    </>
  );
}

export default GoalProgress;