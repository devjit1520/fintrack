import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import useFinance from "../hooks/useFinance";
import useBudget from "../hooks/useBudget";
import useGoal from "../hooks/useGoal";

export const NotificationContext =
  createContext(null);

const STORAGE_KEY =
  "fintrack-notification-state";

function getSafeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
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

function readNotificationState() {
  try {
    const stored =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!stored) {
      return {
        readIds: [],
        dismissedIds: [],
      };
    }

    const parsed =
      JSON.parse(stored);

    return {
      readIds: Array.isArray(
        parsed.readIds
      )
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
      "Unable to read notification state:",
      error
    );

    return {
      readIds: [],
      dismissedIds: [],
    };
  }
}

function NotificationProvider({
  children,
}) {
  const {
    transactions = [],
  } = useFinance();

  const {
    budgets = [],
  } = useBudget();

  const {
    goals = [],
  } = useGoal();

  const [
    notificationState,
    setNotificationState,
  ] = useState(
    readNotificationState
  );

  /* =======================================================
     CREATE STABLE NOTIFICATIONS
  ======================================================= */

  const generatedNotifications =
    useMemo(() => {
      const items = [];

      /* Latest transactions */

      const latestTransactions = [
        ...transactions,
      ]
        .sort((a, b) => {
          const first =
            getTimestamp(
              a.createdAt ||
                a.created_at ||
                a.date
            );

          const second =
            getTimestamp(
              b.createdAt ||
                b.created_at ||
                b.date
            );

          return second - first;
        })
        .slice(0, 5);

      latestTransactions.forEach(
        (transaction, index) => {
          const type =
            transaction.type ===
            "income"
              ? "income"
              : "expense";

          const fallbackId = [
            type,
            transaction.date,
            transaction.category,
            transaction.amount,
            index,
          ].join("-");

          items.push({
            id: `transaction-${
              transaction.id ||
              fallbackId
            }`,

            title:
              type === "income"
                ? "Income added"
                : "Expense added",

            message: `${
              transaction.title ||
              transaction.category ||
              "Transaction"
            } • ₹${getSafeNumber(
              transaction.amount
            ).toLocaleString(
              "en-IN"
            )}`,

            type,

            createdAt:
              transaction.createdAt ||
              transaction.created_at ||
              transaction.date ||
              new Date().toISOString(),
          });
        }
      );

      /* Budget alerts */

      budgets.forEach((budget) => {
        const category =
          budget.category ||
          "General";

        const limit =
          getSafeNumber(
            budget.amount ??
              budget.limit ??
              budget.budgetAmount
          );

        const spent =
          transactions
            .filter(
              (transaction) =>
                transaction.type ===
                  "expense" &&
                String(
                  transaction.category ||
                    ""
                ).toLowerCase() ===
                  String(
                    category
                  ).toLowerCase()
            )
            .reduce(
              (total, transaction) =>
                total +
                getSafeNumber(
                  transaction.amount
                ),
              0
            );

        const percentage =
          limit > 0
            ? (spent / limit) * 100
            : 0;

        if (percentage >= 80) {
          const level =
            percentage >= 100
              ? "exceeded"
              : "warning";

          items.push({
            id: `budget-${
              budget.id ||
              category
            }-${level}`,

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
              new Date().toISOString(),
          });
        }
      });

      /* Completed goals */

      goals.forEach((goal) => {
        const saved =
          getSafeNumber(
            goal.savedAmount ??
              goal.saved_amount ??
              goal.saved
          );

        const target =
          getSafeNumber(
            goal.targetAmount ??
              goal.target_amount ??
              goal.target ??
              goal.amount
          );

        const completed =
          target > 0 &&
          saved >= target;

        if (completed) {
          items.push({
            id: `goal-${
              goal.id ||
              goal.title
            }-completed`,

            title:
              "Goal achieved 🎉",

            message:
              goal.title ||
              "Savings goal completed.",

            type: "success",

            createdAt:
              goal.updatedAt ||
              goal.updated_at ||
              new Date().toISOString(),
          });
        }
      });

      return items.sort(
        (a, b) =>
          getTimestamp(
            b.createdAt
          ) -
          getTimestamp(
            a.createdAt
          )
      );
    }, [
      transactions,
      budgets,
      goals,
    ]);

  /* =======================================================
     SAVE READ/DISMISSED STATE
  ======================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          notificationState
        )
      );
    } catch (error) {
      console.error(
        "Unable to save notification state:",
        error
      );
    }
  }, [notificationState]);

  /* =======================================================
     DISPLAYED NOTIFICATIONS
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
    useMemo(
      () =>
        notifications.filter(
          (notification) =>
            !notification.read
        ).length,
      [notifications]
    );

  /* =======================================================
     ACTIONS
  ======================================================= */

  const markAsRead =
    useCallback(
      (notificationId) => {
        setNotificationState(
          (current) => {
            if (
              current.readIds.includes(
                notificationId
              )
            ) {
              return current;
            }

            return {
              ...current,

              readIds: [
                ...current.readIds,
                notificationId,
              ],
            };
          }
        );
      },
      []
    );

  const markAllAsRead =
    useCallback(() => {
      const currentIds =
        notifications.map(
          (notification) =>
            notification.id
        );

      setNotificationState(
        (current) => ({
          ...current,

          readIds: Array.from(
            new Set([
              ...current.readIds,
              ...currentIds,
            ])
          ),
        })
      );
    }, [notifications]);

  const dismissNotification =
    useCallback(
      (notificationId) => {
        setNotificationState(
          (current) => ({
            ...current,

            dismissedIds:
              Array.from(
                new Set([
                  ...current.dismissedIds,
                  notificationId,
                ])
              ),
          })
        );
      },
      []
    );

  const clearAll =
    useCallback(() => {
      const currentIds =
        notifications.map(
          (notification) =>
            notification.id
        );

      setNotificationState(
        (current) => ({
          ...current,

          dismissedIds:
            Array.from(
              new Set([
                ...current.dismissedIds,
                ...currentIds,
              ])
            ),
        })
      );
    }, [notifications]);

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