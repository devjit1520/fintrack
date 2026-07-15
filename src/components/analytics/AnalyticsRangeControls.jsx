import {
  CalendarDays,
  Filter,
  RotateCcw,
} from "lucide-react";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

const rangeOptions = [
  {
    label: "30 Days",
    value: "30d",
  },
  {
    label: "3 Months",
    value: "3m",
  },
  {
    label: "6 Months",
    value: "6m",
  },
  {
    label: "1 Year",
    value: "1y",
  },
  {
    label: "All Time",
    value: "all",
  },
  {
    label: "Custom",
    value: "custom",
  },
];

function AnalyticsRangeControls({
  range = "6m",
  onRangeChange,
  startDate = "",
  onStartDateChange,
  endDate = "",
  onEndDateChange,
  totalCount = 0,
  filteredCount = 0,
  onReset,
}) {
  const shouldReduceMotion =
    useReducedMotion();

  const isCustom = range === "custom";

  const hasActiveFilter =
    range !== "all";

  const today = new Date()
    .toISOString()
    .split("T")[0];

  return (
    <motion.section
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
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Filter size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="section-title">
                Analytics Period
              </h2>

              <p className="section-description">
                Select the transaction period used by your
                financial reports and charts.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right dark:border-slate-700 dark:bg-slate-950/50">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Transactions
              </p>

              <p className="mt-0.5 text-sm font-black text-slate-900 dark:text-white">
                {filteredCount} / {totalCount}
              </p>
            </div>

            <button
              type="button"
              onClick={onReset}
              disabled={!hasActiveFilter}
              className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400 dark:hover:border-cyan-500/40 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-400"
              aria-label="Reset analytics period"
            >
              <RotateCcw size={17} />
            </button>
          </div>
        </div>

        {/* Preset range buttons */}
        <div className="mt-5 flex flex-wrap gap-2">
          {rangeOptions.map((option) => {
            const active =
              range === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  onRangeChange?.(
                    option.value
                  )
                }
                className={[
                  "rounded-xl border px-3.5",
                  "py-2 text-xs font-bold",
                  "transition-all duration-200",
                  active
                    ? [
                        "border-cyan-500",
                        "bg-cyan-500",
                        "text-white",
                        "shadow-lg",
                        "shadow-cyan-500/20",
                      ].join(" ")
                    : [
                        "border-slate-200",
                        "bg-slate-50",
                        "text-slate-600",
                        "hover:border-cyan-300",
                        "hover:bg-cyan-50",
                        "hover:text-cyan-600",
                        "dark:border-slate-700",
                        "dark:bg-slate-950/50",
                        "dark:text-slate-300",
                        "dark:hover:border-cyan-500/40",
                        "dark:hover:bg-cyan-500/10",
                        "dark:hover:text-cyan-400",
                      ].join(" "),
                ].join(" ")}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Custom date range */}
        {isCustom && (
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    height: 0,
                  }
            }
            animate={{
              opacity: 1,
              height: "auto",
            }}
            className="mt-5 grid gap-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 sm:grid-cols-2"
          >
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <CalendarDays size={14} />
                Start date
              </label>

              <input
                type="date"
                value={startDate}
                max={endDate || today}
                onChange={(event) =>
                  onStartDateChange?.(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <CalendarDays size={14} />
                End date
              </label>

              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                max={today}
                onChange={(event) =>
                  onEndDateChange?.(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}

export default AnalyticsRangeControls;