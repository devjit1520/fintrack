import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Pencil,
  PiggyBank,
  Plus,
  Target,
  Trash2,
} from "lucide-react";

/* =========================================================
   HELPERS
========================================================= */

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function getGoalTarget(goal) {
  return getSafeNumber(
    goal?.targetAmount ??
      goal?.amount ??
      goal?.target
  );
}

function getGoalSaved(goal) {
  return getSafeNumber(
    goal?.savedAmount ??
      goal?.saved ??
      goal?.currentAmount
  );
}

function getTimestamp(value) {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(getSafeNumber(value));
}

function formatDate(value) {
  if (!value) {
    return "No deadline";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No deadline";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getDaysRemaining(deadline) {
  const deadlineTimestamp =
    getTimestamp(deadline);

  if (!deadlineTimestamp) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(
    deadlineTimestamp
  );

  targetDate.setHours(0, 0, 0, 0);

  return Math.ceil(
    (
      targetDate.getTime() -
      today.getTime()
    ) /
      (1000 * 60 * 60 * 24)
  );
}

function getGoalStatus({
  progress,
  deadline,
  explicitStatus,
}) {
  if (
    String(explicitStatus || "")
      .toLowerCase() === "completed" ||
    progress >= 100
  ) {
    return {
      key: "completed",
      label: "Completed",
      icon: CheckCircle2,
      badgeClass:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      iconClass:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      progressClass:
        "from-emerald-500 to-teal-500",
    };
  }

  const daysRemaining =
    getDaysRemaining(deadline);

  if (
    daysRemaining !== null &&
    daysRemaining < 0
  ) {
    return {
      key: "overdue",
      label: "Overdue",
      icon: AlertTriangle,
      badgeClass:
        "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400",
      iconClass:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      progressClass:
        "from-rose-500 to-red-500",
    };
  }

  if (progress >= 75) {
    return {
      key: "almost-complete",
      label: "Almost there",
      icon: PiggyBank,
      badgeClass:
        "border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      iconClass:
        "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      progressClass:
        "from-cyan-500 to-blue-500",
    };
  }

  return {
    key: "active",
    label: "Active",
    icon: Target,
    badgeClass:
      "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400",
    iconClass:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    progressClass:
      "from-violet-500 to-purple-500",
  };
}

/* =========================================================
   COMPONENT
========================================================= */

function GoalCard({
  goal,
  index = 0,
  onEdit,
  onContribute,
  onDelete,
  deleting = false,
}) {
  const shouldReduceMotion =
    useReducedMotion();

  const target = getGoalTarget(goal);
  const saved = getGoalSaved(goal);

  const remaining = Math.max(
    target - saved,
    0
  );

  const progress =
    target > 0
      ? (saved / target) * 100
      : 0;

  const progressWidth = Math.min(
    Math.max(progress, 0),
    100
  );

  const daysRemaining =
    getDaysRemaining(goal?.deadline);

  const status = getGoalStatus({
    progress,
    deadline: goal?.deadline,
    explicitStatus: goal?.status,
  });

  const StatusIcon = status.icon;

  const title =
    goal?.title ||
    goal?.name ||
    "Financial Goal";

  const description =
    goal?.description ||
    goal?.note ||
    "";

  const isCompleted =
    status.key === "completed";

  const deadlineText = (() => {
    if (isCompleted) {
      return "Goal completed";
    }

    if (daysRemaining === null) {
      return "No deadline";
    }

    if (daysRemaining < 0) {
      const overdueDays =
        Math.abs(daysRemaining);

      return `${overdueDays} ${
        overdueDays === 1
          ? "day"
          : "days"
      } overdue`;
    }

    if (daysRemaining === 0) {
      return "Due today";
    }

    return `${daysRemaining} ${
      daysRemaining === 1
        ? "day"
        : "days"
    } remaining`;
  })();

  return (
    <motion.article
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 18,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -4,
            }
      }
      transition={{
        duration: 0.36,
        delay: Math.min(
          index * 0.05,
          0.3
        ),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={[
                "flex size-12 shrink-0",
                "items-center justify-center",
                "rounded-2xl",
                status.iconClass,
              ].join(" ")}
            >
              <Target
                size={23}
                strokeWidth={1.9}
              />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-black tracking-tight text-slate-950 dark:text-white">
                {title}
              </h3>

              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                <CalendarClock
                  size={13}
                  className="shrink-0"
                />

                <span className="truncate">
                  {formatDate(
                    goal?.deadline
                  )}
                </span>
              </p>
            </div>
          </div>

          <span
            className={[
              "inline-flex shrink-0",
              "items-center gap-1.5",
              "rounded-full border",
              "px-2.5 py-1",
              "text-[11px] font-bold",
              status.badgeClass,
            ].join(" ")}
          >
            <StatusIcon size={13} />

            {status.label}
          </span>
        </div>

        {/* Description */}
        {description && (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}

        {/* Target */}
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Savings target
          </p>

          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {formatCurrency(target)}
          </p>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Goal progress
            </span>

            <span
              className={[
                "text-sm font-black",
                isCompleted
                  ? "text-emerald-600 dark:text-emerald-400"
                  : status.key === "overdue"
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-violet-600 dark:text-violet-400",
              ].join(" ")}
            >
              {progress.toFixed(1)}%
            </span>
          </div>

          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      width: 0,
                    }
              }
              animate={{
                width: `${progressWidth}%`,
              }}
              transition={{
                duration: 0.75,
                delay: Math.min(
                  index * 0.05,
                  0.3
                ),
                ease: [0.22, 1, 0.36, 1],
              }}
              className={[
                "h-full rounded-full",
                "bg-gradient-to-r",
                status.progressClass,
              ].join(" ")}
            />
          </div>

          <p
            className={[
              "mt-3 flex items-center gap-1.5",
              "text-xs font-semibold",
              status.key === "overdue"
                ? "text-rose-600 dark:text-rose-400"
                : isCompleted
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-500 dark:text-slate-400",
            ].join(" ")}
          >
            <CalendarClock size={14} />

            {deadlineText}
          </p>
        </div>

        {/* Amount breakdown */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/30">
            <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400">
              <PiggyBank size={14} />

              <p className="text-[11px] font-bold uppercase tracking-wide">
                Saved
              </p>
            </div>

            <p className="mt-2 truncate text-sm font-black text-violet-600 dark:text-violet-400">
              {formatCurrency(saved)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/30">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <CircleDollarSign size={14} />

              <p className="text-[11px] font-bold uppercase tracking-wide">
                Remaining
              </p>
            </div>

            <p
              className={[
                "mt-2 truncate text-sm",
                "font-black",
                remaining === 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400",
              ].join(" ")}
            >
              {formatCurrency(remaining)}
            </p>
          </div>
        </div>

        {/* Contribution */}
        <button
          type="button"
          disabled={isCompleted}
          onClick={() =>
            onContribute?.(goal)
          }
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/15 transition hover:from-emerald-400 hover:to-teal-400 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500 disabled:opacity-60 dark:disabled:from-slate-700 dark:disabled:to-slate-700"
        >
          {isCompleted ? (
            <>
              <CheckCircle2 size={17} />
              Goal Completed
            </>
          ) : (
            <>
              <Plus size={17} />
              Add Savings
            </>
          )}
        </button>

        {/* Actions */}
        <div className="mt-4 flex gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
          <button
            type="button"
            onClick={() =>
              onEdit?.(goal)
            }
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 text-sm font-bold text-blue-600 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
          >
            <Pencil size={16} />

            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete?.(goal)
            }
            disabled={deleting}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 text-sm font-bold text-rose-600 transition hover:border-rose-500 hover:bg-rose-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400"
          >
            {deleting ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Trash2 size={16} />
            )}

            Delete
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default GoalCard;