import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import useAuth from "../hooks/useAuth";

import {
  clearStoredDebts,
  createStoredDebt,
  deleteDebtPayment,
  deleteStoredDebt,
  getStoredDebts,
  recordDebtPayment,
  subscribeToDebtStorage,
  updateStoredDebt,
} from "../services/debtStorageService";

import {
  calculateDebtSummary,
  getNextDebtPayment,
  isDebtDueSoon,
  normalizeDebtRecord,
  sortDebtsByDueDate,
} from "../utils/debtCalculations";

/* =========================================================
   CONTEXT
========================================================= */

export const DebtContext =
  createContext(null);

/* =========================================================
   ERROR HELPER
========================================================= */

function getDebtErrorMessage(
  error,
  fallbackMessage
) {
  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  if (
    typeof error === "string" &&
    error.trim()
  ) {
    return error;
  }

  return fallbackMessage;
}

/* =========================================================
   PAYMENT HISTORY HELPER
========================================================= */

/**
 * Combines payment records from every debt into
 * one payment-history array.
 */
function createPaymentHistory(
  debts
) {
  const records =
    Array.isArray(debts)
      ? debts
      : [];

  const history =
    records.flatMap((debt) => {
      const payments =
        Array.isArray(
          debt.payments
        )
          ? debt.payments
          : [];

      return payments.map(
        (payment) => ({
          ...payment,

          debtId: debt.id,

          debtTitle:
            debt.title,

          debtType:
            debt.type,

          partyName:
            debt.partyName,

          direction:
            debt.direction,

          debtStatus:
            debt.status,
        })
      );
    });

  return history.sort(
    (first, second) => {
      const firstDate =
        new Date(
          first.paymentDate ||
            first.createdAt ||
            0
        ).getTime();

      const secondDate =
        new Date(
          second.paymentDate ||
            second.createdAt ||
            0
        ).getTime();

      return secondDate - firstDate;
    }
  );
}

/* =========================================================
   DEBT PROVIDER
========================================================= */

