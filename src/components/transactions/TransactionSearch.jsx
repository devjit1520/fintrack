import {
  Search,
  X,
} from "lucide-react";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

function TransactionSearch({
  search = "",
  setSearch,
}) {
  const shouldReduceMotion =
    useReducedMotion();

  const handleChange = (event) => {
    setSearch?.(event.target.value);
  };

  const handleClear = () => {
    setSearch?.("");
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Search transactions
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Search by title, category or note.
            </p>
          </div>

          {search.trim() && (
            <motion.span
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      scale: 0.9,
                    }
              }
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400"
            >
              Active
            </motion.span>
          )}
        </div>

        <div className="group relative">
          <Search
            size={19}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-500"
          />

          <input
            type="search"
            value={search}
            onChange={handleChange}
            placeholder="Search transactions..."
            autoComplete="off"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-12 pr-12 text-sm font-medium text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-500 dark:focus:bg-slate-950"
          />

          {search && (
            <motion.button
              type="button"
              aria-label="Clear transaction search"
              onClick={handleClear}
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
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X size={16} />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionSearch;