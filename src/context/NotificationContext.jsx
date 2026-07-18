import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import useAuth from "../hooks/useAuth";
import useFinance from "../hooks/useFinance";
import useBudget from "../hooks/useBudget";
import useGoal from "../hooks/useGoal";

export const NotificationContext =
  createContext(null);

/* =========================================================
   HELPERS
========================================================= */

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function normalizeIdPart(value) {
  return String(value ?? "unknown")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getStorageKey(userId) {
  return `fintrack-notifications-${userId}`;
}

function createEmptyState() {
  return {
    readIds: [],
    dismissedIds: [],
  };
}

function loadNotificationState(userId) {
  if (!userId) {
    return createEmptyState();
  }

  try {
    const savedState = localStorage.getItem(
      getStorageKey(userId)
    );

    if (!savedState) {
      return createEmptyState();
    }

    const parsed = JSON.parse(savedState);

    return {
      readIds: Array.isArray(parsed.readIds)
        ? parsed.readIds
        : [],

      dismissedIds: Array.isArray(
        parsed.dismissedIds
      )
        ? parsed.dismissedIds
        : [],
    };
  } catch (error) {
    console.error(
      "Unable to load notification state:",
      error
    );

    return createEmptyState();
  }
}

function saveNotificationState(
  userId,
  nextState
) {
  if (!userId) {
    return;
  }

  try {
    localStorage.setItem(
      getStorageKey(userId),
      JSON.stringify(nextState)
    );
  } catch (error) {
    console.error(
      "Unable to save notification state:",
      error
    );
  }
}

function getTimestamp(value) {
  const timestamp = new Date(
    value || 0
  ).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

/* =========================================================
   PROVIDER
========================================================= */

function NotificationProvider({
  children,
}) {
  const {
    user,
  } = useAuth();

  const {
    transactions = [],
  } = useFinance() || {};

  const {
    budgets = [],
  } = useBudget() || {};

  const {
    goals = [],
  } = useGoal() || {};

  const userId = user?.id || "";

  const [
    notificationState,
    setNotificationState,
  ] = useState(createEmptyState);

  /* =======================================================
     LOAD CURRENT USER'S SAVED STATE
  ======================================================= */

  useEffect(() => {
    setNotificationState(
      loadNotificationState(userId)
    );
  }, [userId]);

  /* =======================================================
     UPDATE AND SAVE STATE
  ======================================================= */

  const updateNotificationState =
    useCallback(
      (updater) => {
        setNotificationState(
          (currentState) => {
            const nextState =
              typeof updater === "function"
                ? updater(currentState)
                : updater;

            saveNotificationState(
              userId,
              nextState
            );

            return nextState;
          }
        );
      },
      [userId]
    );

  /* =======================================================
     GENERATE STABLE NOTIFICATIONS
  ======================================================= */

  const generatedNotifications =
    useMemo(() => {
      if (!userId) {
        return [];
      }

      const items = [];

      /* Latest transactions */

      const latestTransactions = [
        ...transactions,
      ]
        .sort((first, second) => {
          const firstTime = getTimestamp(
            first.createdAt ||
              first.created_at ||
              first.date
          );

          const secondTime = getTimestamp(
            second.createdAt ||
              second.created_at ||
              second.date
          );

          return secondTime - firstTime;
        })
        .slice(0, 5);

      latestTransactions.forEach(
        (transaction) => {
          const transactionType =
            transaction.type === "income"
              ? "income"
              : "expense";

          /*
            Use the database ID when available.

            The fallback ID is created from permanent
            transaction values. It does not change after
            login or page refresh.
          */

          const fallbackId = [
            transactionType,
            transaction.title,
            transaction.category,
            transaction.amount,
            transaction.date,
          ]
            .map(normalizeIdPart)
            .join("-");

          const notificationId =
            `transaction-${
              transaction.id ||
              fallbackId
            }`;

          items.push({
            id: notificationId,

            title:
              transactionType === "income"
                ? "Income added"
                : "Expense added",

            message: `${
              transaction.title ||
              transaction.category ||
              "Transaction"
            } • ₹${getSafeNumber(
              transaction.amount
            ).toLocaleString("en-IN")}`,

            type: transactionType,

            createdAt:
              transaction.createdAt ||
              transaction.created_at ||
              transaction.date ||
              "1970-01-01T00:00:00.000Z",
          });
        }
      );

      /* Budget alerts */

      budgets.forEach((budget) => {
        const category =
          budget.category ||
          "General";

        const budgetAmount =
          getSafeNumber(
            budget.amount ??
              budget.limit ??
              budget.budgetAmount
          );

        const spent = transactions
          .filter((transaction) => {
            return (
              transaction.type ===
                "expense" &&
              String(
                transaction.category || ""
              ).toLowerCase() ===
                String(
                  category
                ).toLowerCase()
            );
          })
          .reduce(
            (total, transaction) =>
              total +
              getSafeNumber(
                transaction.amount
              ),
            0
          );

        const percentage =
          budgetAmount > 0
            ? (spent / budgetAmount) *
              100
            : 0;

        if (percentage < 80) {
          return;
        }

        const alertLevel =
          percentage >= 100
            ? "exceeded"
            : "warning";

        const budgetId =
          budget.id ||
          normalizeIdPart(category);

        items.push({
          id: `budget-${budgetId}-${alertLevel}`,

          title:
            percentage >= 100
              ? "Budget exceeded"
              : "Budget warning",

          message: `${category} budget is ${percentage.toFixed(
            0
          )}% used.`,

          type:
            percentage >= 100
              ? "danger"
              : "warning",

          createdAt:
            budget.updatedAt ||
            budget.updated_at ||
            budget.createdAt ||
            budget.created_at ||
            "1970-01-01T00:00:00.000Z",
        });
      });

      /* Completed goals */

      goals.forEach((goal) => {
        const targetAmount =
          getSafeNumber(
            goal.targetAmount ??
              goal.target_amount ??
              goal.target ??
              goal.amount
          );

        const savedAmount =
          getSafeNumber(
            goal.savedAmount ??
              goal.saved_amount ??
              goal.saved
          );

        const completed =
          targetAmount > 0 &&
          savedAmount >= targetAmount;

        if (!completed) {
          return;
        }

        const goalId =
          goal.id ||
          normalizeIdPart(goal.title);

        items.push({
          id: `goal-${goalId}-completed`,

          title: "Goal achieved 🎉",

          message:
            goal.title ||
            "Savings goal completed.",

          type: "success",

          createdAt:
            goal.updatedAt ||
            goal.updated_at ||
            goal.deadline ||
            goal.createdAt ||
            goal.created_at ||
            "1970-01-01T00:00:00.000Z",
        });
      });

      return items.sort(
        (first, second) =>
          getTimestamp(
            second.createdAt
          ) -
          getTimestamp(
            first.createdAt
          )
      );
    }, [
      userId,
      transactions,
      budgets,
      goals,
    ]);

  /* =======================================================
     APPLY READ AND DISMISSED STATE
  ======================================================= */

  const notifications =
    useMemo(() => {
      const readIds = new Set(
        notificationState.readIds
      );

      const dismissedIds =
        new Set(
          notificationState.dismissedIds
        );

      return generatedNotifications
        .filter(
          (notification) =>
            !dismissedIds.has(
              notification.id
            )
        )
        .map((notification) => ({
          ...notification,

          read: readIds.has(
            notification.id
          ),
        }));
    }, [
      generatedNotifications,
      notificationState,
    ]);

  const unreadCount =
    useMemo(() => {
      return notifications.filter(
        (notification) =>
          !notification.read
      ).length;
    }, [notifications]);

  /* =======================================================
     MARK ONE AS READ
  ======================================================= */

  const markAsRead =
    useCallback(
      (notificationId) => {
        updateNotificationState(
          (currentState) => {
            if (
              currentState.readIds.includes(
                notificationId
              )
            ) {
              return currentState;
            }

            return {
              ...currentState,

              readIds: [
                ...currentState.readIds,
                notificationId,
              ],
            };
          }
        );
      },
      [updateNotificationState]
    );

  /* =======================================================
     MARK ALL AS READ
  ======================================================= */

  const markAllAsRead =
    useCallback(() => {
      const visibleIds =
        notifications.map(
          (notification) =>
            notification.id
        );

      updateNotificationState(
        (currentState) => ({
          ...currentState,

          readIds: Array.from(
            new Set([
              ...currentState.readIds,
              ...visibleIds,
            ])
          ),
        })
      );
    }, [
      notifications,
      updateNotificationState,
    ]);

  /* =======================================================
     DISMISS ONE
  ======================================================= */

  const dismissNotification =
    useCallback(
      (notificationId) => {
        updateNotificationState(
          (currentState) => ({
            ...currentState,

            dismissedIds: Array.from(
              new Set([
                ...currentState.dismissedIds,
                notificationId,
              ])
            ),
          })
        );
      },
      [updateNotificationState]
    );

  /* =======================================================
     CLEAR ALL
  ======================================================= */

  const clearAll =
    useCallback(() => {
      const visibleIds =
        notifications.map(
          (notification) =>
            notification.id
        );

      updateNotificationState(
        (currentState) => ({
          ...currentState,

          dismissedIds: Array.from(
            new Set([
              ...currentState.dismissedIds,
              ...visibleIds,
            ])
          ),
        })
      );
    }, [
      notifications,
      updateNotificationState,
    ]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,

      markAsRead,
      markAllAsRead,
      dismissNotification,
      clearAll,
    }),
    [
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      dismissNotification,
      clearAll,
    ]
  );

  return (
    <NotificationContext.Provider
      value={value}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;