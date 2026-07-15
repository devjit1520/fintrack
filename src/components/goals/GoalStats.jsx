import {
  useContext,
  useMemo,
} from "react";

import {
  CheckCircle2,
  PiggyBank,
  Target,
  WalletCards,
} from "lucide-react";

import {
  GoalContext,
} from "../../context/GoalContext";

import AnimatedNumber from "../common/AnimatedNumber";
import PremiumCard from "../common/PremiumCard";
import PremiumGrid from "../common/PremiumGrid";

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

function isGoalCompleted(goal) {
  const explicitStatus = String(
    goal?.status || ""
  ).toLowerCase();

  return (
    explicitStatus === "completed" ||
    getGoalProgress(goal) >= 100
  );
}

/* =========================================================
   COMPONENT
========================================================= */

function GoalStats() {
  const goalContext =
    useContext(GoalContext) || {};

  const {
    goals: rawGoals = [],
  } = goalContext;

  const goals = Array.isArray(rawGoals)
    ? rawGoals
    : [];

  const totals = useMemo(() => {
    return goals.reduce(
      (result, goal) => {
        const target = getGoalTarget(goal);
        const saved = getGoalSaved(goal);

        result.totalTarget += target;
        result.totalSaved += saved;

        if (isGoalCompleted(goal)) {
          result.completedGoals += 1;
        } else {
          result.activeGoals += 1;
        }

        return result;
      },
      {
        totalTarget: 0,
        totalSaved: 0,
        activeGoals: 0,
        completedGoals: 0,
      }
    );
  }, [goals]);

  const remaining = Math.max(
    totals.totalTarget -
      totals.totalSaved,
    0
  );

  const stats = [
    {
      title: "Active Goals",
      value: totals.activeGoals,
      prefix: "",
      icon: Target,
      description:
        totals.activeGoals === 1
          ? "1 goal currently active"
          : `${totals.activeGoals} goals currently active`,
      valueClass:
        "text-emerald-600 dark:text-emerald-400",
      iconClass:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Total Target",
      value: totals.totalTarget,
      prefix: "₹",
      icon: WalletCards,
      description: "Combined savings target",
      valueClass:
        "text-blue-600 dark:text-blue-400",
      iconClass:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Saved",
      value: totals.totalSaved,
      prefix: "₹",
      icon: PiggyBank,
      description: "Saved across all goals",
      valueClass:
        "text-violet-600 dark:text-violet-400",
      iconClass:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
      title: "Remaining",
      value: remaining,
      prefix: "₹",
      icon: CheckCircle2,
      description:
        totals.completedGoals > 0
          ? `${totals.completedGoals} completed`
          : "Amount left to save",
      valueClass:
        remaining === 0 &&
        totals.totalTarget > 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-amber-600 dark:text-amber-400",
      iconClass:
        remaining === 0 &&
        totals.totalTarget > 0
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <PremiumGrid size="small">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <PremiumCard
            key={stat.title}
            delay={index * 0.06}
            className="min-h-[170px]"
          >
            <div className="flex h-full items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="metric-label">
                  {stat.title}
                </p>

                <AnimatedNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  className={[
                    "mt-4 block",
                    "text-2xl font-black",
                    "tracking-tight sm:text-3xl",
                    stat.valueClass,
                  ].join(" ")}
                />

                <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.description}
                </p>
              </div>

              <div
                className={[
                  "flex size-12 shrink-0",
                  "items-center justify-center",
                  "rounded-2xl",
                  stat.iconClass,
                ].join(" ")}
              >
                <Icon
                  size={23}
                  strokeWidth={2}
                />
              </div>
            </div>
          </PremiumCard>
        );
      })}
    </PremiumGrid>
  );
}

export default GoalStats;