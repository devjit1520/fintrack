import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  Pencil,
  Plus,
  ReceiptText,
  Trash2,
} from "lucide-react";

import useFinance from "../../hooks/useFinance";
import EmptyState from "../common/EmptyState";
import ConfirmDialog from "../common/ConfirmDialog";
import Pagination from "../common/Pagination";

/* =========================================================
   HELPERS
========================================================= */

function getSafeAmount(value) {
  const amount = Number(value);

  return Number.isFinite(amount)
    ? amount
    : 0;
}

function getDateTimestamp(value) {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(getSafeAmount(value));
}

function formatDate(value) {
  if (!value) {
    return "No date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/* =========================================================
   COMPONENT
========================================================= */

function TransactionTable({
  search = "",
  filter = "all",
  category = "all",
  sort = "newest",
  onEdit,
  onAdd,
}) {
  const finance = useFinance() || {};

  const {
    transactions = [],
    deleteTransaction,
    loading = false,
    error = null,
  } = finance;

  const safeTransactions =
    Array.isArray(transactions)
      ? transactions
      : [];

  /* =======================================================
     STATE — MUST REMAIN INSIDE THE COMPONENT
  ======================================================= */

  const [deletingId, setDeletingId] =
    useState(null);

  const [
    transactionToDelete,
    setTransactionToDelete,
  ] = useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(5);

  /* =======================================================
     NORMALIZED FILTER VALUES
  ======================================================= */

  const normalizedSearch = String(
    search || ""
  )
    .trim()
    .toLowerCase();

  const normalizedFilter = String(
    filter || "all"
  ).toLowerCase();

  const normalizedCategory = String(
    category || "all"
  ).toLowerCase();

  const normalizedSort = String(
    sort || "newest"
  ).toLowerCase();

  /* =======================================================
     FILTER AND SORT TRANSACTIONS
  ======================================================= */

  const filteredTransactions = [
    ...safeTransactions,
  ]
    .filter((transaction) => {
      const title = String(
        transaction?.title || ""
      ).toLowerCase();

      const transactionCategory = String(
        transaction?.category || ""
      ).toLowerCase();

      const transactionType = String(
        transaction?.type || ""
      ).toLowerCase();

      const note = String(
        transaction?.note || ""
      ).toLowerCase();

      const matchesSearch =
        normalizedSearch === "" ||
        title.includes(normalizedSearch) ||
        transactionCategory.includes(
          normalizedSearch
        ) ||
        note.includes(normalizedSearch);

      const matchesType =
        normalizedFilter === "all" ||
        transactionType ===
          normalizedFilter;

      const matchesCategory =
        normalizedCategory === "all" ||
        transactionCategory ===
          normalizedCategory;

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory
      );
    })
    .sort((first, second) => {
      const firstAmount = getSafeAmount(
        first?.amount
      );

      const secondAmount = getSafeAmount(
        second?.amount
      );

      if (normalizedSort === "highest") {
        return secondAmount - firstAmount;
      }

      if (normalizedSort === "lowest") {
        return firstAmount - secondAmount;
      }

      const firstDate = getDateTimestamp(
        first?.date || first?.createdAt
      );

      const secondDate = getDateTimestamp(
        second?.date || second?.createdAt
      );

      if (normalizedSort === "oldest") {
        return firstDate - secondDate;
      }

      return secondDate - firstDate;
    });

  const filtersAreActive =
    normalizedSearch !== "" ||
    normalizedFilter !== "all" ||
    normalizedCategory !== "all";

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalItems =
    filteredTransactions.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );

  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * pageSize;

  const paginatedTransactions =
    filteredTransactions.slice(
      startIndex,
      startIndex + pageSize
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    normalizedSearch,
    normalizedFilter,
    normalizedCategory,
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
    const parsedPageSize = Number(
      nextPageSize
    );

    if (
      !Number.isFinite(parsedPageSize) ||
      parsedPageSize <= 0
    ) {
      return;
    }

    setPageSize(parsedPageSize);
    setCurrentPage(1);
  };

  /* =======================================================
     DELETE HANDLERS
  ======================================================= */

  const handleDeleteRequest = (
    transaction
  ) => {
    if (!transaction) {
      return;
    }

    setTransactionToDelete(transaction);
  };

  const handleCloseDeleteDialog = () => {
    if (deletingId !== null) {
      return;
    }

    setTransactionToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete?.id) {
      return;
    }

    if (
      typeof deleteTransaction !==
      "function"
    ) {
      toast.error(
        "Delete transaction function is unavailable."
      );

      return;
    }

    const selectedTransaction =
      transactionToDelete;

    try {
      setDeletingId(
        selectedTransaction.id
      );

      const result =
        await deleteTransaction(
          selectedTransaction.id
        );

      if (result?.success === false) {
        throw new Error(
          result?.error ||
            "Unable to delete transaction."
        );
      }

      toast.success(
        `"${selectedTransaction.title || "Transaction"}" deleted successfully.`
      );

      setTransactionToDelete(null);
    } catch (deleteError) {
      console.error(
        "Unable to delete transaction:",
        deleteError
      );

      toast.error(
        deleteError?.message ||
          "Unable to delete transaction."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="animate-pulse">
          <div className="h-8 w-52 rounded-lg bg-slate-200 dark:bg-slate-800" />

          <div className="mt-3 h-4 w-72 max-w-full rounded bg-slate-100 dark:bg-slate-800/70" />

          <div className="mt-7 space-y-3">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800"
                />
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative flex flex-col gap-4 border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <ReceiptText size={23} />
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight text-slate-950 dark:text-white sm:text-2xl">
              Transaction History
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your income and
              expenses.
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit shrink-0 items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
          {totalItems}{" "}
          {totalItems === 1
            ? "record"
            : "records"}
        </div>
      </div>

      {/* Error state */}
      {error ? (
        <div className="p-5 sm:p-6">
          <EmptyState
            icon={ReceiptText}
            title="Unable to load transactions"
            description={
              typeof error === "string"
                ? error
                : error?.message ||
                  "Something went wrong while loading your transactions."
            }
            className="min-h-[260px]"
          />
        </div>
      ) : totalItems === 0 ? (
        /* Empty state */
        <div className="p-5 sm:p-6">
          <EmptyState
            icon={ReceiptText}
            title={
              filtersAreActive
                ? "No matching transactions"
                : "No transactions yet"
            }
            description={
              filtersAreActive
                ? "No transaction matches your current search or filters. Try changing the selected options."
                : "Add your first income or expense to begin tracking your finances."
            }
            actionLabel={
              filtersAreActive
                ? ""
                : "Add Transaction"
            }
            actionIcon={Plus}
            onAction={
              filtersAreActive
                ? undefined
                : onAdd
            }
            className="min-h-[300px]"
          />
        </div>
      ) : (
        <>
          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div className="custom-scroll-area hidden max-h-[560px] overflow-auto lg:block">
            <table className="w-full min-w-[900px]">
              <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Transaction
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedTransactions.map(
                  (
                    transaction,
                    index
                  ) => {
                    const isIncome =
                      String(
                        transaction?.type ||
                          ""
                      ).toLowerCase() ===
                      "income";

                    const transactionTitle =
                      transaction?.title ||
                      "Untitled Transaction";

                    const transactionKey =
                      transaction?.id ??
                      `${transactionTitle}-${startIndex + index}`;

                    return (
                      <motion.tr
                        key={transactionKey}
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.28,
                          delay: Math.min(
                            index * 0.03,
                            0.3
                          ),
                        }}
                        className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                      >
                        {/* Transaction */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={[
                                "flex h-11 w-11 shrink-0",
                                "items-center justify-center",
                                "rounded-2xl",
                                isIncome
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : "bg-red-500/10 text-red-600 dark:text-red-400",
                              ].join(" ")}
                            >
                              {isIncome ? (
                                <ArrowUpCircle
                                  size={21}
                                />
                              ) : (
                                <ArrowDownCircle
                                  size={21}
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[220px] truncate font-semibold text-slate-900 dark:text-white">
                                {
                                  transactionTitle
                                }
                              </p>

                              {transaction?.note && (
                                <p className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                                  {
                                    transaction.note
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            {transaction?.category ||
                              "Other"}
                          </span>
                        </td>

                        {/* Type */}
                        <td className="px-6 py-5">
                          <span
                            className={[
                              "inline-flex rounded-full",
                              "px-3 py-1.5 text-xs",
                              "font-bold capitalize",
                              isIncome
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-red-500/10 text-red-600 dark:text-red-400",
                            ].join(" ")}
                          >
                            {isIncome
                              ? "Income"
                              : "Expense"}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <CalendarDays
                              size={15}
                              className="shrink-0 text-slate-400"
                            />

                            {formatDate(
                              transaction?.date ||
                                transaction?.createdAt
                            )}
                          </div>
                        </td>

                        {/* Amount */}
                        <td
                          className={[
                            "px-6 py-5 text-right",
                            "text-sm font-black",
                            isIncome
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400",
                          ].join(" ")}
                        >
                          {isIncome
                            ? "+"
                            : "-"}
                          {formatCurrency(
                            transaction?.amount
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                onEdit?.(
                                  transaction
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400"
                              aria-label={`Edit ${transactionTitle}`}
                            >
                              <Pencil
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteRequest(
                                  transaction
                                )
                              }
                              disabled={
                                deletingId ===
                                transaction.id
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-600 transition hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
                              aria-label={`Delete ${transactionTitle}`}
                            >
                              {deletingId ===
                              transaction.id ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
                                <Trash2
                                  size={16}
                                />
                              )}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>

          {/* =================================================
              MOBILE CARDS
          ================================================= */}

          <div className="space-y-3 p-4 lg:hidden">
            {paginatedTransactions.map(
              (
                transaction,
                index
              ) => {
                const isIncome =
                  String(
                    transaction?.type || ""
                  ).toLowerCase() ===
                  "income";

                const transactionTitle =
                  transaction?.title ||
                  "Untitled Transaction";

                const transactionKey =
                  transaction?.id ??
                  `${transactionTitle}-${startIndex + index}`;

                return (
                  <motion.article
                    key={transactionKey}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(
                        index * 0.04,
                        0.3
                      ),
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={[
                            "flex h-11 w-11 shrink-0",
                            "items-center justify-center",
                            "rounded-2xl",
                            isIncome
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-red-500/10 text-red-600 dark:text-red-400",
                          ].join(" ")}
                        >
                          {isIncome ? (
                            <ArrowUpCircle
                              size={20}
                            />
                          ) : (
                            <ArrowDownCircle
                              size={20}
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-bold text-slate-900 dark:text-white">
                            {
                              transactionTitle
                            }
                          </h3>

                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {transaction?.category ||
                              "Other"}
                          </p>
                        </div>
                      </div>

                      <p
                        className={[
                          "shrink-0 text-sm font-black",
                          isIncome
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400",
                        ].join(" ")}
                      >
                        {isIncome
                          ? "+"
                          : "-"}
                        {formatCurrency(
                          transaction?.amount
                        )}
                      </p>
                    </div>

                    {transaction?.note && (
                      <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {transaction.note}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                      <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
                        <CalendarDays
                          size={14}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {formatDate(
                            transaction?.date ||
                              transaction?.createdAt
                          )}
                        </span>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onEdit?.(
                              transaction
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400"
                          aria-label={`Edit ${transactionTitle}`}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteRequest(
                              transaction
                            )
                          }
                          disabled={
                            deletingId ===
                            transaction.id
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-600 transition hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
                          aria-label={`Delete ${transactionTitle}`}
                        >
                          {deletingId ===
                          transaction.id ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              }
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            pageSizeOptions={[
              5,
              10,
              20,
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
          transactionToDelete
        )}
        onClose={
          handleCloseDeleteDialog
        }
        onConfirm={
          handleConfirmDelete
        }
        title="Delete transaction?"
        description={
          transactionToDelete
            ? `You are about to delete "${
                transactionToDelete.title ||
                "this transaction"
              }".`
            : ""
        }
        confirmLabel="Delete Transaction"
        loading={Boolean(deletingId)}
        variant="danger"
      />
    </section>
  );
}

export default TransactionTable;