import {
  ArrowDownUp,
  Filter,
  RotateCcw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

const statusOptions = [
  {
    label: "All Goals",
    value: "all",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Overdue",
    value: "overdue",
  },
];

const sortOptions = [
  {
    label: "Deadline Soon",
    value: "deadline-soon",
  },
  {
    label: "Highest Progress",
    value: "progress-high",
  },
  {
    label: "Lowest Progress",
    value: "progress-low",
  },
  {
    label: "Highest Target",
    value: "target-high",
  },
  {
    label: "Lowest Target",
    value: "target-low",
  },
  {
    label: "Newest First",
    value: "newest",
  },
  {
    label: "Oldest First",
    value: "oldest",
  },
];

function ToolbarSelect({
  label,
  icon: Icon,
  value,
  onChange,
  options = [],
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <Icon size={14} />

        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-200 dark:focus:border-emerald-500 dark:focus:bg-slate-950"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function GoalToolbar({
  search = "",
  setSearch,
  status = "all",
  setStatus,
  sort = "deadline-soon",
  setSort,
  onReset,
}) {
  const shouldReduceMotion =
    useReducedMotion();

  const normalizedSearch = String(
    search || ""
  ).trim();

  const activeFilterCount = [
    normalizedSearch !== "",
    status !== "all",
    sort !== "deadline-soon",
  ].filter(Boolean).length;

  const hasActiveFilters =
    activeFilterCount > 0;

  const handleReset = () => {
    if (typeof onReset === "function") {
      onReset();
      return;
    }

    setSearch?.("");
    setStatus?.("all");
    setSort?.("deadline-soon");
  };

  return (
    <motion.aside
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              x: 18,
            }
      }
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Filter size={18} />
            </div>

            <div className="min-w-0">
              <h2 className="font-bold text-slate-900 dark:text-white">
                Goal Controls
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Search, filter and sort goals.
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 px-2 text-xs font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="my-5 h-px bg-slate-200 dark:bg-slate-800" />

        {/* Search */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Search size={14} />

            Search
          </label>

          <div className="group relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch?.(
                  event.target.value
                )
              }
              placeholder="Search goals..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white dark:focus:border-emerald-500"
            />

            {normalizedSearch && (
              <button
                type="button"
                aria-label="Clear goal search"
                onClick={() =>
                  setSearch?.("")
                }
                className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 space-y-5">
          <ToolbarSelect
            label="Goal status"
            icon={ShieldCheck}
            value={status}
            onChange={(event) =>
              setStatus?.(
                event.target.value
              )
            }
            options={statusOptions}
          />

          <ToolbarSelect
            label="Sort goals"
            icon={ArrowDownUp}
            value={sort}
            onChange={(event) =>
              setSort?.(
                event.target.value
              )
            }
            options={sortOptions}
          />
        </div>

        {/* Reset */}
        <motion.button
          type="button"
          disabled={!hasActiveFilters}
          onClick={handleReset}
          whileHover={
            shouldReduceMotion ||
            !hasActiveFilters
              ? undefined
              : {
                  y: -1,
                }
          }
          whileTap={
            shouldReduceMotion ||
            !hasActiveFilters
              ? undefined
              : {
                  scale: 0.98,
                }
          }
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-300 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
        >
          <RotateCcw size={16} />

          Clear All
        </motion.button>
      </div>
    </motion.aside>
  );
}

export default GoalToolbar;