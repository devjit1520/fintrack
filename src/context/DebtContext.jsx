import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import useAuth from "../hooks/useAuth";

import {
  clearDebtRecords,
  createDebtPayment,
  createDebtRecord,
  deleteDebtPayment,
  deleteDebtRecord,
  loadDebtRecords,
  subscribeToDebtStorage,
  updateDebtRecord,
} from "../services/debtStorageService";

import {
  calculateDebtSummary,
  getNextDebtPayment,
  normalizeDebtRecord,
} from "../utils/debtCalculations";

/* =========================================================
   CONTEXT
========================================================= */

export const DebtContext =
  createContext(null);

/* =========================================================
   DEBT PROVIDER
========================================================= */

function DebtProvider({
  children,
}) {
  /* =======================================================
     AUTH
  ======================================================= */

  const auth =
    useAuth() || {};

  const {
    user,
  } = auth;

  /*
    Storage is separated by user.

    Supabase normally provides user.id.
    Email is included as a safe fallback.
  */

  const userKey =
    user?.id ||
    user?.email ||
    null;

  /* =======================================================
     STATE
  ======================================================= */

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
  ] = useState(null);

  /* =======================================================
     CLEAR ERROR
  ======================================================= */

  const clearDebtError =
    useCallback(() => {
      setError(null);
    }, []);

  /* =======================================================
     LOAD / REFRESH
  ======================================================= */

  const refreshDebts =
    useCallback(() => {
      if (!userKey) {
        setDebts([]);
        setLoading(false);

        return [];
      }

      try {
        const records =
          loadDebtRecords(
            userKey
          );

        const normalized =
          (
            Array.isArray(
              records
            )
              ? records
              : []
          ).map(
            (record) =>
              normalizeDebtRecord(
                record
              )
          );

        setDebts(
          normalized
        );

        setError(null);

        return normalized;
      } catch (
        refreshError
      ) {
        console.error(
          "Unable to load debt records:",
          refreshError
        );

        setError(
          refreshError
        );

        return [];
      } finally {
        setLoading(false);
      }
    }, [userKey]);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    setLoading(true);

    refreshDebts();
  }, [refreshDebts]);

  /* =======================================================
     STORAGE SYNC
  ======================================================= */

  useEffect(() => {
    if (!userKey) {
      return undefined;
    }

    const unsubscribe =
      subscribeToDebtStorage(
        userKey,
        () => {
          refreshDebts();
        }
      );

    return unsubscribe;
  }, [
    userKey,
    refreshDebts,
  ]);

  /* =======================================================
     ADD DEBT
  ======================================================= */

  const addDebt =
    useCallback(
      async (
        payload = {}
      ) => {
        if (!userKey) {
          const authError =
            new Error(
              "You must be logged in to add a debt record."
            );

          setError(
            authError
          );

          throw authError;
        }

        try {
          setError(null);

          const record =
            createDebtRecord(
              userKey,
              payload
            );

          /*
            Update immediately so the
            new record appears without
            waiting for another render.
          */

          const normalized =
            normalizeDebtRecord(
              record
            );

          setDebts(
            (current) => {
              const withoutDuplicate =
                current.filter(
                  (item) =>
                    item.id !==
                    normalized.id
                );

              return [
                normalized,
                ...withoutDuplicate,
              ];
            }
          );

          return normalized;
        } catch (
          addError
        ) {
          console.error(
            "Unable to add debt:",
            addError
          );

          setError(
            addError
          );

          throw addError;
        }
      },
      [userKey]
    );

  /* =======================================================
     EDIT DEBT
  ======================================================= */

  const editDebt =
    useCallback(
      async (
        recordId,
        updates = {}
      ) => {
        if (!userKey) {
          throw new Error(
            "You must be logged in to edit debt records."
          );
        }

        if (!recordId) {
          throw new Error(
            "Debt record ID is required."
          );
        }

        try {
          setError(null);

          const updated =
            updateDebtRecord(
              userKey,
              recordId,
              updates
            );

          const normalized =
            normalizeDebtRecord(
              updated
            );

          setDebts(
            (current) =>
              current.map(
                (record) =>
                  record.id ===
                  recordId
                    ? normalized
                    : record
              )
          );

          return normalized;
        } catch (
          editError
        ) {
          console.error(
            "Unable to edit debt:",
            editError
          );

          setError(
            editError
          );

          throw editError;
        }
      },
      [userKey]
    );

  /* =======================================================
     REMOVE DEBT
  ======================================================= */

  const removeDebt =
    useCallback(
      async (
        recordId
      ) => {
        if (!userKey) {
          throw new Error(
            "You must be logged in to delete debt records."
          );
        }

        if (!recordId) {
          throw new Error(
            "Debt record ID is required."
          );
        }

        try {
          setError(null);

          const removed =
            deleteDebtRecord(
              userKey,
              recordId
            );

          if (!removed) {
            throw new Error(
              "Debt record was not found."
            );
          }

          setDebts(
            (current) =>
              current.filter(
                (record) =>
                  record.id !==
                  recordId
              )
          );

          return true;
        } catch (
          removeError
        ) {
          console.error(
            "Unable to delete debt:",
            removeError
          );

          setError(
            removeError
          );

          throw removeError;
        }
      },
      [userKey]
    );

  /* =======================================================
     ADD PAYMENT
  ======================================================= */

  const addPayment =
    useCallback(
      async (
        recordId,
        payload = {}
      ) => {
        if (!userKey) {
          throw new Error(
            "You must be logged in to record a payment."
          );
        }

        if (!recordId) {
          throw new Error(
            "Debt record ID is required."
          );
        }

        try {
          setError(null);

          const payment =
            createDebtPayment(
              userKey,
              recordId,
              payload
            );

          /*
            Reload because recording a
            payment can change:

            - remaining amount
            - status
            - due date
            - progress
            - payment history
          */

          refreshDebts();

          return payment;
        } catch (
          paymentError
        ) {
          console.error(
            "Unable to record debt payment:",
            paymentError
          );

          setError(
            paymentError
          );

          throw paymentError;
        }
      },
      [
        userKey,
        refreshDebts,
      ]
    );

  /* =======================================================
     REMOVE PAYMENT
  ======================================================= */

  const removePayment =
    useCallback(
      async (
        recordId,
        paymentId
      ) => {
        if (!userKey) {
          throw new Error(
            "You must be logged in to remove a payment."
          );
        }

        if (
          !recordId ||
          !paymentId
        ) {
          throw new Error(
            "Debt and payment IDs are required."
          );
        }

        try {
          setError(null);

          const removed =
            deleteDebtPayment(
              userKey,
              recordId,
              paymentId
            );

          if (!removed) {
            throw new Error(
              "Payment record was not found."
            );
          }

          refreshDebts();

          return true;
        } catch (
          paymentError
        ) {
          console.error(
            "Unable to remove payment:",
            paymentError
          );

          setError(
            paymentError
          );

          throw paymentError;
        }
      },
      [
        userKey,
        refreshDebts,
      ]
    );

  /* =======================================================
     CLEAR ALL DEBT DATA
  ======================================================= */

  const clearAllDebts =
    useCallback(
      async () => {
        if (!userKey) {
          return;
        }

        try {
          clearDebtRecords(
            userKey
          );

          setDebts([]);
          setError(null);
        } catch (
          clearError
        ) {
          console.error(
            "Unable to clear debt records:",
            clearError
          );

          setError(
            clearError
          );

          throw clearError;
        }
      },
      [userKey]
    );

  /* =======================================================
     NORMALIZED DEBTS
  ======================================================= */

  const normalizedDebts =
    useMemo(() => {
      return (
        Array.isArray(debts)
          ? debts
          : []
      ).map(
        (record) =>
          normalizeDebtRecord(
            record
          )
      );
    }, [debts]);

  /* =======================================================
     LOANS & EMI
  ======================================================= */

  const loanDebts =
    useMemo(() => {
      return normalizedDebts.filter(
        (record) =>
          record.type ===
            "loan" ||
          record.type === "emi"
      );
    }, [
      normalizedDebts,
    ]);

  /* =======================================================
     BORROWED MONEY
  ======================================================= */

  const borrowedDebts =
    useMemo(() => {
      return normalizedDebts.filter(
        (record) => {
          if (
            record.type ===
            "borrowed"
          ) {
            return true;
          }

          return (
            record.direction ===
              "payable" &&
            record.type !==
              "loan" &&
            record.type !==
              "emi"
          );
        }
      );
    }, [
      normalizedDebts,
    ]);

  /* =======================================================
     MONEY LENT
  ======================================================= */

  const lentDebts =
    useMemo(() => {
      return normalizedDebts.filter(
        (record) =>
          record.type ===
            "lent" ||
          record.direction ===
            "receivable"
      );
    }, [
      normalizedDebts,
    ]);

  /* =======================================================
     ACTIVE
  ======================================================= */

  const activeDebts =
    useMemo(() => {
      return normalizedDebts.filter(
        (record) =>
          record.status !==
            "completed"
      );
    }, [
      normalizedDebts,
    ]);

  /* =======================================================
     OVERDUE
  ======================================================= */

  const overdueDebts =
    useMemo(() => {
      return normalizedDebts.filter(
        (record) =>
          record.status ===
            "overdue"
      );
    }, [
      normalizedDebts,
    ]);

  /* =======================================================
     COMPLETED
  ======================================================= */

  const completedDebts =
    useMemo(() => {
      return normalizedDebts.filter(
        (record) =>
          record.status ===
            "completed"
      );
    }, [
      normalizedDebts,
    ]);

  /* =======================================================
     PAYMENT HISTORY
  ======================================================= */

  const paymentHistory =
    useMemo(() => {
      const history = [];

      normalizedDebts.forEach(
        (record) => {
          const payments =
            Array.isArray(
              record.payments
            )
              ? record.payments
              : [];

          payments.forEach(
            (payment) => {
              history.push({
                ...payment,

                debtId:
                  record.id,

                debtTitle:
                  record.title,

                title:
                  record.title,

                debtType:
                  record.type,

                recordType:
                  record.type,

                partyName:
                  record.partyName,

                direction:
                  payment.direction ||
                  record.direction,

                paymentType:
                  payment.paymentType ||
                  payment.type ||
                  (record.direction ===
                  "receivable"
                    ? "received"
                    : "paid"),
              });
            }
          );
        }
      );

      return history.sort(
        (a, b) => {
          const aTime =
            new Date(
              a.paymentDate ||
                a.date ||
                a.createdAt ||
                0
            ).getTime();

          const bTime =
            new Date(
              b.paymentDate ||
                b.date ||
                b.createdAt ||
                0
            ).getTime();

          return (
            bTime - aTime
          );
        }
      );
    }, [
      normalizedDebts,
    ]);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const summary =
    useMemo(() => {
      try {
        return calculateDebtSummary(
          normalizedDebts
        );
      } catch (
        summaryError
      ) {
        console.error(
          "Unable to calculate debt summary:",
          summaryError
        );

        return {
          totalPayable: 0,
          totalReceivable: 0,
          overdueAmount: 0,
          totalPaid: 0,
          activeCount: 0,
          overdueCount: 0,
          completedCount: 0,
        };
      }
    }, [
      normalizedDebts,
    ]);

  /* =======================================================
     NEXT PAYMENT
  ======================================================= */

  const nextPayment =
    useMemo(() => {
      try {
        return (
          getNextDebtPayment(
            normalizedDebts
          ) || null
        );
      } catch (
        nextError
      ) {
        console.error(
          "Unable to calculate next debt payment:",
          nextError
        );

        return null;
      }
    }, [
      normalizedDebts,
    ]);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value =
    useMemo(
      () => ({
        /* State */

        debts:
          normalizedDebts,

        loading,

        error,

        /* Calculated */

        summary,

        nextPayment,

        paymentHistory,

        /* Groups */

        loanDebts,

        borrowedDebts,

        lentDebts,

        activeDebts,

        overdueDebts,

        completedDebts,

        /* Actions */

        addDebt,

        editDebt,

        removeDebt,

        addPayment,

        removePayment,

        refreshDebts,

        clearAllDebts,

        clearDebtError,

        /* Aliases */

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
        normalizedDebts,
        loading,
        error,
        summary,
        nextPayment,
        paymentHistory,
        loanDebts,
        borrowedDebts,
        lentDebts,
        activeDebts,
        overdueDebts,
        completedDebts,
        addDebt,
        editDebt,
        removeDebt,
        addPayment,
        removePayment,
        refreshDebts,
        clearAllDebts,
        clearDebtError,
      ]
    );

  return (
    <DebtContext.Provider
      value={value}
    >
      {children}
    </DebtContext.Provider>
  );
}

export default DebtProvider;