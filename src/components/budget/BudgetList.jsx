import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  SearchX,
  WalletCards,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  BudgetContext,
} from "../../context/BudgetContext";

import useFinance from "../../hooks/useFinance";

import BudgetCard from "./BudgetCard";

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

function getBudgetId(budget) {
  return (
    budget?.id ??
    budget?._id ??
    budget?.budgetId ??
    null
  );
}

function getBudgetLimit(budget) {
  return getSafeNumber(
    budget?.amount ??
      budget?.limit ??
      budget?.budgetAmount ??
      budget?.targetAmount
  );
}

function getBudgetName(budget) {
  return (
    budget?.category ||
    budget?.title ||
    budget?.name ||
    "Budget"
  );
}

function getMatchingExpenseTotal(
  budget,
  transactions
) {
  const budgetCategory = String(
    budget?.category ||
      budget?.title ||
      budget?.name ||
      ""
  )
    .trim()
    .toLowerCase();

  const matchingExpenses =
    transactions.filter((transaction) => {
      const transactionType = String(
        transaction?.type || ""
      ).toLowerCase();

      const transactionCategory = String(
        transaction?.category || ""
      )
        .trim()
        .toLowerCase();

      return (
        transactionType === "expense" &&
        transactionCategory ===
          budgetCategory
      );
    });

  if (matchingExpenses.length > 0) {
    return matchingExpenses.reduce(
      (total, transaction) =>
        total +
        getSafeNumber(
          transaction?.amount
        ),
      0
    );
  }

  return getSafeNumber(
    budget?.spent
  );
}

function getBudgetPercentage(
  limit,
  spent
) {
  if (limit > 0) {
    return (spent / limit) * 100;
  }

  return spent > 0
    ? 100
    : 0;
}

function getBudgetStatusKey(
  percentage
) {
  if (percentage >= 100) {
    return "over-budget";
  }

  if (percentage >= 80) {
    return "warning";
  }

  return "on-track";
}

function normalizeStatusFilter(value) {
  const normalizedValue = String(
    value || "all"
  ).toLowerCase();

  if (
    [
      "safe",
      "healthy",
      "on-track",
      "within-budget",
    ].includes(normalizedValue)
  ) {
    return "on-track";
  }

  if (
    [
      "warning",
      "near-limit",
      "approaching-limit",
    ].includes(normalizedValue)
  ) {
    return "warning";
  }

  if (
    [
      "over",
      "exceeded",
      "over-budget",
    ].includes(normalizedValue)
  ) {
    return "over-budget";
  }

  return "all";
}

