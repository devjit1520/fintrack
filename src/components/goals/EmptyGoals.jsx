import { Plus, Target } from "lucide-react";

function EmptyGoals({
  hasFilters = false,
  onCreateGoal,
}) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-dashed
        border-slate-300
        bg-white
        px-6
        py-16
        text-center
        dark:border-slate-700
        dark:bg-slate-900
      "
    >
      <div
        className="
          mx-auto
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          bg-cyan-100
          text-cyan-600
          dark:bg-cyan-950/50
          dark:text-cyan-400
        "
      >
        <Target size={30} />
      </div>

      <h3
        className="
          mt-5
          text-xl
          font-bold
          text-slate-900
          dark:text-white
        "
      >
        {hasFilters
          ? "No matching goals"
          : "Create your first saving goal"}
      </h3>

      <p
        className="
          mx-auto
          mt-3
          max-w-md
          text-sm
          leading-6
          text-slate-500
          dark:text-slate-400
        "
      >
        {hasFilters
          ? "Try changing your search, filter, or sorting options."
          : "Set a target, add your saved amount, and track your progress over time."}
      </p>

      {!hasFilters && (
        <button
          type="button"
          onClick={onCreateGoal}
          className="
            mx-auto
            mt-6
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-cyan-500
            px-5
            py-3
            font-semibold
            text-white
            transition
            hover:bg-cyan-600
          "
        >
          <Plus size={18} />
          Create Goal
        </button>
      )}
    </div>
  );
}

export default EmptyGoals;
