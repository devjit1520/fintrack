import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Plus,
  Sparkles,
} from "lucide-react";

export default function TransactionHeader({
  onAddClick,
  transactionCount = 0,
  incomeCount = 0,
  expenseCount = 0,
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-6 lg:p-8">
      {/* Decorative background */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        {/* Left section */}

        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-600 shadow-lg shadow-cyan-500/10 dark:text-cyan-400">
              <CreditCard size={24} />
            </div>

            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 mb-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">
                  <Sparkles size={11} />

                  Finance
                </span>
              <div className="flex flex-wrap items-center gap-2">
                
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  Transactions
                </h1>

                
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                Track, organize and manage all your income and
                expenses in one place.
              </p>
            </div>
          </div>

          {/* Mini statistics */}

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.035]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <CreditCard size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Total
                </p>

                <p className="mt-0.5 truncate text-sm font-bold text-slate-900 dark:text-white">
                  {transactionCount} transactions
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.035]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ArrowDownLeft size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Income
                </p>

                <p className="mt-0.5 truncate text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {incomeCount} records
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.035]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <ArrowUpRight size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Expenses
                </p>

                <p className="mt-0.5 truncate text-sm font-bold text-rose-600 dark:text-rose-400">
                  {expenseCount} records
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add transaction button */}

        <button
          type="button"
          onClick={onAddClick}
          className="group inline-flex w-full shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/25 active:scale-[0.98] xl:w-auto"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 transition-transform duration-300 group-hover:rotate-90">
            <Plus size={17} />
          </span>

          Add Transaction
        </button>
      </div>
    </section>
  );
}