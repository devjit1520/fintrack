import { Plus, Target } from "lucide-react";

function GoalHeader({ onAddGoal }) {
  return (
    <div
      className="
        flex
        flex-col
        gap-5
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div className="flex items-start gap-4">
        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-cyan-100
            text-cyan-600
            dark:bg-cyan-950/50
            dark:text-cyan-400
          "
        >
          <Target size={24} />
        </div>

        <div>
          <h1
            className="
              text-2xl
              font-bold
              text-slate-900
              dark:text-white
              md:text-3xl
            "
          >
            Savings Goals
          </h1>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
              dark:text-slate-400
            "
          >
            Create financial targets, track progress,
            and stay focused on what matters.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddGoal}
        className="
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
          focus:outline-none
          focus:ring-4
          focus:ring-cyan-500/20
        "
      >
        <Plus size={18} />
        New Goal
      </button>
    </div>
  );
}

export default GoalHeader;