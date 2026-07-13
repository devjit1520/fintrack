import { motion } from "framer-motion";
import {
  Target,
  Plus,
  Trophy,
} from "lucide-react";

function GoalsHeader({
  onAdd,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        relative
        overflow-hidden
        rounded-3xl

        border
        border-slate-200
        dark:border-slate-800

        bg-white
        dark:bg-slate-900

        p-8
        shadow-xl
      "
    >
      {/* Background Glow */}

      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div className="flex items-center gap-5">

          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center

              rounded-3xl

              bg-gradient-to-r
              from-cyan-500
              to-blue-600

              shadow-lg
            "
          >
            <Target
              size={40}
              className="text-white"
            />
          </div>

          <div>

            <div className="flex items-center gap-3">

              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Financial Goals
              </h1>

              <span
                className="
                  rounded-full

                  bg-green-500/20

                  px-3
                  py-1

                  text-xs
                  font-semibold

                  text-green-500
                "
              >
                Active
              </span>

            </div>

            <p className="mt-3 max-w-xl text-slate-500 dark:text-slate-400">
              Stay focused on your financial journey by
              tracking and managing every savings goal in
              one place.
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex gap-4">

          <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            className="
              flex
              items-center
              gap-2

              rounded-2xl

              bg-amber-500/10

              px-5
              py-3

              font-semibold

              text-amber-500
            "
          >
            <Trophy size={20} />

            Achievements

          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={onAdd}
            className="
              flex
              items-center
              gap-2

              rounded-2xl

              bg-gradient-to-r
              from-cyan-500
              to-blue-600

              px-6
              py-3

              font-semibold
              text-white

              shadow-lg
            "
          >
            <Plus size={20} />

            Add Goal

          </motion.button>

        </div>

      </div>

    </motion.div>
  );
}

export default GoalsHeader;