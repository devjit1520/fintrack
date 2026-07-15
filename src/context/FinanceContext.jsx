import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import useAuth from "../hooks/useAuth";
import useActivity from "../hooks/useActivity";

import {
  createTransaction,
  deleteTransactionRecord,
  getTransactions,
  updateTransactionRecord,
} from "../services/transactionService";

export const FinanceContext =
  createContext(null);

function mapTransaction(row) {
  return {
    id: row.id,
    userId: row.user_id,

    title: row.title,
    amount: Number(row.amount),

    type: row.type,
    category: row.category || "Other",

    date:
      row.transaction_date ||
      row.created_at?.slice(0, 10),

    note: row.note || "",

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function FinanceProvider({ children }) {
  const { user, loading: authLoading } =
    useAuth();

  const { addActivity } =
    useActivity();

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadTransactions =
    useCallback(async () => {
      if (!user?.id) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result =
          await getTransactions(
            user.id
          );

        if (result.error) {
          throw result.error;
        }

        setTransactions(
          result.data.map(
            mapTransaction
          )
        );
      } catch (loadError) {
        console.error(
          "Failed to load transactions:",
          loadError
        );

        setTransactions([]);

        setError(
          loadError.message ||
            "Unable to load transactions."
        );
      } finally {
        setLoading(false);
      }
    }, [user?.id]);

  useEffect(() => {
    if (authLoading) return;

    loadTransactions();
  }, [
    authLoading,
    loadTransactions,
  ]);

  const addTransaction =
    useCallback(
      async (transactionData) => {
        if (!user?.id) {
          return {
            success: false,
            error:
              "You must be logged in.",
          };
        }

        try {
          setError("");

          const result =
            await createTransaction(
              user.id,
              transactionData
            );

          if (result.error) {
            throw result.error;
          }

          const newTransaction =
            mapTransaction(result.data);

          setTransactions(
            (current) => [
              newTransaction,
              ...current,
            ]
          );

          addActivity({
            type: "transaction",

            title:
              newTransaction.type ===
              "income"
                ? "Income added"
                : "Expense added",

            description: `${
              newTransaction.title
            } • ₹${newTransaction.amount.toLocaleString(
              "en-IN"
            )}`,

            metadata: {
              transactionId:
                newTransaction.id,
            },
          });

          return {
            success: true,
            data: newTransaction,
          };
        } catch (addError) {
          console.error(
            "Failed to add transaction:",
            addError
          );

          const message =
            addError.message ||
            "Unable to add transaction.";

          setError(message);

          return {
            success: false,
            error: message,
          };
        }
      },
      [user?.id, addActivity]
    );

  const updateTransaction =
    useCallback(
      async (
        transactionId,
        updates
      ) => {
        if (!user?.id) {
          return {
            success: false,
            error:
              "You must be logged in.",
          };
        }

        try {
          setError("");

          const result =
            await updateTransactionRecord(
              user.id,
              transactionId,
              updates
            );

          if (result.error) {
            throw result.error;
          }

          const updatedTransaction =
            mapTransaction(result.data);

          setTransactions(
            (current) =>
              current.map(
                (transaction) =>
                  transaction.id ===
                  transactionId
                    ? updatedTransaction
                    : transaction
              )
          );

          addActivity({
            type: "transaction",
            title:
              "Transaction updated",
            description:
              updatedTransaction.title,
            metadata: {
              transactionId:
                updatedTransaction.id,
            },
          });

          return {
            success: true,
            data: updatedTransaction,
          };
        } catch (updateError) {
          console.error(
            "Failed to update transaction:",
            updateError
          );

          const message =
            updateError.message ||
            "Unable to update transaction.";

          setError(message);

          return {
            success: false,
            error: message,
          };
        }
      },
      [user?.id, addActivity]
    );

  const deleteTransaction =
    useCallback(
      async (transactionId) => {
        if (!user?.id) {
          return {
            success: false,
            error:
              "You must be logged in.",
          };
        }

        const existingTransaction =
          transactions.find(
            (transaction) =>
              transaction.id ===
              transactionId
          );

        try {
          setError("");

          const result =
            await deleteTransactionRecord(
              user.id,
              transactionId
            );

          if (result.error) {
            throw result.error;
          }

          setTransactions(
            (current) =>
              current.filter(
                (transaction) =>
                  transaction.id !==
                  transactionId
              )
          );

          addActivity({
            type: "transaction",
            title:
              "Transaction deleted",
            description:
              existingTransaction?.title ||
              "A transaction was removed.",
          });

          return {
            success: true,
          };
        } catch (deleteError) {
          console.error(
            "Failed to delete transaction:",
            deleteError
          );

          const message =
            deleteError.message ||
            "Unable to delete transaction.";

          setError(message);

          return {
            success: false,
            error: message,
          };
        }
      },
      [
        user?.id,
        transactions,
        addActivity,
      ]
    );

  const clearTransactions =
    useCallback(async () => {
      if (!user?.id) return;

      try {
        setError("");

        const results =
          await Promise.all(
            transactions.map(
              (transaction) =>
                deleteTransactionRecord(
                  user.id,
                  transaction.id
                )
            )
          );

        const failedResult =
          results.find(
            (result) =>
              result.error
          );

        if (failedResult?.error) {
          throw failedResult.error;
        }

        setTransactions([]);

        addActivity({
          type: "transaction",
          title:
            "All transactions cleared",
          description:
            "The transaction history was removed.",
        });
      } catch (clearError) {
        console.error(
          "Unable to clear transactions:",
          clearError
        );

        setError(
          clearError.message ||
            "Unable to clear transactions."
        );
      }
    }, [
      user?.id,
      transactions,
      addActivity,
    ]);

  const summary = useMemo(() => {
    const income =
      transactions.reduce(
        (total, transaction) =>
          transaction.type ===
          "income"
            ? total +
              Number(
                transaction.amount
              )
            : total,
        0
      );

    const expense =
      transactions.reduce(
        (total, transaction) =>
          transaction.type ===
          "expense"
            ? total +
              Number(
                transaction.amount
              )
            : total,
        0
      );

    return {
      income,
      expense,
      balance: income - expense,
      savings: income - expense,
    };
  }, [transactions]);

  const value = useMemo(
    () => ({
      transactions,
      summary,

      loading,
      error,

      loadTransactions,

      addTransaction,
      updateTransaction,
      deleteTransaction,
      clearTransactions,
    }),
    [
      transactions,
      summary,
      loading,
      error,
      loadTransactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      clearTransactions,
    ]
  );

  return (
    <FinanceContext.Provider
      value={value}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export default FinanceProvider;