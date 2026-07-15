import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  SearchX,
  Target,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  GoalContext,
} from "../../context/GoalContext";

import GoalCard from "./GoalCard";
import GoalContributionModal from "./GoalContributionModal";

import ConfirmDialog from "../common/ConfirmDialog";
import EmptyState from "../common/EmptyState";
import LoadingSkeleton from "../common/LoadingSkeleton";
import Pagination from "../common/Pagination";

/* =========================================================
   HELPERS
========================================================= */

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function getGoalId(goal) {
  return (
    goal?.id ??
    goal?._id ??
    goal?.goalId ??
    null
  );
}

function getGoalName(goal) {
  return (
    goal?.title ||
    goal?.name ||
    "Financial Goal"
  );
}

function getGoalTarget(goal) {
  return getSafeNumber(
    goal?.targetAmount ??
      goal?.amount ??
      goal?.target
  );
}

function getGoalSaved(goal) {
  return getSafeNumber(
    goal?.savedAmount ??
      goal?.saved ??
      goal?.currentAmount
  );
}

function getGoalProgress(goal) {
  const target =
    getGoalTarget(goal);

  const saved =
    getGoalSaved(goal);

  if (target <= 0) {
    return 0;
  }

  return (
    saved /
    target
  ) * 100;
}

function getTimestamp(value) {
  if (!value) {
    return 0;
  }

  const timestamp =
    new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

function getDeadlineTimestamp(value) {
  if (!value) {
    return 0;
  }

  const timestamp =
    new Date(
      `${value}T00:00:00`
    ).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

function getGoalStatus(goal) {
  const progress =
    getGoalProgress(goal);

  const explicitStatus = String(
    goal?.status || ""
  ).toLowerCase();

  if (
    explicitStatus === "completed" ||
    progress >= 100
  ) {
    return "completed";
  }

  const deadline =
    getDeadlineTimestamp(
      goal?.deadline
    );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (
    deadline > 0 &&
    deadline < today.getTime()
  ) {
    return "overdue";
  }

  return "active";
}

/* =========================================================
   COMPONENT
========================================================= */

function GoalList({
  search = "",
  status = "all",
  sort = "deadline-soon",
  onEdit,
  onAdd,
}) {
  const goalContext =
    useContext(GoalContext) || {};

  const {
    goals: rawGoals = [],
    loading = false,
    isLoading = false,
    error = null,
  } = goalContext;

  const deleteGoalAction =
    goalContext.deleteGoal ||
    goalContext.removeGoal ||
    goalContext.deleteGoalRecord;

  const goals = Array.isArray(rawGoals)
    ? rawGoals
    : [];

  /* =======================================================
     STATE
  ======================================================= */

  const [
    goalToDelete,
    setGoalToDelete,
  ] = useState(null);

  const [
    contributionGoal,
    setContributionGoal,
  ] = useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(4);

  /* =======================================================
     FILTER VALUES
  ======================================================= */

  const normalizedSearch = String(
    search || ""
  )
    .trim()
    .toLowerCase();

  const normalizedStatus = String(
    status || "all"
  ).toLowerCase();

  const normalizedSort = String(
    sort || "deadline-soon"
  ).toLowerCase();

  /* =======================================================
     FILTER AND SORT
  ======================================================= */

  const processedGoals = useMemo(() => {
    return goals
      .map((goal) => ({
        goal,
        target:
          getGoalTarget(goal),
        saved:
          getGoalSaved(goal),
        progress:
          getGoalProgress(goal),
        status:
          getGoalStatus(goal),
      }))
      .filter((item) => {
        const title = String(
          item.goal?.title ||
            item.goal?.name ||
            ""
        ).toLowerCase();

        const description = String(
          item.goal?.description ||
            item.goal?.note ||
            ""
        ).toLowerCase();

        const matchesSearch =
          normalizedSearch === "" ||
          title.includes(
            normalizedSearch
          ) ||
          description.includes(
            normalizedSearch
          );

        const matchesStatus =
          normalizedStatus === "all" ||
          item.status ===
            normalizedStatus;

        return (
          matchesSearch &&
          matchesStatus
        );
      })
      .sort((first, second) => {
        if (
          normalizedSort ===
          "progress-high"
        ) {
          return (
            second.progress -
            first.progress
          );
        }

        if (
          normalizedSort ===
          "progress-low"
        ) {
          return (
            first.progress -
            second.progress
          );
        }

        if (
          normalizedSort ===
          "target-high"
        ) {
          return (
            second.target -
            first.target
          );
        }

        if (
          normalizedSort ===
          "target-low"
        ) {
          return (
            first.target -
            second.target
          );
        }

        if (
          normalizedSort === "newest"
        ) {
          return (
            getTimestamp(
              second.goal?.createdAt
            ) -
            getTimestamp(
              first.goal?.createdAt
            )
          );
        }

        if (
          normalizedSort === "oldest"
        ) {
          return (
            getTimestamp(
              first.goal?.createdAt
            ) -
            getTimestamp(
              second.goal?.createdAt
            )
          );
        }

        const firstDeadline =
          getDeadlineTimestamp(
            first.goal?.deadline
          );

        const secondDeadline =
          getDeadlineTimestamp(
            second.goal?.deadline
          );

        if (
          firstDeadline === 0 &&
          secondDeadline === 0
        ) {
          return 0;
        }

        if (firstDeadline === 0) {
          return 1;
        }

        if (secondDeadline === 0) {
          return -1;
        }

        return (
          firstDeadline -
          secondDeadline
        );
      });
  }, [
    goals,
    normalizedSearch,
    normalizedStatus,
    normalizedSort,
  ]);

  const filtersAreActive =
    normalizedSearch !== "" ||
    normalizedStatus !== "all";

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalItems =
    processedGoals.length;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalItems /
      pageSize
    )
  );

  const safeCurrentPage =
    Math.min(
      Math.max(
        currentPage,
        1
      ),
      totalPages
    );

  const startIndex =
    (
      safeCurrentPage -
      1
    ) * pageSize;

  const paginatedGoals =
    processedGoals.slice(
      startIndex,
      startIndex + pageSize
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    normalizedSearch,
    normalizedStatus,
    normalizedSort,
    pageSize,
  ]);

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const handlePageSizeChange = (
    nextPageSize
  ) => {
    const parsedSize = Number(
      nextPageSize
    );

    if (
      !Number.isFinite(
        parsedSize
      ) ||
      parsedSize <= 0
    ) {
      return;
    }

    setPageSize(parsedSize);
    setCurrentPage(1);
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDeleteRequest = (
    goal
  ) => {
    setGoalToDelete(goal);
  };

  const handleCloseDeleteDialog =
    () => {
      if (
        deletingId !== null
      ) {
        return;
      }

      setGoalToDelete(null);
    };

  const handleConfirmDelete =
    async () => {
      const goalId =
        getGoalId(
          goalToDelete
        );

      if (
        goalId === null ||
        goalId === undefined
      ) {
        toast.error(
          "Unable to identify this goal."
        );

        return;
      }

      if (
        typeof deleteGoalAction !==
        "function"
      ) {
        toast.error(
          "Delete goal function is unavailable."
        );

        return;
      }

      const selectedGoal =
        goalToDelete;

      try {
        setDeletingId(goalId);

        const result =
          await deleteGoalAction(
            goalId
          );

        if (
          result?.success === false
        ) {
          throw new Error(
            result?.error ||
              "Unable to delete goal."
          );
        }

        toast.success(
          `"${getGoalName(
            selectedGoal
          )}" deleted successfully.`
        );

        setGoalToDelete(null);
      } catch (deleteError) {
        console.error(
          "Unable to delete goal:",
          deleteError
        );

        toast.error(
          deleteError?.message ||
            "Unable to delete goal."
        );
      } finally {
        setDeletingId(null);
      }
    };

  /* =======================================================
     LOADING AND ERROR
  ======================================================= */

  if (loading || isLoading) {
    return (
      <LoadingSkeleton
        type="card"
        count={4}
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={Target}
        title="Unable to load goals"
        description={
          typeof error === "string"
            ? error
            : error?.message ||
              "Something went wrong while loading your goals."
        }
        className="min-h-[360px]"
      />
    );
  }

  return (
    <section className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="pointer-events-none absolute -left-16 -top-16 size-44 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative flex flex-col gap-4 border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Target size={21} />
          </div>

          <div className="min-w-0">
            <h2 className="section-title">
              Financial Goals
            </h2>

            <p className="section-description">
              Track savings progress and
              upcoming deadlines.
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          {totalItems}{" "}
          {totalItems === 1
            ? "goal"
            : "goals"}
        </span>
      </div>

      {totalItems === 0 ? (
        <div className="p-5 sm:p-6">
          <EmptyState
            icon={
              filtersAreActive
                ? SearchX
                : Target
            }
            title={
              filtersAreActive
                ? "No matching goals"
                : "No financial goals yet"
            }
            description={
              filtersAreActive
                ? "No goal matches your current search or status filter."
                : "Create your first financial goal and begin tracking your savings progress."
            }
            actionLabel={
              filtersAreActive
                ? ""
                : "Create Goal"
            }
            actionIcon={Plus}
            onAction={
              filtersAreActive
                ? undefined
                : onAdd
            }
            className="min-h-[340px]"
          />
        </div>
      ) : (
        <>
          {/* Goal cards */}
          <div className="grid min-w-0 gap-5 p-4 sm:p-6 md:grid-cols-2">
            {paginatedGoals.map(
              (item, index) => {
                const goalId =
                  getGoalId(
                    item.goal
                  );

                return (
                  <GoalCard
                    key={
                      goalId ??
                      `${getGoalName(
                        item.goal
                      )}-${startIndex + index}`
                    }
                    goal={item.goal}
                    index={index}
                    onEdit={onEdit}
                    onContribute={
                      setContributionGoal
                    }
                    onDelete={
                      handleDeleteRequest
                    }
                    deleting={
                      deletingId ===
                      goalId
                    }
                  />
                );
              }
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={
              safeCurrentPage
            }
            totalPages={
              totalPages
            }
            totalItems={
              totalItems
            }
            pageSize={pageSize}
            pageSizeOptions={[
                2,
              4,
              6,
              8,
              12,
            ]}
            onPageChange={
              setCurrentPage
            }
            onPageSizeChange={
              handlePageSizeChange
            }
          />
        </>
      )}

      {/* Contribution modal */}
      <GoalContributionModal
        goal={contributionGoal}
        open={Boolean(
          contributionGoal
        )}
        onClose={() =>
          setContributionGoal(null)
        }
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(
          goalToDelete
        )}
        onClose={
          handleCloseDeleteDialog
        }
        onConfirm={
          handleConfirmDelete
        }
        title="Delete goal?"
        description={
          goalToDelete
            ? `You are about to delete "${getGoalName(
                goalToDelete
              )}".`
            : ""
        }
        confirmLabel="Delete Goal"
        loading={Boolean(
          deletingId
        )}
        variant="danger"
      />
    </section>
  );
}

export default GoalList;