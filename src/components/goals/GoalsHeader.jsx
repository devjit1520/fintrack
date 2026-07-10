import { Target } from "lucide-react";

function GoalsHeader({ onAdd }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Goals
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your financial goals
        </p>
      </div>

      <button
        onClick={onAdd}
        className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        <Target className="mr-2 inline" size={18} />
        Add Goal
      </button>
    </div>
  );
}

export default GoalsHeader;