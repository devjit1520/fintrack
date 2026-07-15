import {
  ArrowDownUp,
  Filter,
  RotateCcw,
  Tags,
} from "lucide-react";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

const typeOptions = [
  {
    label: "All Types",
    value: "all",
  },
  {
    label: "Income",
    value: "income",
  },
  {
    label: "Expense",
    value: "expense",
  },
];

const categoryOptions = [
  "all",
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Rent",
  "Travel",
  "Other",
];

const sortOptions = [
  {
    label: "Newest first",
    value: "newest",
  },
  {
    label: "Oldest first",
    value: "oldest",
  },
  {
    label: "Highest amount",
    value: "highest",
  },
  {
    label: "Lowest amount",
    value: "lowest",
  },
];

function FilterSelect({
  label,
  icon: Icon,
  value,
  onChange,
  options,
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
        className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-200 dark:focus:border-cyan-500 dark:focus:bg-slate-950"
      >
        {options.map((option) => {
          const normalizedOption =
            typeof option === "string"
              ? {
                  label:
                    option === "all"
                      ? "All Categories"
                      : option,
                  value: option,
                }
              : option;

          return (
            <option
              key={normalizedOption.value}
              value={normalizedOption.value}
            >
              {normalizedOption.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function TransactionFilters({
  filter = "all",
  setFilter,
  category = "all",
  setCategory,
  sort = "newest",
  setSort,
}) {
  const shouldReduceMotion =
    useReducedMotion();

  const activeFilterCount = [
    filter !== "all",
    category !== "all",
    sort !== "newest",
  ].filter(Boolean).length;

  const hasActiveFilters =
    activeFilterCount > 0;

  const handleReset = () => {
    setFilter?.("all");
    setCategory?.("all");
    setSort?.("newest");
  };

  return (
    <motion.aside
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              x: 16,
            }
      }
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Filter size={18} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Filters
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Refine your transaction list.
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
                      scale: 0.85,
                    }
              }
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="flex h-7 min-w-7 items-center justify-center rounded-full bg-violet-500 px-2 text-xs font-bold text-white"
            >
              {activeFilterCount}
            </motion.span>
          )}
        </div>

        <div className="my-5 h-px bg-slate-200 dark:bg-slate-800" />

        {/* Filter controls */}
        <div className="space-y-5">
          <FilterSelect
            label="Transaction type"
            icon={Filter}
            value={filter}
            onChange={(event) =>
              setFilter?.(event.target.value)
            }
            options={typeOptions}
          />

          <FilterSelect
            label="Category"
            icon={Tags}
            value={category}
            onChange={(event) =>
              setCategory?.(
                event.target.value
              )
            }
            options={categoryOptions}
          />

          <FilterSelect
            label="Sort by"
            icon={ArrowDownUp}
            value={sort}
            onChange={(event) =>
              setSort?.(event.target.value)
            }
            options={sortOptions}
          />
        </div>

        {/* Reset button */}
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

          Clear Filters
        </motion.button>
      </div>
    </motion.aside>
  );
}

export default TransactionFilters;