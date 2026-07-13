import { useState } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Trash2,
  Calendar,
  Target,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import Card from "../common/Card";
import useGoal from "../../hooks/useGoal";
import EditGoalModal from "./EditGoalModal";

function GoalCard({ goal }) {
  const { deleteGoal } = useGoal();

  const [editing, setEditing] = useState(false);

  const title = goal.name || goal.title || "Untitled Goal";

  const target =
    Number(
      goal.targetAmount ||
        goal.target ||
        goal.amount ||
        0
    );

  const saved =
    Number(
      goal.savedAmount ||
        goal.saved ||
        0
    );

  const progress =
    target > 0
      ? Math.min((saved / target) * 100, 100)
      : 0;

  const remaining = Math.max(target - saved, 0);

  const daysLeft = goal.deadline
    ? Math.max(
        0,
        Math.ceil(
          (new Date(goal.deadline) -
            new Date()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null;

  const status =
    progress >= 100
      ? "Completed"
      : progress >= 60
      ? "On Track"
      : "Needs Attention";

  return (
    <>
      <motion.div
        whileHover={{
          y: -5,
        }}
      >
        <Card
          className="
          relative
          overflow-hidden
          bg-white
          dark:bg-slate-900
          border-slate-200
          dark:border-slate-800
        "
        >
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

          {/* Header */}

          <div className="relative flex items-start justify-between">

            <div className="flex gap-4">

              <div className="rounded-2xl bg-cyan-500/20 p-4">
                <Target
                  size={28}
                  className="text-cyan-500"
                />
              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {title}
                </h2>

                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  {goal.category || "Savings Goal"}
                </p>

              </div>

            </div>

            <div className="flex gap-2">

              <button
                onClick={() => setEditing(true)}
                className="rounded-xl bg-blue-500/10 p-3 text-blue-500 transition hover:scale-110"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Delete this goal?"
                    )
                  ) {
                    deleteGoal(goal.id);
                  }
                }}
                className="rounded-xl bg-red-500/10 p-3 text-red-500 transition hover:scale-110"
              >
                <Trash2 size={18} />
              </button>

            </div>

          </div>

          {/* Stats */}

          <div className="mt-8 grid grid-cols-3 gap-5">

            <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">

              <p className="text-sm text-slate-500">
                Saved
              </p>

              <h3 className="mt-2 text-2xl font-bold text-green-500">
                ₹{saved.toLocaleString()}
              </h3>

            </div>

            <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">

              <p className="text-sm text-slate-500">
                Target
              </p>

              <h3 className="mt-2 text-2xl font-bold text-cyan-500">
                ₹{target.toLocaleString()}
              </h3>

            </div>

            <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">

              <p className="text-sm text-slate-500">
                Remaining
              </p>

              <h3 className="mt-2 text-2xl font-bold text-red-500">
                ₹{remaining.toLocaleString()}
              </h3>

            </div>

          </div>

          {/* Progress */}

          <div className="mt-8">

            <div className="mb-3 flex justify-between">

              <span className="font-medium text-slate-500">
                Progress
              </span>

              <span className="font-bold text-cyan-500">
                {progress.toFixed(1)}%
              </span>

            </div>

            <div className="h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">

              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  duration: 1,
                }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
              />

            </div>

          </div>

          {/* Footer */}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">

            {progress >= 100 ? (
              <div className="flex items-center gap-2 rounded-full bg-green-500/15 px-4 py-2 text-green-500">

                <CheckCircle2 size={18} />

                Goal Completed

              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-full bg-yellow-500/15 px-4 py-2 text-yellow-500">

                <Calendar size={18} />

                {daysLeft ?? "--"} Days Left

              </div>
            )}

            <div
              className={`rounded-full px-4 py-2 font-semibold ${
                progress >= 100
                  ? "bg-green-500/15 text-green-500"
                  : progress >= 60
                  ? "bg-cyan-500/15 text-cyan-500"
                  : "bg-red-500/15 text-red-500"
              }`}
            >
              <TrendingUp
                size={16}
                className="mr-2 inline"
              />
              {status}
            </div>

          </div>

        </Card>
      </motion.div>

      <EditGoalModal
        open={editing}
        goal={goal}
        onClose={() =>
          setEditing(false)
        }
      />
    </>
  );
}

export default GoalCard;