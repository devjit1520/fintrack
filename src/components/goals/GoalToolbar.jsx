import {
  Filter,
  Search,
  SlidersHorizontal,
} from "lucide-react";

function GoalToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
}) {
  return (
    <div
      className="
        grid
        gap-4
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        dark:border-slate-800
        dark:bg-slate-900
        lg:grid-cols-[1fr_auto_auto]
      "
    >
      <div className="relative">
        <Search
          size={18}
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search goals..."
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            py-3
            pl-11
            pr-4
            text-slate-900
            outline-none
            transition
            focus:border-cyan-500
            focus:ring-4
            focus:ring-cyan-500/10
            dark:border-slate-700
            dark:bg-slate-950
            dark:text-white
          "
        />
      </div>

      <div className="relative">
        <Filter
          size={17}
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value)
          }
          className="
            min-w-44
            appearance-none
            rounded-xl
            border
            border-slate-200
            bg-white
            py-3
            pl-11
            pr-8
            text-slate-900
            outline-none
            transition
            focus:border-cyan-500
            dark:border-slate-700
            dark:bg-slate-950
            dark:text-white
          "
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      <div className="relative">
        <SlidersHorizontal
          size={17}
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

        <select
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value)
          }
          className="
            min-w-44
            appearance-none
            rounded-xl
            border
            border-slate-200
            bg-white
            py-3
            pl-11
            pr-8
            text-slate-900
            outline-none
            transition
            focus:border-cyan-500
            dark:border-slate-700
            dark:bg-slate-950
            dark:text-white
          "
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="progress-high">
            Highest Progress
          </option>
          <option value="progress-low">
            Lowest Progress
          </option>
          <option value="target-high">
            Highest Target
          </option>
          <option value="deadline">
            Nearest Deadline
          </option>
        </select>
      </div>
    </div>
  );
}

export default GoalToolbar;