function getBudgetTimestamp(budget) {
  const dateValue =
    budget?.createdAt ||
    budget?.date ||
    budget?.updatedAt;

  if (!dateValue) {
    return 0;
  }

  const timestamp =
    new Date(dateValue).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

/* =========================================================
   COMPONENT
========================================================= */

function BudgetList({
  search = "",
  status = "all",
  sort = "highest",
  onEdit,
  onAdd,
}) {
  const budgetContext =
    useContext(BudgetContext) || {};

  const finance =
    useFinance() || {};

  const {
    budgets: rawBudgets = [],
    deleteBudget,
    loading = false,
    isLoading = false,
    error = null,
  } = budgetContext;

  const {
    transactions: rawTransactions = [],
  } = finance;

  const budgets = Array.isArray(
    rawBudgets
  )
    ? rawBudgets
    : [];

  const transactions =
    Array.isArray(rawTransactions)
      ? rawTransactions
      : [];

  /* =======================================================
     STATE
  ======================================================= */

  const [
    budgetToDelete,
    setBudgetToDelete,
  ] = useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(4);

  /* =======================================================
     NORMALIZED VALUES
  ======================================================= */

  const normalizedSearch = String(
    search || ""
  )
    .trim()
    .toLowerCase();

  const normalizedStatus =
    normalizeStatusFilter(status);

  const normalizedSort = String(
    sort || "highest"
  ).toLowerCase();

  /* =======================================================
     FILTERING, CALCULATIONS AND SORTING
  ======================================================= */

  const processedBudgets =
    useMemo(() => {
      return budgets
        .map((budget) => {
          const limit =
            getBudgetLimit(budget);

          const spent =
            getMatchingExpenseTotal(
              budget,
              transactions
            );

          const percentage =
            getBudgetPercentage(
              limit,
              spent
            );

          const statusKey =
            getBudgetStatusKey(
              percentage
            );

          return {
            budget,
            limit,
            spent,
            percentage,
            statusKey,
          };
        })
        .filter((item) => {
          const title = String(
            item.budget?.title ||
              item.budget?.name ||
              ""
          ).toLowerCase();

          const category = String(
            item.budget?.category || ""
          ).toLowerCase();

          const note = String(
            item.budget?.note || ""
          ).toLowerCase();

          const matchesSearch =
            normalizedSearch === "" ||
            title.includes(
              normalizedSearch
            ) ||
            category.includes(
              normalizedSearch
            ) ||
            note.includes(
              normalizedSearch
            );

          const matchesStatus =
            normalizedStatus === "all" ||
            item.statusKey ===
              normalizedStatus;

          return (
            matchesSearch &&
            matchesStatus
          );
        })
        .sort((first, second) => {
          if (
            [
              "lowest",
              "lowest-budget",
            ].includes(normalizedSort)
          ) {
            return (
              first.limit -
              second.limit
            );
          }

          if (
            [
              "most-spent",
              "highest-spent",
            ].includes(normalizedSort)
          ) {
            return (
              second.spent -
              first.spent
            );
          }

          if (
            [
              "least-spent",
              "lowest-spent",
            ].includes(normalizedSort)
          ) {
            return (
              first.spent -
              second.spent
            );
          }

          if (
            [
              "usage-high",
              "highest-usage",
            ].includes(normalizedSort)
          ) {
            return (
              second.percentage -
              first.percentage
            );
          }

          if (
            [
              "usage-low",
              "lowest-usage",
            ].includes(normalizedSort)
          ) {
            return (
              first.percentage -
              second.percentage
            );
          }

          if (
            normalizedSort === "newest"
          ) {
            return (
              getBudgetTimestamp(
                second.budget
              ) -
              getBudgetTimestamp(
                first.budget
              )
            );
          }

          if (
            normalizedSort === "oldest"
          ) {
            return (
              getBudgetTimestamp(
                first.budget
              ) -
              getBudgetTimestamp(
                second.budget
              )
            );
          }

          return (
            second.limit -
            first.limit
          );
        });
    }, [
      budgets,
      transactions,
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
    processedBudgets.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );

  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    pageSize;

  const paginatedBudgets =
    processedBudgets.slice(
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
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
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
      !Number.isFinite(parsedSize) ||
      parsedSize <= 0
    ) {
      return;
    }

    setPageSize(parsedSize);
    setCurrentPage(1);
  };

  /* =======================================================
     DELETE HANDLERS
  ======================================================= */

  const handleDeleteRequest = (
    budget
  ) => {
    if (!budget) {
      return;
    }

    setBudgetToDelete(budget);
  };

  const handleCloseDeleteDialog = () => {
    if (deletingId !== null) {
      return;
    }

    setBudgetToDelete(null);
  };

  const handleConfirmDelete =
    async () => {
      const budgetId =
        getBudgetId(
          budgetToDelete
        );

      if (
        budgetId === null ||
        budgetId === undefined
      ) {
        toast.error(
          "Unable to identify this budget."
        );

        return;
      }

      if (
        typeof deleteBudget !==
        "function"
      ) {
        toast.error(
          "Delete budget function is unavailable."
        );

        return;
      }

      const selectedBudget =
        budgetToDelete;

      try {
        setDeletingId(budgetId);

        const result =
          await deleteBudget(
            budgetId
          );

        if (
          result?.success === false
        ) {
          throw new Error(
            result?.error ||
              "Unable to delete budget."
          );
        }

        toast.success(
          `"${getBudgetName(
            selectedBudget
          )}" budget deleted successfully.`
        );

        setBudgetToDelete(null);
      } catch (deleteError) {
        console.error(
          "Unable to delete budget:",
          deleteError
        );

        toast.error(
          deleteError?.message ||
            "Unable to delete budget."
        );
      } finally {
        setDeletingId(null);
      }
    };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading || isLoading) {
    return (
      <LoadingSkeleton
        type="card"
        count={4}
      />
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <EmptyState
        icon={WalletCards}
        title="Unable to load budgets"
        description={
          typeof error === "string"
            ? error
            : error?.message ||
              "Something went wrong while loading your budgets."
        }
        className="min-h-[360px]"
      />
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <section className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative flex flex-col gap-4 border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <WalletCards size={21} />
          </div>

          <div className="min-w-0">
            <h2 className="section-title">
              Category Budgets
            </h2>

            <p className="section-description">
              Monitor spending limits for
              each category.
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400">
          {totalItems}{" "}
          {totalItems === 1
            ? "budget"
            : "budgets"}
        </span>
      </div>

      {totalItems === 0 ? (
        /* Empty state */
        <div className="p-5 sm:p-6">
          <EmptyState
            icon={
              filtersAreActive
                ? SearchX
                : WalletCards
            }
            title={
              filtersAreActive
                ? "No matching budgets"
                : "No budgets yet"
            }
            description={
              filtersAreActive
                ? "No budget matches your current search or status filter. Try changing the selected controls."
                : "Create your first category budget to start controlling your monthly spending."
            }
            actionLabel={
              filtersAreActive
                ? ""
                : "Add Budget"
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
          {/* Budget cards */}
          <div className="grid min-w-0 gap-5 p-4 sm:p-5 md:grid-cols-2 sm:p-6">
            {paginatedBudgets.map(
              (item, index) => {
                const budgetId =
                  getBudgetId(
                    item.budget
                  );

                const cardKey =
                  budgetId ??
                  `${getBudgetName(
                    item.budget
                  )}-${startIndex + index}`;

                return (
                  <BudgetCard
                    key={cardKey}
                    budget={
                      item.budget
                    }
                    spent={item.spent}
                    index={index}
                    onEdit={onEdit}
                    onDelete={
                      handleDeleteRequest
                    }
                    deleting={
                      deletingId ===
                      budgetId
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
            totalPages={totalPages}
            totalItems={totalItems}
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

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(
          budgetToDelete
        )}
        onClose={
          handleCloseDeleteDialog
        }
        onConfirm={
          handleConfirmDelete
        }
        title="Delete budget?"
        description={
          budgetToDelete
            ? `You are about to delete the "${getBudgetName(
                budgetToDelete
              )}" budget.`
            : ""
        }
        confirmLabel="Delete Budget"
        loading={Boolean(deletingId)}
        variant="danger"
      />
    </section>
  );
}

export default BudgetList;