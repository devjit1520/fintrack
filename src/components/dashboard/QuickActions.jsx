import { motion } from "framer-motion";
import {
  Download,
  Target,
} from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function QuickActions({ openGoal }) {
  const { exportCSV } = useFinance();

  const actions = [
    {
      title: "Set Savings Goal",
      description: "Create or update your financial goal",
      icon: Target,
      color:
        "from-purple-500 to-fuchsia-500",
      bg:
        "bg-purple-100 dark:bg-purple-500/20",
      iconColor:
        "text-purple-600 dark:text-purple-400",
      onClick: openGoal,
    },
    {
      title: "Export Transactions",
      description: "Download your finance data as CSV",
      icon: Download,
      color:
        "from-cyan-500 to-blue-600",
      bg:
        "bg-cyan-100 dark:bg-cyan-500/20",
      iconColor:
        "text-cyan-600 dark:text-cyan-400",
      onClick: exportCSV,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {actions.map((action, index) => {
        const Icon = action.icon;

        return (
          <motion.div
            key={action.title}
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
            whileHover={{
              y: -6,
            }}
          >
            <Card
              className="
                relative
                overflow-hidden
                cursor-pointer

                bg-white
                dark:bg-slate-900

                border-slate-200
                dark:border-slate-800
              "
            >
              {/* Glow */}
              <div
                className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${action.color} opacity-10 blur-3xl`}
              />

              <button
                onClick={action.onClick}
                className="relative flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-5">

                  <div
                    className={`rounded-2xl p-4 ${action.bg}`}
                  >
                    <Icon
                      size={28}
                      className={action.iconColor}
                    />
                  </div>

                  <div className="text-left">

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {action.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {action.description}
                    </p>

                  </div>

                </div>

              </button>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

export default QuickActions;