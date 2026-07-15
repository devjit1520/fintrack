import {
  useMemo,
  useState,
} from "react";

import GoalHeader from "../../components/goals/GoalHeader";
import GoalStats from "../../components/goals/GoalStats";
import GoalToolbar from "../../components/goals/GoalToolbar";
import GoalGrid from "../../components/goals/GoalGrid";
import GoalModal from "../../components/goals/GoalModal";
import EditGoalModal from "../../components/goals/EditGoalModal";

import useGoal from "../../hooks/useGoal";

function getProgress(goal) {
  const target = Number(
    goal.targetAmount || 0
  );

  const saved = Number(
    goal.savedAmount || 0
  );

  if (target <= 0) {
    return 0;
  }

  return Math.min(
    Math.round((saved / target) * 100),
    100
  );
}

function Goals() {
  const {
    goals,
    loading,
    error,
  } = useGoal();

  const [createOpen, setCreateOpen] =
    useState(false);

  const [editingGoal, setEditingGoal] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [sort, setSort] =
    useState("newest");

  const filteredGoals = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    const nextGoals = goals.filter(
      (goal) => {
        const goalStatus =
          String(
            goal.status || "active"
          ).toLowerCase();

        const matchesSearch =
          !searchValue ||
          goal.title
            ?.toLowerCase()
            .includes(searchValue);

        const matchesStatus =
          status === "all" ||
          goalStatus === status;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

    return [...nextGoals].sort(
      (firstGoal, secondGoal) => {
        if (sort === "oldest") {
          return (
            new Date(
              firstGoal.createdAt || 0
            ) -
            new Date(
              secondGoal.createdAt || 0
            )
          );
        }

        if (sort === "progress-high") {
          return (
            getProgress(secondGoal) -
            getProgress(firstGoal)
          );
        }

        if (sort === "progress-low") {
          return (
            getProgress(firstGoal) -
            getProgress(secondGoal)
          );
        }

        if (sort === "target-high") {
          return (
            Number(
              secondGoal.targetAmount || 0
            ) -
            Number(
              firstGoal.targetAmount || 0
            )
          );
        }

        if (sort === "deadline") {
          const firstDeadline =
            firstGoal.deadline
              ? new Date(
                  firstGoal.deadline
                ).getTime()
              : Number.MAX_SAFE_INTEGER;

          const secondDeadline =
            secondGoal.deadline
              ? new Date(
                  secondGoal.deadline
                ).getTime()
              : Number.MAX_SAFE_INTEGER;

          return (
            firstDeadline -
            secondDeadline
          );
        }

        return (
          new Date(
            secondGoal.createdAt || 0
          ) -
          new Date(
            firstGoal.createdAt || 0
          )
        );
      }
    );
  }, [
    goals,
    search,
    status,
    sort,
  ]);

  const hasFilters =
    Boolean(search.trim()) ||
    status !== "all";

  return (
    <div className="space-y-6">
      <GoalHeader
        onAddGoal={() =>
          setCreateOpen(true)
        }
      />

      <GoalStats goals={goals} />

      <GoalToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
      />

      {loading && (
        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-10
            text-center
            text-slate-500
            dark:border-slate-800
            dark:bg-slate-900
            dark:text-slate-400
          "
        >
          Loading your goals...
        </div>
      )}

      {!loading && error && (
        <div
          className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-5
            text-red-600
            dark:border-red-900
            dark:bg-red-950/30
          "
        >
          {error}
        </div>
      )}

      {!loading && !error && (
        <GoalGrid
          goals={filteredGoals}
          hasFilters={hasFilters}
          onCreateGoal={() =>
            setCreateOpen(true)
          }
          onEditGoal={setEditingGoal}
        />
      )}

      <GoalModal
        open={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
      />

      <EditGoalModal
        goal={editingGoal}
        open={Boolean(editingGoal)}
        onClose={() =>
          setEditingGoal(null)
        }
      />
    </div>
  );
}

export default Goals;