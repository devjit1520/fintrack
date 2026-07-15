import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 5,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20],
}) {
  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    Math.max(totalPages, 1)
  );

  const startItem =
    totalItems === 0
      ? 0
      : (safeCurrentPage - 1) * pageSize + 1;

  const endItem = Math.min(
    safeCurrentPage * pageSize,
    totalItems
  );

  const handlePrevious = () => {
    if (safeCurrentPage > 1) {
      onPageChange?.(safeCurrentPage - 1);
    }
  };

  const handleNext = () => {
    if (safeCurrentPage < totalPages) {
      onPageChange?.(safeCurrentPage + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/70 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/30 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {startItem}
          </span>
          {" – "}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {endItem}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {totalItems}
          </span>
        </p>

        <div className="hidden h-5 w-px bg-slate-300 dark:bg-slate-700 sm:block" />

        <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          Rows

          <select
            value={pageSize}
            onChange={(event) =>
              onPageSizeChange?.(
                Number(event.target.value)
              )
            }
            className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {pageSizeOptions.map((size) => (
              <option
                key={size}
                value={size}
              >
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={safeCurrentPage <= 1}
          className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:border-cyan-300 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-500/40 dark:hover:text-cyan-400"
        >
          <ChevronLeft size={17} />
          <span className="hidden sm:inline">
            Previous
          </span>
        </button>

        <div className="flex h-10 min-w-20 items-center justify-center rounded-xl bg-slate-200/70 px-3 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {safeCurrentPage} /{" "}
          {Math.max(totalPages, 1)}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={
            safeCurrentPage >= totalPages ||
            totalPages <= 1
          }
          className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:border-cyan-300 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-500/40 dark:hover:text-cyan-400"
        >
          <span className="hidden sm:inline">
            Next
          </span>
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;