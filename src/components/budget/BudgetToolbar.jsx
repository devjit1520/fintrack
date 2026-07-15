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
    label: "All Budgets",
    value: "all",
  },
  {
    label: "On Track",
    value: "on-track",
  },
  {
    label: "Near Limit",
    value: "warning",
  },
  {
    label: "Over Budget",
    value: "over-budget",
  },
];

const sortOptions = [
  {
    label: "Highest Budget",
    value: "highest",
  },
  {
    label: "Lowest Budget",
    value: "lowest",
  },
  {
    label: "Most Spent",
    value: "most-spent",
  },
  {
    label: "Least Spent",
    value: "least-spent",
  },
  {
    label: "Highest Usage",
    value: "usage-high",
  },
  {
    label: "Lowest Usage",
    value: "usage-low",
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
    <div className="min-w-0">
      <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <Icon
          size={14}
          strokeWidth={2}
        />

        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-200 dark:focus:border-violet-500 dark:focus:bg-slate-950"
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

function BudgetToolbar({
  search = "",
  setSearch,
  status = "all",
  setStatus,
  sort = "highest",
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
    sort !== "highest",
  ].filter(Boolean).length;

  const hasActiveFilters =
    activeFilterCount > 0;

  const handleSearchChange = (event) => {
    setSearch?.(event.target.value);
  };

  const handleClearSearch = () => {
    setSearch?.("");
  };

  const handleReset = () => {
    if (typeof onReset === "function") {
      onReset();
      return;
    }

    setSearch?.("");
    setStatus?.("all");
    setSort?.("highest");
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
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Filter
                size={18}
                strokeWidth={2}
              />
            </div>

            <div className="min-w-0">
              <h2 className="font-bold text-slate-900 dark:text-white">
                Budget Controls
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Search, filter and sort your budgets.
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <motion.span
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      scale: 0.8,
                    }
              }
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-violet-500 px-2 text-xs font-bold text-white"
            >
              {activeFilterCount}
            </motion.span>
          )}
        </div>

        <div className="my-5 h-px bg-slate-200 dark:bg-slate-800" />

        {/* Search */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Search
              size={14}
              strokeWidth={2}
            />

            Search
          </label>

          <div className="group relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-violet-500"
            />

            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search budgets..."
              autoComplete="off"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm font-medium text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-500 dark:focus:bg-slate-950"
            />

            {normalizedSearch && (
              <motion.button
                type="button"
                aria-label="Clear budget search"
                onClick={handleClearSearch}
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        scale: 0.8,
                      }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: 1.08,
                      }
                }
                whileTap={{
                  scale: 0.92,
                }}
                className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X size={15} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Filter controls */}
        <div className="mt-5 space-y-5">
          <ToolbarSelect
            label="Budget status"
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
            label="Sort budgets"
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

        {/* Active filter summary */}
        {hasActiveFilters && (
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 8,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-5 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3"
          >
            <p className="text-xs font-semibold leading-5 text-violet-700 dark:text-violet-300">
              {activeFilterCount}{" "}
              {activeFilterCount === 1
                ? "control is"
                : "controls are"}{" "}
              currently active.
            </p>
          </motion.div>
        )}

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
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-300 dark:hover:border-violet-500/40 dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
        >
          <RotateCcw size={16} />

          Clear All
        </motion.button>
      </div>
    </motion.aside>
  );
}

export default BudgetToolbar;