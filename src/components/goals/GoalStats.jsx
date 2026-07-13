import { motion } from "framer-motion";
import {
  Target,
  PiggyBank,
  Wallet,
  Trophy,
} from "lucide-react";

import Card from "../common/Card";
import useGoal from "../../hooks/useGoal";

function GoalStats() {
  const { goals } = useGoal();

  const totalGoals = goals.length;

  const totalTarget = goals.reduce(
    (sum, goal) =>
      sum +
      Number(
        goal.targetAmount ||
          goal.target ||
          goal.amount ||
          0
      ),
    0
  );

  const totalSaved = goals.reduce(
    (sum, goal) =>
      sum +
      Number(
        goal.savedAmount ||
          goal.saved ||
          0
      ),
    0
  );

  const completion =
    totalTarget > 0
      ? ((totalSaved / totalTarget) * 100).toFixed(1)
      : 0;

  const cards = [
    {
      title: "Total Goals",
      value: totalGoals,
      icon: Target,
      color: "from-cyan-500 to-blue-600",
      text: "text-cyan-500",
      suffix: "",
    },
    {
      title: "Target Amount",
      value: totalTarget.toLocaleString("en-IN"),
      icon: Wallet,
      color: "from-green-500 to-emerald-600",
      text: "text-green-500",
      suffix: "₹",
    },
    {
      title: "Saved Amount",
      value: totalSaved.toLocaleString("en-IN"),
      icon: PiggyBank,
      color: "from-yellow-500 to-orange-500",
      text: "text-yellow-500",
      suffix: "₹",
    },
    {
      title: "Completion",
      value: completion,
      icon: Trophy,
      color: "from-purple-500 to-pink-500",
      text: "text-purple-500",
      suffix: "%",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.1,
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
              {/* Glow */}
              <div
                className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-r ${card.color} opacity-10 blur-3xl`}
              />

              <div className="relative flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {card.title}
                  </p>

                  <h2
                    className={`mt-4 text-3xl font-bold ${card.text}`}
                  >
                    {card.suffix === "₹" && "₹"}
                    {card.value}
                    {card.suffix === "%" && "%"}
                  </h2>

                </div>

                <div
                  className={`rounded-2xl bg-gradient-to-r ${card.color} p-4 shadow-lg`}
                >
                  <Icon
                    size={30}
                    className="text-white"
                  />
                </div>

              </div>

              {card.title !== "Completion" && (
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">

                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width:
                        card.title === "Saved Amount"
                          ? `${completion}%`
                          : "100%",
                    }}
                    transition={{
                      duration: 1,
                    }}
                    className={`h-full rounded-full bg-gradient-to-r ${card.color}`}
                  />
                  

                </div>
              )}

            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

export default GoalStats;