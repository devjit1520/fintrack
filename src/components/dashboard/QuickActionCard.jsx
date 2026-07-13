import { motion } from "framer-motion";
import Card from "../common/Card";

function QuickActionCard({
  title,
  description,
  icon: Icon,
  color,
  bg,
  iconColor,
  onClick,
}) {
  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      whileTap={{
        scale: 0.98,
      }}
    >
      <Card
        onClick={onClick}
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
          className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${color} opacity-10 blur-3xl`}
        />

        <div className="relative flex items-center gap-5">

          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl ${bg}`}
          >
            <Icon
              size={30}
              className={iconColor}
            />
          </div>

          <div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h3>

            {description && (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {description}
              </p>
            )}

          </div>

        </div>
      </Card>
    </motion.div>
  );
}

export default QuickActionCard;