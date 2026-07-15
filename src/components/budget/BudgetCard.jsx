import { motion, useReducedMotion } from "framer-motion";

import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Pencil,
  Trash2,
  TrendingUp,
} from "lucide-react";

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(getSafeNumber(value));
}

function getBudgetStatus(percentage) {
  if (percentage >= 100) {
    return {
      key: "over-budget",
      label: "Over budget",
      icon: AlertTriangle,
      badgeClass:
        "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400",
      iconClass:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      progressClass:
        "from-rose-500 to-red-500",
    };
  }

  if (percentage >= 80) {
    return {
      key: "warning",
      label: "Near limit",
      icon: TrendingUp,
      badgeClass:
        "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      iconClass:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      progressClass:
        "from-amber-400 to-orange-500",
    };
  }

  return {
    key: "on-track",
    label: "On track",
    icon: CheckCircle2,
    badgeClass:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    iconClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    progressClass:
      "from-cyan-500 to-blue-500",
  };
}

function BudgetCard({
  budget,
  spent = 0,
  onEdit,
  onDelete,
  deleting = false,
  index = 0,
}) {
  const shouldReduceMotion = useReducedMotion();

  const limit = getSafeNumber(
    budget?.amount ??
      budget?.limit ??
      budget?.budgetAmount ??
      budget?.targetAmount
  );

  const safeSpent = getSafeNumber(spent);

  const remaining = limit - safeSpent;

  const percentage =
    limit > 0
      ? (safeSpent / limit) * 100
      : safeSpent > 0
        ? 100
        : 0;

  const progressPercentage = Math.min(
    Math.max(percentage, 0),
    100
  );

  const status = getBudgetStatus(percentage);
  const StatusIcon = status.icon;

  const title =
    budget?.title ||
    budget?.name ||
    budget?.category ||
    "Budget";

  const category =
    budget?.category ||
    budget?.title ||
    "Other";

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
        duration: 0.35,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative">
        {/* Card header */}
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
              <CircleDollarSign
                size={23}
                strokeWidth={1.9}
              />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-black tracking-tight text-slate-950 dark:text-white">
                {title}
              </h3>

              <p className="mt-1 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                {category} budget
              </p>
            </div>
          </div>

          <span
            className={[
              "inline-flex shrink-0 items-center",
              "gap-1.5 rounded-full border",
              "px-2.5 py-1 text-[11px]",
              "font-bold",
              status.badgeClass,
            ].join(" ")}
          >
            <StatusIcon size={13} />

            {status.label}
          </span>
        </div>

        {/* Budget amount */}
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Monthly limit
          </p>

          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {formatCurrency(limit)}
          </p>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Budget usage
            </span>

            <span
              className={[
                "text-sm font-black",
                percentage >= 100
                  ? "text-rose-600 dark:text-rose-400"
                  : percentage >= 80
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400",
              ].join(" ")}
            >
              {percentage.toFixed(1)}%
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
                width: `${progressPercentage}%`,
              }}
              transition={{
                duration: 0.7,
                delay: Math.min(index * 0.05, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
              className={[
                "h-full rounded-full",
                "bg-gradient-to-r",
                status.progressClass,
              ].join(" ")}
            />
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/30">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Spent
            </p>

            <p className="mt-2 truncate text-sm font-black text-rose-600 dark:text-rose-400">
              {formatCurrency(safeSpent)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/30">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
              {remaining >= 0
                ? "Remaining"
                : "Exceeded"}
            </p>

            <p
              className={[
                "mt-2 truncate text-sm font-black",
                remaining >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400",
              ].join(" ")}
            >
              {formatCurrency(Math.abs(remaining))}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onEdit?.(budget)}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 text-sm font-bold text-blue-600 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
          >
            <Pencil size={16} />

            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(budget)}
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

export default BudgetCard;