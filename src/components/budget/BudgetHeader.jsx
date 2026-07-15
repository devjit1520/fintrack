import {
  Plus,
  Sparkles,
  WalletCards,
} from "lucide-react";

import Button from "../common/Button";

function BudgetHeader({ onAddClick }) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-7 sm:py-7">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Header content */}
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <WalletCards
              size={27}
              strokeWidth={1.9}
            />
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-600 dark:text-violet-400">
                <Sparkles size={13} />

                Smart budgeting
              </span>
            </div>

            <h1 className="page-title">
              Budget Management
            </h1>

            <p className="page-subtitle">
              Set spending limits, monitor category usage
              and stay in control of your monthly finances.
            </p>
          </div>
        </div>

        {/* Add button */}
        <Button
          size="lg"
          leftIcon={Plus}
          onClick={onAddClick}
          className="w-full shrink-0 sm:w-auto"
        >
          Add Budget
        </Button>
      </div>
    </header>
  );
}

export default BudgetHeader;