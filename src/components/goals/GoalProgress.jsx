import {
  useContext,
  useMemo,
} from "react";

import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Flag,
  Gauge,
  PiggyBank,
  Target,
} from "lucide-react";

import {
  GoalContext,
} from "../../context/GoalContext";

import AnimatedNumber from "../common/AnimatedNumber";
import PremiumCard from "../common/PremiumCard";

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

function getGoalProgress(goal) {
  const target = getGoalTarget(goal);
  const saved = getGoalSaved(goal);

  if (target <= 0) {
    return 0;
  }

  return (saved / target) * 100;
}

function getTimestamp(value) {
  if (!value) {
    return 0;
  }

  const timestamp =
    new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

function getGoalStatus(goal) {
  const progress =
    getGoalProgress(goal);

  const explicitStatus = String(
    goal?.status || ""
  ).toLowerCase();

  if (
    explicitStatus === "completed" ||
    progress >= 100
  ) {
    return "completed";
  }

  const deadline =
    getTimestamp(goal?.deadline);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (
    deadline > 0 &&
    deadline < today.getTime()
  ) {
    return "overdue";
  }

  return "active";
}

function getProgressHealth(percentage) {
  if (percentage >= 100) {
    return {
      label: "Goals completed",
      description:
        "You have reached the combined target for your financial goals.",
      icon: CheckCircle2,
      badgeClass:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      iconClass:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      progressClass:
        "from-emerald-500 to-teal-500",
    };
  }

  if (percentage >= 75) {
    return {
      label: "Almost there",
      description:
        "You are close to reaching your combined savings target.",
      icon: Flag,
      badgeClass:
        "border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      iconClass:
        "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      progressClass:
        "from-cyan-500 to-blue-500",
    };
  }

  if (percentage >= 40) {
    return {
      label: "Good progress",
      description:
        "Your savings are moving steadily toward your financial targets.",
      icon: PiggyBank,
      badgeClass:
        "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400",
      iconClass:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      progressClass:
        "from-violet-500 to-purple-500",
    };
  }

  return {
    label: "Getting started",
    description:
      "Continue saving regularly to build momentum toward your goals.",
    icon: Target,
    badgeClass:
      "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    iconClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    progressClass:
      "from-amber-400 to-orange-500",
  };
}

/* =========================================================
   COMPONENT
========================================================= */

function GoalProgress() {
  const goalContext =
    useContext(GoalContext) || {};

  const {
    goals: rawGoals = [],
  } = goalContext;

  const goals = Array.isArray(rawGoals)
    ? rawGoals
    : [];

  const overview = useMemo(() => {
    return goals.reduce(
      (result, goal) => {
        const target =
          getGoalTarget(goal);

        const saved =
          getGoalSaved(goal);

        const status =
          getGoalStatus(goal);

        result.totalTarget += target;
        result.totalSaved += saved;

        if (status === "completed") {
          result.completed += 1;
        } else if (status === "overdue") {
          result.overdue += 1;
        } else {
          result.active += 1;
        }

        const deadline =
          getTimestamp(goal?.deadline);

        if (
          status === "active" &&
          deadline > 0 &&
          (
            result.nextDeadline === 0 ||
            deadline < result.nextDeadline
          )
        ) {
          result.nextDeadline = deadline;
        }

        return result;
      },
      {
        totalTarget: 0,
        totalSaved: 0,
        active: 0,
        completed: 0,
        overdue: 0,
        nextDeadline: 0,
      }
    );
  }, [goals]);

  const remaining = Math.max(
    overview.totalTarget -
      overview.totalSaved,
    0
  );

  const percentage =
    overview.totalTarget > 0
      ? (
          overview.totalSaved /
          overview.totalTarget
        ) * 100
      : 0;

  const progressPercentage = Math.min(
    Math.max(percentage, 0),
    100
  );

  const health =
    getProgressHealth(percentage);

  const HealthIcon = health.icon;

  const nextDeadlineLabel =
    overview.nextDeadline > 0
      ? new Intl.DateTimeFormat(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ).format(
          new Date(
            overview.nextDeadline
          )
        )
      : "No deadline";

  if (goals.length === 0) {
    return null;
  }

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)]">
      {/* Overall progress */}
      <PremiumCard
        hover={false}
        className="min-w-0"
      >
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Gauge size={21} />
              </div>

              <div>
                <h2 className="section-title">
                  Overall Goal Progress
                </h2>

                <p className="section-description">
                  Combined savings progress
                  across all financial goals.
                </p>
              </div>
            </div>

            <span
              className={[
                "inline-flex w-fit items-center",
                "gap-1.5 rounded-full border",
                "px-3 py-1.5 text-xs",
                "font-bold",
                health.badgeClass,
              ].join(" ")}
            >
              <HealthIcon size={14} />
              {health.label}
            </span>
          </div>

          {/* Progress amount */}
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="metric-label">
                  Target completed
                </p>

                <AnimatedNumber
                  value={percentage}
                  suffix="%"
                  decimals={1}
                  className="mt-2 block text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl"
                />
              </div>

              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                ₹
                {overview.totalSaved.toLocaleString(
                  "en-IN"
                )}{" "}
                of ₹
                {overview.totalTarget.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={[
                  "h-full rounded-full",
                  "bg-gradient-to-r",
                  "transition-[width]",
                  "duration-700 ease-out",
                  health.progressClass,
                ].join(" ")}
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {health.description}
            </p>
          </div>

          {/* Financial breakdown */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <CircleDollarSign size={17} />

                <span className="text-xs font-bold uppercase tracking-wide">
                  Target
                </span>
              </div>

              <AnimatedNumber
                value={overview.totalTarget}
                prefix="₹"
                className="mt-3 block text-lg font-black text-slate-900 dark:text-white"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
              <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                <PiggyBank size={17} />

                <span className="text-xs font-bold uppercase tracking-wide">
                  Saved
                </span>
              </div>

              <AnimatedNumber
                value={overview.totalSaved}
                prefix="₹"
                className="mt-3 block text-lg font-black text-slate-900 dark:text-white"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Target size={17} />

                <span className="text-xs font-bold uppercase tracking-wide">
                  Remaining
                </span>
              </div>

              <AnimatedNumber
                value={remaining}
                prefix="₹"
                className="mt-3 block text-lg font-black text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </PremiumCard>

      {/* Goal health */}
      <PremiumCard
        hover={false}
        className="min-w-0"
      >
        <div className="flex h-full flex-col">
          <div
            className={[
              "flex size-14 items-center",
              "justify-center rounded-2xl",
              health.iconClass,
            ].join(" ")}
          >
            <HealthIcon size={26} />
          </div>

          <h3 className="mt-5 text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Goal Health
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Review your active goals, completed milestones and upcoming
            deadlines.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-100/80 px-4 py-3 dark:bg-slate-800/60">
              <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Target size={15} />
                Active goals
              </span>

              <span className="font-bold text-slate-900 dark:text-white">
                {overview.active}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-100/80 px-4 py-3 dark:bg-slate-800/60">
              <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <CheckCircle2 size={15} />
                Completed
              </span>

              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {overview.completed}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-100/80 px-4 py-3 dark:bg-slate-800/60">
              <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <AlertTriangle size={15} />
                Overdue
              </span>

              <span
                className={[
                  "font-bold",
                  overview.overdue > 0
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-emerald-600 dark:text-emerald-400",
                ].join(" ")}
              >
                {overview.overdue}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-100/80 px-4 py-3 dark:bg-slate-800/60">
              <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <CalendarClock size={15} />
                Next deadline
              </span>

              <span className="text-right text-xs font-bold text-slate-900 dark:text-white">
                {nextDeadlineLabel}
              </span>
            </div>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}

export default GoalProgress;