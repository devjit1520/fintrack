import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Pencil,
  Trash2,
  Plus,
  Calendar,
  CheckCircle2,
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

  const saved = Number(goal.saved || 0);
  const target = Number(goal.target || 0);

  const progress =
    target > 0
      ? Math.min((saved / target) * 100, 100)
      : 0;

  const remaining = Math.max(target - saved, 0);

  const deadline = goal.deadline
    ? new Date(goal.deadline)
    : null;

  const today = new Date();

  const daysLeft = deadline
    ? Math.ceil(
        (deadline - today) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
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
          {/* Background Glow */}

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          {/* Header */}

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">

              <div className="rounded-3xl bg-cyan-500/10 p-4">

                <Target
                  size={34}
                  className="text-cyan-500"
                />

              </div>

              <div>

                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {goal.title}
                </h2>

                <p className="text-slate-500 dark:text-slate-400">
                  Keep saving every month 🚀
                </p>

              </div>

            </div>

            {/* Buttons */}

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setAddingMoney(true)
                }
                className="rounded-xl bg-green-500 p-3 text-white transition hover:scale-105"
              >
                <Plus size={18} />
              </button>

              <button
                onClick={() =>
                  setEditing(true)
                }
                className="rounded-xl bg-blue-500 p-3 text-white transition hover:scale-105"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Delete Goal?"
                    )
                  ) {
                    deleteGoal(goal.id);
                  }
                }}
                className="rounded-xl bg-red-500 p-3 text-white transition hover:scale-105"
              >
                <Trash2 size={18} />
              </button>

            </div>

          </div>

          {/* Body */}

          <div className="mt-12 grid gap-12 lg:grid-cols-[260px,1fr]">

            {/* Circle */}

            <div className="mx-auto w-56">

              <CircularProgressbar
                value={progress}
                text={`${progress.toFixed(0)}%`}
                styles={buildStyles({
                  pathColor:
                    progress >= 100
                      ? "#22c55e"
                      : "#06b6d4",

                  trailColor: "#1e293b",

                  textColor:
                    document.documentElement.classList.contains(
                      "dark"
                    )
                      ? "#fff"
                      : "#0f172a",

                  pathTransitionDuration: 1,
                })}
              />

            </div>

            {/* Details */}

            <div>

              <div className="grid gap-6 sm:grid-cols-2">

                <div className="rounded-2xl bg-green-500/10 p-5">

                  <p className="text-slate-500">
                    Saved
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-green-500">
                    ₹{saved.toLocaleString()}
                  </h3>

                </div>

                <div className="rounded-2xl bg-cyan-500/10 p-5">

                  <p className="text-slate-500">
                    Target
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-cyan-500">
                    ₹{target.toLocaleString()}
                  </h3>

                </div>

                <div className="rounded-2xl bg-red-500/10 p-5">

                  <p className="text-slate-500">
                    Remaining
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-red-500">
                    ₹{remaining.toLocaleString()}
                  </h3>

                </div>

                <div className="rounded-2xl bg-yellow-500/10 p-5">

                  <p className="text-slate-500">
                    Completion
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-yellow-500">
                    {progress.toFixed(1)}%
                  </h3>

                </div>

              </div>

              {/* Deadline */}

              {deadline && (

                <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-800">

                  <Calendar className="text-cyan-500" />

                  <div>

                    <p className="text-sm text-slate-500">
                      Deadline
                    </p>

                    <p className="font-semibold text-slate-900 dark:text-white">
                      {deadline.toLocaleDateString()}
                    </p>

                  </div>

                  <div className="ml-auto rounded-xl bg-cyan-500/10 px-4 py-2 font-semibold text-cyan-500">
                    {daysLeft} Days Left
                  </div>

                </div>

              )}

              {/* Progress */}

              <div className="mt-8">

                <div className="mb-2 flex justify-between">

                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    Goal Progress
                  </span>

                  <span className="font-bold text-slate-900 dark:text-white">
                    {progress.toFixed(0)}%
                  </span>

                </div>

                <div className="h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">

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

              {/* Success */}

              {progress >= 100 && (

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="mt-8 flex items-center gap-3 rounded-2xl bg-green-500/10 p-5 text-green-500"
                >

                  <CheckCircle2 size={30} />

                  <div>

                    <h3 className="font-bold">
                      Goal Achieved!
                    </h3>

                    <p>
                      Congratulations on reaching your financial goal.
                    </p>

                  </div>

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