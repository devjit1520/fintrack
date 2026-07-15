import {
  Plus,
  Sparkles,
  Target,
} from "lucide-react";

import Button from "../common/Button";

function GoalHeader({ onAddClick }) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-7 sm:py-7">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 left-1/3 size-52 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Header content */}
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Target
              size={27}
              strokeWidth={1.9}
            />
          </div>

          <div className="min-w-0">
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Sparkles size={13} />
              Financial milestones
            </span>

            <h1 className="page-title">
              Financial Goals
            </h1>

            <p className="page-subtitle">
              Create savings targets, monitor your progress and stay focused
              on the financial future you want to build.
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
          Create Goal
        </Button>
      </div>
    </header>
  );
}

export default GoalHeader;