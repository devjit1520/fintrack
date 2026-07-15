import {
  useContext,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  BellRing,
  CalendarClock,
  CheckCircle2,
  Clock3,
  X,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  GoalContext,
} from "../../context/GoalContext";

/* =========================================================
   HELPERS
========================================================= */

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function getGoalId(goal, index) {
  return (
    goal?.id ??
    goal?._id ??
    goal?.goalId ??
    `${goal?.title || "goal"}-${index}`
  );
}

function getGoalTitle(goal) {
  return (
    goal?.title ||
    goal?.name ||
    "Financial Goal"
  );
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

function getGoalProgress(goal) {
  const target = getGoalTarget(goal);
  const saved = getGoalSaved(goal);

  if (target <= 0) {
    return 0;
  }

  return (saved / target) * 100;
}

function getDateAtMidnight(value) {
  if (!value) {
    return null;
  }

  const date = new Date(
    `${value}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);

  return date;
}

function getDaysRemaining(deadline) {
  const deadlineDate =
    getDateAtMidnight(deadline);

  if (!deadlineDate) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.ceil(
    (
      deadlineDate.getTime() -
      today.getTime()
    ) /
      (1000 * 60 * 60 * 24)
  );
}

function formatDate(value) {
  const date =
    getDateAtMidnight(value);

  if (!date) {
    return "No deadline";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function getAlertType(daysRemaining) {
  if (daysRemaining < 0) {
    return "overdue";
  }

  if (daysRemaining <= 7) {
    return "urgent";
  }

  if (daysRemaining <= 30) {
    return "upcoming";
  }

  return null;
}

/* =========================================================
   ALERT ITEM
========================================================= */

function GoalAlertItem({
  alert,
  index,
  onDismiss,
}) {
  const shouldReduceMotion =
    useReducedMotion();

  const isOverdue =
    alert.type === "overdue";

  const isUrgent =
    alert.type === "urgent";

  const Icon = isOverdue
    ? AlertTriangle
    : isUrgent
      ? Clock3
      : CalendarClock;

  const styles = isOverdue
    ? {
        border:
          "border-rose-500/20",
        background:
          "bg-rose-500/10",
        text:
          "text-rose-700 dark:text-rose-300",
        secondary:
          "text-rose-600/85 dark:text-rose-300/80",
        icon:
          "bg-rose-500/15 text-rose-600 dark:text-rose-400",
        progress:
          "from-rose-500 to-red-500",
      }
    : isUrgent
      ? {
          border:
            "border-amber-500/20",
          background:
            "bg-amber-500/10",
          text:
            "text-amber-700 dark:text-amber-300",
          secondary:
            "text-amber-700/85 dark:text-amber-300/80",
          icon:
            "bg-amber-500/15 text-amber-600 dark:text-amber-400",
          progress:
            "from-amber-400 to-orange-500",
        }
      : {
          border:
            "border-blue-500/20",
          background:
            "bg-blue-500/10",
          text:
            "text-blue-700 dark:text-blue-300",
          secondary:
            "text-blue-700/85 dark:text-blue-300/80",
          icon:
            "bg-blue-500/15 text-blue-600 dark:text-blue-400",
          progress:
            "from-blue-500 to-cyan-500",
        };

  const deadlineMessage = (() => {
    if (alert.daysRemaining < 0) {
      const overdueDays = Math.abs(
        alert.daysRemaining
      );

      return `${overdueDays} ${
        overdueDays === 1
          ? "day"
          : "days"
      } overdue`;
    }

    if (alert.daysRemaining === 0) {
      return "Due today";
    }

    return `${alert.daysRemaining} ${
      alert.daysRemaining === 1
        ? "day"
        : "days"
    } remaining`;
  })();

  return (
    <motion.article
      layout
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: -12,
              scale: 0.98,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.96,
        height: 0,
      }}
      transition={{
        duration: 0.3,
        delay: Math.min(
          index * 0.05,
          0.2
        ),
      }}
      className={[
        "relative overflow-hidden",
        "rounded-2xl border p-4",
        styles.border,
        styles.background,
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "flex size-10 shrink-0",
            "items-center justify-center",
            "rounded-xl",
            styles.icon,
          ].join(" ")}
        >
          <Icon size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className={[
                  "truncate text-sm font-bold",
                  styles.text,
                ].join(" ")}
              >
                {alert.title}
              </h3>

              <p
                className={[
                  "mt-1 text-xs leading-5",
                  styles.secondary,
                ].join(" ")}
              >
                {deadlineMessage}. Deadline:{" "}
                {formatDate(
                  alert.deadline
                )}.
              </p>
            </div>

            <button
              type="button"
              aria-label={`Dismiss ${alert.title} alert`}
              onClick={() =>
                onDismiss(alert.id)
              }
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-950/30 dark:hover:text-white"
            >
              <X size={15} />
            </button>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between gap-3 text-[11px] font-semibold">
              <span className={styles.text}>
                {alert.progress.toFixed(1)}%
                saved
              </span>

              <span className="text-slate-500 dark:text-slate-400">
                ₹
                {alert.saved.toLocaleString(
                  "en-IN"
                )}{" "}
                of ₹
                {alert.target.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/60 dark:bg-slate-950/30">
              <motion.div
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        width: 0,
                      }
                }
                animate={{
                  width: `${Math.min(
                    Math.max(
                      alert.progress,
                      0
                    ),
                    100
                  )}%`,
                }}
                transition={{
                  duration: 0.65,
                  delay: Math.min(
                    index * 0.05,
                    0.2
                  ),
                }}
                className={[
                  "h-full rounded-full",
                  "bg-gradient-to-r",
                  styles.progress,
                ].join(" ")}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

function GoalDeadlineAlerts() {
  const goalContext =
    useContext(GoalContext) || {};

  const {
    goals: rawGoals = [],
  } = goalContext;

  const goals = Array.isArray(rawGoals)
    ? rawGoals
    : [];

  const [
    dismissedIds,
    setDismissedIds,
  ] = useState([]);

  const alerts = useMemo(() => {
    return goals
      .map((goal, index) => {
        const target =
          getGoalTarget(goal);

        const saved =
          getGoalSaved(goal);

        const progress =
          getGoalProgress(goal);

        const explicitStatus = String(
          goal?.status || ""
        ).toLowerCase();

        const isCompleted =
          explicitStatus ===
            "completed" ||
          progress >= 100;

        if (
          isCompleted ||
          !goal?.deadline
        ) {
          return null;
        }

        const daysRemaining =
          getDaysRemaining(
            goal.deadline
          );

        if (
          daysRemaining === null
        ) {
          return null;
        }

        const type =
          getAlertType(
            daysRemaining
          );

        if (!type) {
          return null;
        }

        return {
          id: getGoalId(
            goal,
            index
          ),
          title:
            getGoalTitle(goal),
          deadline:
            goal.deadline,
          target,
          saved,
          progress,
          daysRemaining,
          type,
        };
      })
      .filter(Boolean)
      .sort((first, second) => {
        if (
          first.daysRemaining !==
          second.daysRemaining
        ) {
          return (
            first.daysRemaining -
            second.daysRemaining
          );
        }

        return (
          first.progress -
          second.progress
        );
      });
  }, [goals]);

  const visibleAlerts =
    alerts.filter(
      (alert) =>
        !dismissedIds.includes(
          alert.id
        )
    );

  const overdueCount =
    visibleAlerts.filter(
      (alert) =>
        alert.type === "overdue"
    ).length;

  const urgentCount =
    visibleAlerts.filter(
      (alert) =>
        alert.type === "urgent"
    ).length;

  const upcomingCount =
    visibleAlerts.filter(
      (alert) =>
        alert.type === "upcoming"
    ).length;

  const handleDismiss = (
    alertId
  ) => {
    setDismissedIds((previous) =>
      previous.includes(alertId)
        ? previous
        : [
            ...previous,
            alertId,
          ]
    );
  };

  const handleDismissAll = () => {
    setDismissedIds(
      alerts.map(
        (alert) => alert.id
      )
    );
  };

  if (
    visibleAlerts.length === 0
  ) {
    return null;
  }

  return (
    <section className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <BellRing size={21} />
            </div>

            <div className="min-w-0">
              <h2 className="section-title">
                Goal Deadline Alerts
              </h2>

              <p className="section-description">
                Review overdue goals and
                milestones due within the
                next 30 days.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismissAll}
            className="inline-flex h-9 w-fit items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Dismiss all
          </button>
        </div>

        {/* Alert totals */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle size={16} />

              <span className="text-xs font-bold uppercase tracking-wide">
                Overdue
              </span>
            </div>

            <p className="mt-2 text-2xl font-black text-rose-700 dark:text-rose-300">
              {overdueCount}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Clock3 size={16} />

              <span className="text-xs font-bold uppercase tracking-wide">
                Due soon
              </span>
            </div>

            <p className="mt-2 text-2xl font-black text-amber-700 dark:text-amber-300">
              {urgentCount}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <CalendarClock size={16} />

              <span className="text-xs font-bold uppercase tracking-wide">
                Upcoming
              </span>
            </div>

            <p className="mt-2 text-2xl font-black text-blue-700 dark:text-blue-300">
              {upcomingCount}
            </p>
          </div>
        </div>

        {/* Alert cards */}
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <AnimatePresence initial={false}>
            {visibleAlerts.map(
              (alert, index) => (
                <GoalAlertItem
                  key={alert.id}
                  alert={alert}
                  index={index}
                  onDismiss={
                    handleDismiss
                  }
                />
              )
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <CheckCircle2
            size={14}
            className="text-emerald-500"
          />

          Completed goals are excluded from
          deadline warnings.
        </div>
      </div>
    </section>
  );
}

export default GoalDeadlineAlerts;