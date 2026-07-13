import { motion } from "framer-motion";
import { Target } from "lucide-react";

import Card from "../common/Card";
import useGoal from "../../hooks/useGoal";
import GoalCard from "./GoalCard";

function GoalList() {
  const { goals } = useGoal();

  if (!goals || goals.length === 0) {
    return (
      <Card className="overflow-hidden">

        <div className="flex flex-col items-center justify-center py-20">

          <div className="mb-6 rounded-full bg-cyan-500/20 p-6">
            <Target
              size={55}
              className="text-cyan-400"
            />
          </div>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            No Goals Yet
          </h2>

          <p className="mt-3 max-w-md text-center text-slate-500 dark:text-slate-400">
            Start planning your financial future by creating
            your first savings goal.
          </p>

        </div>

      </Card>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Your Goals
          </h2>

          <p className="text-slate-500 dark:text-slate-400">
            {goals.length} Active Goal
            {goals.length > 1 ? "s" : ""}
          </p>

        </div>

      </div>

      <div className="grid gap-6">

        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.08,
            }}
          >
            <GoalCard goal={goal} />
          </motion.div>
        ))}

      </div>

    </div>
  );
}

export default GoalList;