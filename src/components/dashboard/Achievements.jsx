import { motion } from "framer-motion";
import {
  Trophy,
  Lock,
  CheckCircle2,
} from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function Achievements() {
  const { transactions } = useFinance();

  const badges = [
    {
      title: "First Transaction",
      description: "Add your first transaction.",
      unlocked: transactions.length >= 1,
    },
    {
      title: "10 Transactions",
      description: "Complete 10 transactions.",
      unlocked: transactions.length >= 10,
    },
    {
      title: "50 Transactions",
      description: "Become a finance master with 50 transactions.",
      unlocked: transactions.length >= 50,
    },
  ];

  return (
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
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-yellow-500/20 blur-3xl" />

      <div className="relative">

        {/* Header */}

        <div className="mb-8 flex items-center gap-4">

          <div className="rounded-2xl bg-yellow-100 p-3 dark:bg-yellow-500/20">
            <Trophy
              size={26}
              className="text-yellow-600 dark:text-yellow-400"
            />
          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Achievements
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Unlock milestones as you manage your finances.
            </p>

          </div>

        </div>

        {/* Achievement List */}

        <div className="space-y-4">

          {badges.map((badge, index) => (

            <motion.div
              key={badge.title}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
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
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className={`rounded-xl p-3 ${
                    badge.unlocked
                      ? "bg-green-100 dark:bg-green-500/20"
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  {badge.unlocked ? (
                    <CheckCircle2
                      size={22}
                      className="text-green-500"
                    />
                  ) : (
                    <Lock
                      size={22}
                      className="text-slate-500"
                    />
                  )}
                </div>

                <div>

                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {badge.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {badge.description}
                  </p>

                </div>

              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  badge.unlocked
                    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                    : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                }`}
              >
                {badge.unlocked
                  ? "Unlocked"
                  : "Locked"}
              </span>

            </motion.div>

          ))}

        </div>

      </div>
    </Card>
  );
}

export default Achievements;