import {
  Activity,
  BarChart3,
  CalendarRange,
  Sparkles,
} from "lucide-react";

/* =========================================================
   HELPERS
========================================================= */

const rangeLabels = {
  "30d": "Last 30 days",
  "3m": "Last 3 months",
  "6m": "Last 6 months",
  "1y": "Last 1 year",
  all: "All-time analytics",
};

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getPeriodLabel({
  range,
  startDate,
  endDate,
}) {
  if (range !== "custom") {
    return (
      rangeLabels[range] ||
      "Selected analytics period"
    );
  }

  const formattedStart =
    formatDate(startDate);

  const formattedEnd =
    formatDate(endDate);

  if (formattedStart && formattedEnd) {
    return `${formattedStart} – ${formattedEnd}`;
  }

  return "Custom period";
}

/* =========================================================
   COMPONENT
========================================================= */

function AnalyticsHeader({
  transactions = [],
  range = "6m",
  startDate = "",
  endDate = "",
}) {
  const safeTransactions =
    Array.isArray(transactions)
      ? transactions
      : [];

  const periodLabel = getPeriodLabel({
    range,
    startDate,
    endDate,
  });

  return (
    <header className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-7 sm:py-7">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 left-1/3 size-52 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Title */}
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <BarChart3
              size={27}
              strokeWidth={1.9}
            />
          </div>

          <div className="min-w-0">
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <Sparkles size={13} />

              Financial intelligence
            </span>

            <h1 className="page-title">
              Analytics
            </h1>

            <p className="page-subtitle">
              Understand your income, spending,
              savings patterns and overall
              financial performance.
            </p>
          </div>
        </div>

        {/* Period information */}
        <div className="grid shrink-0 gap-3 sm:grid-cols-2 lg:min-w-[350px]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/40">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
              <CalendarRange size={16} />

              <span className="text-[11px] font-bold uppercase tracking-wider">
                Active period
              </span>
            </div>

            <p className="mt-2 text-sm font-black text-slate-900 dark:text-white">
              {periodLabel}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/40">
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
              <Activity size={16} />

              <span className="text-[11px] font-bold uppercase tracking-wider">
                Transactions
              </span>
            </div>

            <p className="mt-2 text-sm font-black text-slate-900 dark:text-white">
              {safeTransactions.length}{" "}
              {safeTransactions.length === 1
                ? "record"
                : "records"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AnalyticsHeader;