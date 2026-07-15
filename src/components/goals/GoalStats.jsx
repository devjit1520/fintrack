import {
  CheckCircle2,
  PiggyBank,
  Target,
  Wallet,
} from "lucide-react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function GoalStats({ goals = [] }) {
  const totalGoals = goals.length;

  const completedGoals = goals.filter((goal) => {
    const target = Number(goal.targetAmount || 0);
    const saved = Number(goal.savedAmount || 0);

    return (
      String(goal.status).toLowerCase() === "completed" ||
      (target > 0 && saved >= target)
    );
  }).length;

  const totalTarget = goals.reduce(
    (total, goal) =>
      total + Number(goal.targetAmount || 0),
    0
  );

  const totalSaved = goals.reduce(
    (total, goal) =>
      total + Number(goal.savedAmount || 0),
    0
  );

  const stats = [
    {
      title: "Total Goals",
      value: totalGoals,
      subtitle: "All saving goals",
      icon: Target,
      classes:
        "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30",
      iconClasses:
        "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
    },
    {
      title: "Completed",
      value: completedGoals,
      subtitle: "Goals achieved",
      icon: CheckCircle2,
      classes:
        "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30",
      iconClasses:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
    },
    {
      title: "Total Target",
      value: formatCurrency(totalTarget),
      subtitle: "Combined target",
      icon: Wallet,
      classes:
        "border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/30",
      iconClasses:
        "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400",
    },
    {
      title: "Total Saved",
      value: formatCurrency(totalSaved),
      subtitle: "Combined progress",
      icon: PiggyBank,
      classes:
        "border-cyan-200 bg-cyan-50 dark:border-cyan-900 dark:bg-cyan-950/30",
      iconClasses:
        "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.title}
            className={`
              rounded-2xl
              border
              p-5
              ${stat.classes}
            `}
          >
            <div
              className={`
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                ${stat.iconClasses}
              `}
            >
              <Icon size={21} />
            </div>

            <p
              className="
                mt-4
                text-sm
                font-medium
                text-slate-500
                dark:text-slate-400
              "
            >
              {stat.title}
            </p>

            <h3
              className="
                mt-1
                break-words
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              {stat.value}
            </h3>

            <p
              className="
                mt-2
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              {stat.subtitle}
            </p>
          </article>
        );
      })}
    </div>
  );
}

export default GoalStats;