function DebtProvider({
  children,
}) {
  const auth =
    useAuth() || {};

  const currentUser =
    auth.user ||
    auth.session?.user ||
    null;

  const authLoading =
    Boolean(
      auth.loading ||
        auth.isLoading ||
        auth.initializing
    );

  /*
   * The authenticated user ID keeps each account's
   * Debt Center records separate.
   *
   * Email is used only as a fallback when an ID
   * is temporarily unavailable.
   */
  const storageUserId =
    String(
      currentUser?.id ||
        currentUser?.email ||
        ""
    ).trim();

  const [
    debts,
    setDebts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* =======================================================
     NORMALIZE AND SET DEBTS
  ======================================================= */

  const replaceDebts =
    useCallback((records) => {
      const normalizedRecords =
        Array.isArray(records)
          ? records.map(
              normalizeDebtRecord
            )
          : [];

      setDebts(
        normalizedRecords
      );

      return normalizedRecords;
    }, []);

  /* =======================================================
     LOAD DEBTS
  ======================================================= */

  const refreshDebts =
    useCallback(() => {
      setError("");

      try {
        const storedRecords =
          getStoredDebts(
            storageUserId
          );

        return replaceDebts(
          storedRecords
        );
      } catch (loadError) {
        const message =
          getDebtErrorMessage(
            loadError,
            "Unable to load Debt Center records."
          );

        setError(message);
        setDebts([]);

        return [];
      }
    }, [
      replaceDebts,
      storageUserId,
    ]);

  /* =======================================================
     INITIAL LOAD AND STORAGE SUBSCRIPTION
  ======================================================= */

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return undefined;
    }

    setLoading(true);
    setDebts([]);
    setError("");

    try {
      refreshDebts();
    } finally {
      setLoading(false);
    }

    /*
     * This subscription updates the UI when:
     *
     * 1. Debt data changes in the current browser tab.
     * 2. Debt data changes in another browser tab.
     */
    const unsubscribe =
      subscribeToDebtStorage(
        (updatedRecords) => {
          replaceDebts(
            updatedRecords
          );
        },
        storageUserId
      );

    return unsubscribe;
  }, [
    authLoading,
    refreshDebts,
    replaceDebts,
    storageUserId,
  ]);

  /* =======================================================
     ADD NEW DEBT
  ======================================================= */

  const addDebt =
    useCallback(
      (debtData) => {
        setError("");

        try {
          const newDebt =
            createStoredDebt(
              debtData,
              storageUserId
            );

          /*
           * The storage event normally updates the state,
           * but refreshing here makes the result immediate
           * and predictable.
           */
          refreshDebts();

          return newDebt;
        } catch (addError) {
          const message =
            getDebtErrorMessage(
              addError,
              "Unable to add the debt record."
            );

          setError(message);

          throw new Error(message);
        }
      },
      [
        refreshDebts,
        storageUserId,
      ]
    );

  /* =======================================================
     EDIT DEBT
  ======================================================= */

  const editDebt =
    useCallback(
      (
        debtId,
        updates
      ) => {
        setError("");

        try {
          const updatedDebt =
            updateStoredDebt(
              debtId,
              updates,
              storageUserId
            );

          refreshDebts();

          return updatedDebt;
        } catch (editError) {
          const message =
            getDebtErrorMessage(
              editError,
              "Unable to update the debt record."
            );

          setError(message);

          throw new Error(message);
        }
      },
      [
        refreshDebts,
        storageUserId,
      ]
    );

  /* =======================================================
     DELETE DEBT
  ======================================================= */

  const removeDebt =
    useCallback(
      (debtId) => {
        setError("");

        try {
          const wasDeleted =
            deleteStoredDebt(
              debtId,
              storageUserId
            );

          refreshDebts();

          return wasDeleted;
        } catch (deleteError) {
          const message =
            getDebtErrorMessage(
              deleteError,
              "Unable to delete the debt record."
            );

          setError(message);

          throw new Error(message);
        }
      },
      [
        refreshDebts,
        storageUserId,
      ]
    );

  /* =======================================================
     RECORD PAYMENT
  ======================================================= */

  const addPayment =
    useCallback(
      (
        debtId,
        paymentData
      ) => {
        setError("");

        try {
          const result =
            recordDebtPayment(
              debtId,
              paymentData,
              storageUserId
            );

          refreshDebts();

          return result;
        } catch (paymentError) {
          const message =
            getDebtErrorMessage(
              paymentError,
              "Unable to record the payment."
            );

          setError(message);

          throw new Error(message);
        }
      },
      [
        refreshDebts,
        storageUserId,
      ]
    );

  /* =======================================================
     DELETE PAYMENT
  ======================================================= */

  const removePayment =
    useCallback(
      (
        debtId,
        paymentId
      ) => {
        setError("");

        try {
          const updatedDebt =
            deleteDebtPayment(
              debtId,
              paymentId,
              storageUserId
            );

          refreshDebts();

          return updatedDebt;
        } catch (paymentError) {
          const message =
            getDebtErrorMessage(
              paymentError,
              "Unable to delete the payment."
            );

          setError(message);

          throw new Error(message);
        }
      },
      [
        refreshDebts,
        storageUserId,
      ]
    );

  /* =======================================================
     CLEAR ALL DEBT DATA
  ======================================================= */

  const clearAllDebts =
    useCallback(() => {
      setError("");

      try {
        clearStoredDebts(
          storageUserId
        );

        setDebts([]);

        return true;
      } catch (clearError) {
        const message =
          getDebtErrorMessage(
            clearError,
            "Unable to clear Debt Center data."
          );

        setError(message);

        throw new Error(message);
      }
    }, [storageUserId]);

  /* =======================================================
     FIND ONE DEBT
  ======================================================= */

  const getDebtById =
    useCallback(
      (debtId) => {
        const safeDebtId =
          String(
            debtId || ""
          ).trim();

        if (!safeDebtId) {
          return null;
        }

        return (
          debts.find(
            (debt) =>
              debt.id ===
              safeDebtId
          ) || null
        );
      },
      [debts]
    );

  /* =======================================================
     CLEAR ERROR
  ======================================================= */

  const clearDebtError =
    useCallback(() => {
      setError("");
    }, []);

  /* =======================================================
     NORMALIZED AND SORTED DEBTS
  ======================================================= */

  const normalizedDebts =
    useMemo(
      () =>
        debts.map(
          normalizeDebtRecord
        ),
      [debts]
    );

  const sortedDebts =
    useMemo(
      () =>
        sortDebtsByDueDate(
          normalizedDebts
        ),
      [normalizedDebts]
    );

  /* =======================================================
     DEBT SUMMARY
  ======================================================= */

  const summary =
    useMemo(
      () =>
        calculateDebtSummary(
          normalizedDebts
        ),
      [normalizedDebts]
    );

  /* =======================================================
     PAYABLE AND RECEIVABLE RECORDS
  ======================================================= */

  const payableDebts =
    useMemo(
      () =>
        sortedDebts.filter(
          (debt) =>
            debt.direction ===
            "payable"
        ),
      [sortedDebts]
    );

  const receivableDebts =
    useMemo(
      () =>
        sortedDebts.filter(
          (debt) =>
            debt.direction ===
            "receivable"
        ),
      [sortedDebts]
    );

  /* =======================================================
     STATUS GROUPS
  ======================================================= */

  const activeDebts =
    useMemo(
      () =>
        sortedDebts.filter(
          (debt) =>
            debt.status !==
            "completed"
        ),
      [sortedDebts]
    );

  const completedDebts =
    useMemo(
      () =>
        sortedDebts.filter(
          (debt) =>
            debt.status ===
            "completed"
        ),
      [sortedDebts]
    );

  const overdueDebts =
    useMemo(
      () =>
        sortedDebts.filter(
          (debt) =>
            debt.status ===
            "overdue"
        ),
      [sortedDebts]
    );

  const upcomingDebts =
    useMemo(
      () =>
        sortedDebts.filter(
          (debt) => {
            if (
              debt.status ===
                "completed" ||
              debt.status ===
                "overdue"
            ) {
              return false;
            }

            return isDebtDueSoon(
              debt,
              30
            );
          }
        ),
      [sortedDebts]
    );

  /* =======================================================
     PAYMENT HISTORY
  ======================================================= */

  const paymentHistory =
    useMemo(
      () =>
        createPaymentHistory(
          normalizedDebts
        ),
      [normalizedDebts]
    );

  /* =======================================================
     NEXT PAYMENT
  ======================================================= */

  const nextPayment =
    useMemo(
      () =>
        getNextDebtPayment(
          normalizedDebts
        ),
      [normalizedDebts]
    );

  /* =======================================================
     PROVIDER VALUE
  ======================================================= */

  const contextValue =
    useMemo(
      () => ({
        /* Current authenticated storage owner */

        userId:
          storageUserId,

        /* State */

        debts:
          sortedDebts,

        loading:
          loading ||
          authLoading,

        error,

        hasDebtData:
          sortedDebts.length >
          0,

        /* Calculated information */

        summary,

        nextPayment,

        paymentHistory,

        /* Grouped records */

        payableDebts,

        receivableDebts,

        activeDebts,

        completedDebts,

        overdueDebts,

        upcomingDebts,

        /* Main actions */

        addDebt,

        editDebt,

        removeDebt,

        addPayment,

        removePayment,

        clearAllDebts,

        refreshDebts,

        getDebtById,

        clearDebtError,

        /*
         * Alternative action names.
         * These make the context easier to use in different
         * components without changing its logic.
         */

        createDebt:
          addDebt,

        updateDebt:
          editDebt,

        deleteDebt:
          removeDebt,

        recordPayment:
          addPayment,

        deletePayment:
          removePayment,
      }),
      [
        storageUserId,
        sortedDebts,
        loading,
        authLoading,
        error,
        summary,
        nextPayment,
        paymentHistory,
        payableDebts,
        receivableDebts,
        activeDebts,
        completedDebts,
        overdueDebts,
        upcomingDebts,
        addDebt,
        editDebt,
        removeDebt,
        addPayment,
        removePayment,
        clearAllDebts,
        refreshDebts,
        getDebtById,
        clearDebtError,
      ]
    );

  return (
    <DebtContext.Provider
      value={contextValue}
    >
      {children}
    </DebtContext.Provider>
  );
}

export default DebtProvider;