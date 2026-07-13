import { motion } from "framer-motion";
import { Target, Trophy } from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function SavingsGoal() {
  const { summary } = useFinance();

  // Temporary Goal
  // Later we'll connect this to GoalContext
  const goal = 100000;

  const savings = summary.savings;

  const progress = Math.min(
    (savings / goal) * 100,
    100
  );

  const remaining = Math.max(goal - savings, 0);

  return (
    <Card
      className="
        bg-white
        dark:bg-slate-900
        border-slate-200
        dark:border-slate-800
      "
    >
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-2xl bg-blue-100 p-3 dark:bg-blue-500/20">
            <Target
              size={24}
              className="text-blue-600 dark:text-blue-400"
            />
          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Savings Goal
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Track your progress toward your target
            </p>

          </div>

        </div>

        {progress >= 100 && (
          <Trophy
            size={30}
            className="text-yellow-500"
          />
        )}

      </div>

      <div className="mt-8 flex items-end justify-between">

        <div>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Saved
          </p>

          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
            ₹{savings.toLocaleString()}
          </h3>

        </div>

        <div className="text-right">

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Target
          </p>

          <h3 className="text-2xl font-bold text-cyan-500">
            ₹{goal.toLocaleString()}
          </h3>

        </div>

      </div>

      <div className="mt-8 h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">

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
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-cyan-500
            via-blue-500
            to-indigo-500
          "
        />

      </div>

      <div className="mt-5 flex items-center justify-between">

        <span className="font-semibold text-cyan-500">
          {progress.toFixed(1)}% Complete
        </span>

        <span className="text-sm text-slate-600 dark:text-slate-400">
          ₹{remaining.toLocaleString()} Remaining
        </span>

      </div>

      {progress >= 100 && (
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-6 rounded-2xl bg-green-100 p-4 text-center font-semibold text-green-700 dark:bg-green-500/20 dark:text-green-400"
        >
          🎉 Congratulations! You've achieved your savings goal.
        </motion.div>
      )}
    </Card>
  );
}

export default SavingsGoal;