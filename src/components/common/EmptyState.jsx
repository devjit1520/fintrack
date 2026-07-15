import {
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  Inbox,
  Plus,
} from "lucide-react";

import Button from "./Button";

function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description = "There is currently no data available.",
  actionLabel = "",
  onAction,
  actionIcon = Plus,
  className = "",
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 14,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={[
        "flex min-h-[320px] flex-col",
        "items-center justify-center",
        "rounded-3xl border border-dashed",
        "border-slate-300 bg-slate-50/60",
        "px-6 py-12 text-center",
        "dark:border-slate-700",
        "dark:bg-slate-900/30",
        className,
      ].join(" ")}
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: [0, -5, 0],
              }
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex size-20 items-center justify-center rounded-3xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-500"
      >
        <div className="absolute inset-2 rounded-2xl bg-cyan-500/5" />

        <Icon
          size={32}
          strokeWidth={1.8}
          className="relative"
        />
      </motion.div>

      <h3 className="mt-6 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          className="mt-6"
          leftIcon={actionIcon}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}

export default EmptyState;