import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";

import useSearch from "../../hooks/useSearch";
import SearchItem from "./SearchItem";

function GlobalSearch({ open, onClose }) {
  const { query, setQuery, results } = useSearch();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKey);
    }

    return () =>
      window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open, setQuery]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Background */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: -20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: -20,
            }}
            className="fixed left-1/2 top-24 z-[60] w-[95%] max-w-2xl -translate-x-1/2 rounded-3xl border border-white/10 bg-slate-900 shadow-2xl"
          >
            {/* Search Input */}

            <div className="flex items-center gap-3 border-b border-slate-800 p-5">

              <Search className="text-cyan-400" size={22} />

              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search transactions, goals, budgets..."
                className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
              />

              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-slate-800"
              >
                <X size={20} />
              </button>

            </div>

            {/* Results */}

            <div className="max-h-[500px] space-y-3 overflow-y-auto p-5">

              {results.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  No results found.
                </div>
              ) : (
                results.map((item, index) => (
                  <SearchItem
                    key={index}
                    item={item}
                  />
                ))
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default GlobalSearch;